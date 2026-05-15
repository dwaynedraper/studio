import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { getCurrentUser } from './auth-helpers';
import type { ReactionIdentity } from './reactions';

/**
 * Reaction-identity helpers (server-only).
 *
 * Anonymous reactions are bound to a UUID stored in an HMAC-signed,
 * HTTP-only cookie called `ss_reaction_id`. Authenticated reactions
 * are bound to the user's internal id (session.user.id). The
 * `resolveReactionIdentity()` helper consolidates both flows so the
 * journal page and the /api/react handler see the same shape.
 *
 * The cookie format is `<uuid>.<base64url-hmac-sha256>`. We sign with
 * AUTH_SECRET (the same key Auth.js v5 already requires) so we don't
 * have to manage a separate signing secret. Tampered cookies fail the
 * verify and are treated as no-identity (no "mine" markers, a fresh
 * UUID gets issued on the next POST).
 */

const COOKIE_NAME = 'ss_reaction_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; /* one year per spec §13 */

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    throw new Error(
      'AUTH_SECRET is not set — required for signing reaction cookies. See .env.example.'
    );
  }
  return s;
}

function sign(uuid: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(uuid)
    .digest('base64url');
}

export function signCookieId(uuid: string): string {
  return `${uuid}.${sign(uuid)}`;
}

/**
 * Returns the UUID if the cookie value is intact and its signature
 * matches, otherwise null. Uses timingSafeEqual to avoid leaking
 * comparison time.
 */
export function verifyCookieId(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot <= 0) return null;
  const uuid = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!uuid || !sig) return null;

  const expected = sign(uuid);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;

  try {
    if (crypto.timingSafeEqual(a, b)) return uuid;
  } catch {
    /* Buffer.from on malformed base64url may still produce mismatched
       lengths; timingSafeEqual would throw. Treat as invalid. */
  }
  return null;
}

/**
 * Resolves the visitor's reaction identity. Auth'd visitors win; an
 * anonymous visitor with a valid signed cookie comes next; anyone
 * else is `{ kind: 'none' }`. Server-only.
 */
export async function resolveReactionIdentity(): Promise<ReactionIdentity> {
  const user = await getCurrentUser();
  if (user?.id) return { kind: 'user', userId: user.id };

  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  const verified = verifyCookieId(raw);
  if (verified) return { kind: 'cookie', cookieId: verified };

  return { kind: 'none' };
}

/**
 * Sets the signed cookie on the current response. Call from a Route
 * Handler (Next.js permits cookies().set there). For Server Components
 * the cookie can only be read, not set — use a Server Action or POST
 * route to issue it.
 */
export async function issueReactionCookie(uuid: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, signCookieId(uuid), {
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });
}

/** Generates a fresh UUID for first-time anon visitors. */
export function newCookieUuid(): string {
  return crypto.randomUUID();
}
