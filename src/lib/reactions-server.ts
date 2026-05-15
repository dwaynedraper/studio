import { sql } from './db';
import {
  EMPTY_COUNTS,
  EMPTY_MINE,
  type Emoji,
  type MineState,
  type ReactionCounts,
  type ReactionIdentity,
} from './reactions';

/**
 * Server-side reaction reads. Lives in its own file so the
 * client-safe constants in `reactions.ts` can be imported by
 * ReactionsBlock without dragging `pg` into the browser bundle. By
 * convention only server components import this module.
 */

/**
 * Returns count-per-emoji and (if identity is provided) the set of
 * emojis the current visitor has already reacted with. Resilient to
 * missing DATABASE_URL — returns zeros so pages render before the
 * Postgres instance is configured.
 */
export async function getReactionState(
  postSlug: string,
  identity: ReactionIdentity = { kind: 'none' }
): Promise<{ counts: ReactionCounts; mine: MineState }> {
  if (!process.env.DATABASE_URL) {
    return { counts: { ...EMPTY_COUNTS }, mine: { ...EMPTY_MINE } };
  }

  try {
    const countRows = await sql<{ emoji: Emoji; count: string }>`
      SELECT emoji, COUNT(*)::text AS count
      FROM reactions
      WHERE post_slug = ${postSlug}
      GROUP BY emoji;
    `;

    const counts: ReactionCounts = { ...EMPTY_COUNTS };
    for (const row of countRows) {
      counts[row.emoji] = parseInt(row.count, 10);
    }

    const mine: MineState = { ...EMPTY_MINE };
    if (identity.kind === 'user') {
      const rows = await sql<{ emoji: Emoji }>`
        SELECT emoji FROM reactions
        WHERE post_slug = ${postSlug} AND user_id = ${identity.userId};
      `;
      for (const row of rows) mine[row.emoji] = true;
    } else if (identity.kind === 'cookie') {
      const rows = await sql<{ emoji: Emoji }>`
        SELECT emoji FROM reactions
        WHERE post_slug = ${postSlug} AND cookie_id = ${identity.cookieId};
      `;
      for (const row of rows) mine[row.emoji] = true;
    }

    return { counts, mine };
  } catch {
    /* Table may not exist yet (schema.sql not applied). Render zeros
       rather than crashing the journal page. */
    return { counts: { ...EMPTY_COUNTS }, mine: { ...EMPTY_MINE } };
  }
}
