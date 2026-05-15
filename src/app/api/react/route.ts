import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getReactionState } from '@/lib/reactions-server';
import {
  issueReactionCookie,
  newCookieUuid,
  resolveReactionIdentity,
} from '@/lib/reaction-identity';
import { REACTION_EMOJIS, type Emoji, type ReactionIdentity } from '@/lib/reactions';

/**
 * POST /api/react
 *
 * Body: { post_slug: string, emoji: Emoji }
 *
 * Toggles the reaction: if the (post, emoji, identity) tuple already
 * exists in Postgres, it's removed; otherwise inserted. Returns the
 * updated counts + mine state so the client can settle to the
 * server's truth.
 *
 * Identity resolution:
 *   - auth'd visitor → row.user_id = session.user.id
 *   - anon visitor   → row.cookie_id = signed-cookie uuid (set on
 *                       first POST if absent or invalid)
 *
 * Anonymous abuse surface is bounded by the unique indexes
 * (reactions_unique_user, reactions_unique_cookie): each identity can
 * have at most one row per (post_slug, emoji). The HMAC-signed cookie
 * prevents trivial spoofing — a tampered value fails verifyCookieId
 * and the request gets a fresh UUID rather than picking up a foreign
 * identity.
 */

const VALID_EMOJIS = new Set(REACTION_EMOJIS.map((e) => e.key));

type Body = { post_slug?: unknown; emoji?: unknown };

export async function POST(req: Request) {
  /* Validate body first — a bad payload deserves 400 even if the
     database isn't reachable. */
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const postSlug = typeof body.post_slug === 'string' ? body.post_slug.trim() : '';
  const emoji = typeof body.emoji === 'string' ? (body.emoji as Emoji) : '';

  if (!postSlug || postSlug.length > 120) {
    return NextResponse.json({ ok: false, error: 'invalid post_slug' }, { status: 400 });
  }
  if (!VALID_EMOJIS.has(emoji as Emoji)) {
    return NextResponse.json({ ok: false, error: 'invalid emoji' }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { ok: false, error: 'database not configured' },
      { status: 503 }
    );
  }

  /* Resolve identity (or issue a fresh anon cookie if needed) */
  let identity = await resolveReactionIdentity();
  if (identity.kind === 'none') {
    const uuid = newCookieUuid();
    await issueReactionCookie(uuid);
    identity = { kind: 'cookie', cookieId: uuid };
  }

  /* Toggle */
  let toggled: 'on' | 'off';
  try {
    toggled = await toggleReaction(postSlug, emoji as Emoji, identity);
  } catch (err) {
    /* The most common failure is a missing reactions table (schema.sql
       not applied yet). Surface a 503 so the client knows to retry
       later but doesn't loop on a 500. */
    const msg = err instanceof Error ? err.message : 'database error';
    return NextResponse.json(
      { ok: false, error: 'database error', detail: msg },
      { status: 503 }
    );
  }

  const { counts, mine } = await getReactionState(postSlug, identity);
  return NextResponse.json({ ok: true, toggled, counts, mine });
}

/**
 * Atomic toggle: if a row exists for this (post, emoji, identity)
 * tuple, delete it; otherwise insert. Returns 'on' (inserted) or
 * 'off' (deleted) so the caller / analytics can branch on the
 * outcome.
 */
async function toggleReaction(
  postSlug: string,
  emoji: Emoji,
  identity: Exclude<ReactionIdentity, { kind: 'none' }>
): Promise<'on' | 'off'> {
  if (identity.kind === 'user') {
    const deleted = await sql<{ id: string }>`
      DELETE FROM reactions
      WHERE post_slug = ${postSlug}
        AND emoji = ${emoji}
        AND user_id = ${identity.userId}
      RETURNING id;
    `;
    if (deleted.length > 0) return 'off';

    await sql`
      INSERT INTO reactions (post_slug, emoji, user_id)
      VALUES (${postSlug}, ${emoji}, ${identity.userId})
      ON CONFLICT DO NOTHING;
    `;
    return 'on';
  }

  /* anon cookie */
  const deleted = await sql<{ id: string }>`
    DELETE FROM reactions
    WHERE post_slug = ${postSlug}
      AND emoji = ${emoji}
      AND cookie_id = ${identity.cookieId}
    RETURNING id;
  `;
  if (deleted.length > 0) return 'off';

  await sql`
    INSERT INTO reactions (post_slug, emoji, cookie_id)
    VALUES (${postSlug}, ${emoji}, ${identity.cookieId})
    ON CONFLICT DO NOTHING;
  `;
  return 'on';
}

export function GET() {
  return NextResponse.json({
    ok: true,
    note: 'POST { post_slug, emoji } to toggle a reaction. GET is a health check.',
  });
}
