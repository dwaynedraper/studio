/**
 * Reactions — client-safe surface.
 *
 * This module contains only types and constants — nothing that touches
 * Postgres. The server-side fetch lives in `reactions-server.ts`; that
 * file imports `pg` which would otherwise leak into the client bundle
 * via the ReactionsBlock component's imports.
 *
 * Spec mapping (studio-architecture.md §7.2):
 *   💡  useful       Taught me something
 *   ❤️  resonant     This hit
 *   ✨  beautiful    The work itself
 *   🤝  real         Felt honest
 *   🔁  shareworthy  Sending this to someone
 */

export type Emoji = 'useful' | 'resonant' | 'beautiful' | 'real' | 'shareworthy';

export interface EmojiDef {
  key: Emoji;
  glyph: string;
  label: string;
  hint: string;
}

export const REACTION_EMOJIS: EmojiDef[] = [
  { key: 'useful',      glyph: '💡', label: 'Useful',       hint: 'Taught me something' },
  { key: 'resonant',    glyph: '❤️', label: 'Resonant',     hint: 'This hit' },
  { key: 'beautiful',   glyph: '✨', label: 'Beautiful',    hint: 'The work itself' },
  { key: 'real',        glyph: '🤝', label: 'Real',         hint: 'Felt honest' },
  { key: 'shareworthy', glyph: '🔁', label: 'Share-worthy', hint: 'Sending this to someone' },
];

export type ReactionCounts = Record<Emoji, number>;
export type MineState = Record<Emoji, boolean>;

export const EMPTY_COUNTS: ReactionCounts = {
  useful: 0,
  resonant: 0,
  beautiful: 0,
  real: 0,
  shareworthy: 0,
};

export const EMPTY_MINE: MineState = {
  useful: false,
  resonant: false,
  beautiful: false,
  real: false,
  shareworthy: false,
};

/**
 * Visitor identity for reaction binding. Auth'd visitors are keyed by
 * users.id; anon visitors by a signed cookie value (set on first POST
 * in build step 7).
 */
export type ReactionIdentity =
  | { kind: 'user'; userId: string }
  | { kind: 'cookie'; cookieId: string }
  | { kind: 'none' };
