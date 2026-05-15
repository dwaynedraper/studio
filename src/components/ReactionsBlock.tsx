'use client';

import { useState } from 'react';
import {
  REACTION_EMOJIS,
  type Emoji,
  type ReactionCounts,
  type MineState,
} from '@/lib/reactions';
import { plausible } from '@/lib/plausible';

/**
 * Reactions block — five emoji buttons at the bottom of every journal
 * post (studio-architecture.md §7.2). Optimistic UI: a click increments
 * the count and flips the "mine" flag immediately, then POSTs to
 * /api/react. On failure the local state reverts.
 *
 * The API endpoint itself ships in build step 7. Until then this
 * component will optimistically update and then revert on the 404 —
 * dev visitors see the visual register; once /api/react exists, the
 * roundtrip succeeds.
 */
export function ReactionsBlock({
  postSlug,
  initialCounts,
  initialMine,
}: {
  postSlug: string;
  initialCounts: ReactionCounts;
  initialMine: MineState;
}) {
  const [counts, setCounts] = useState<ReactionCounts>(initialCounts);
  const [mine, setMine] = useState<MineState>(initialMine);
  const [pending, setPending] = useState<Emoji | null>(null);

  async function react(emoji: Emoji) {
    if (pending) return;
    setPending(emoji);

    const wasMine = mine[emoji];
    const prevCount = counts[emoji];
    /* Optimistic: toggle "mine" and adjust count accordingly. The
       server will return the truth either way; on success we settle
       to the server's number, on failure we revert. */
    setMine((m) => ({ ...m, [emoji]: !wasMine }));
    setCounts((c) => ({ ...c, [emoji]: prevCount + (wasMine ? -1 : 1) }));

    plausible('reaction_clicked', { props: { emoji, post: postSlug } });

    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_slug: postSlug, emoji }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as {
        counts?: ReactionCounts;
        mine?: MineState;
      };
      if (data.counts) setCounts(data.counts);
      if (data.mine) setMine(data.mine);
    } catch {
      /* Revert. The endpoint may not exist yet (step 7) — keep the UI
         honest by snapping back. */
      setMine((m) => ({ ...m, [emoji]: wasMine }));
      setCounts((c) => ({ ...c, [emoji]: prevCount }));
    } finally {
      setPending(null);
    }
  }

  return (
    <section aria-label="Reactions">
      <p
        className="text-xs tracking-[0.22em] uppercase mb-4"
        style={{ color: 'var(--accent)' }}
      >
        How did this land?
      </p>
      <div className="flex flex-wrap gap-2">
        {REACTION_EMOJIS.map(({ key, glyph, label, hint }) => {
          const isMine = mine[key];
          const isPending = pending === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => react(key)}
              disabled={isPending}
              aria-pressed={isMine}
              aria-label={`${label} — ${hint}`}
              title={hint}
              className="inline-flex items-center gap-2 transition-colors duration-200"
              style={{
                padding: '0.55rem 0.95rem',
                background: isMine ? 'var(--accent-dim)' : 'var(--surface-2)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${isMine ? 'var(--border-accent)' : 'var(--border)'}`,
                color: 'var(--text)',
                cursor: isPending ? 'wait' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>
                {glyph}
              </span>
              <span className="text-xs tracking-[0.06em] uppercase">{label}</span>
              <span
                className="text-xs tabular-nums"
                style={{ color: 'var(--text-muted)' }}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>
      <p
        className="mt-3 text-xs italic"
        style={{ color: 'var(--text-muted)' }}
      >
        Anonymous-friendly. One reaction per visitor.
      </p>
    </section>
  );
}
