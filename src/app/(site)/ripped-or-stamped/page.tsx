import type { Metadata } from 'next';
import { DISCORD_INVITE_URL, TAGLINE } from '@/lib/branding';

export const metadata: Metadata = {
  alternates: { canonical: '/ripped-or-stamped' },
  title: 'Ripped or Stamped',
  description:
    'A status update on Ripped or Stamped: The Architect’s Journey — the radical-reality series following Dean Draper from working photographer to fine art printer.',
};

/**
 * Ripped or Stamped — project status page.
 *
 * The permanent, canonical home for project news while the show is in
 * its build phase. Build-phase framing only: premise, the Board, the
 * Discord, and the build work — nothing about the gallery, tickets, or
 * the contents of the New Standard. The update log grows over time.
 */

const UPDATES: { date: string; text: string }[] = [
  {
    date: 'May 2026',
    text: 'Status page goes live. The format and structure of the show are locked. The foundational build is underway.',
  },
];

export default function RippedOrStampedPage() {
  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Ripped or Stamped</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
              color: 'var(--text)',
            }}
          >
            The Architect’s
            <br />
            <em style={{ color: 'var(--accent)' }}>Journey.</em>
          </h1>
          <div className="mt-8">
            <span
              className="inline-block text-xs tracking-[0.2em] uppercase font-semibold"
              style={{
                color: 'var(--accent)',
                background: 'var(--surface-warm)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem 0.85rem',
              }}
            >
              In Build · May 2026
            </span>
          </div>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A radical-reality series about learning fine art printing in public, and an
            honest record of what it takes to build one.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── What the show is ───────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The show</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            What Ripped or Stamped <em style={{ color: 'var(--accent)' }}>is.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Ripped or Stamped: The Architect’s Journey is a fifty-plus episode radical-reality
            series following my path from working photographer to fine art printer. The series
            builds toward one goal, a New Standard for fine art printing, revealed in the final
            episodes when I take on the last challenge. Everything before that is the journey to
            get there.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Every episode puts one of my print attempts in front of a Board of Aesthetic
            Review. The print has to pass two tests at once. It must hold up to the mechanics of
            the printing process, and it must complete the photographic challenge it was built
            around. If it fails either, it is ripped on camera. If it clears both, it is
            archived as a Blueprint.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The cameras keep rolling through the successes, the failures, and the cursing on the
            days mastery does not come quickly. The show is about a photographer learning in
            public, and the hope that other photographers find encouragement in the process.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Where the project stands ───────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-warm)' }}>
        <div className="container-narrow">
          <p className="eyebrow">Where the project stands</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            This is not a delay. <em style={{ color: 'var(--accent)' }}>It is the build.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A show like this carries far more behind it than a camera and a printer. Doing it
            right means legal groundwork. It means licensing and rights. It means equipment, a
            format to lock, a Board to assemble, and the technical backbone that will run the
            community side of the show. Most of that work never appears on screen, and all of it
            has to be solid before a first episode is worth your time.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            That is the phase the project is in now. The shape of the show is locked. The
            format, the structure, the rules that make it what it is. What is being built today
            is everything underneath it.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A series about refusing to cut corners on the craft cannot cut corners on its own
            foundation.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── The community ──────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The community</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            The conversation lives <em style={{ color: 'var(--accent)' }}>on Discord.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The community has a home, and it is Discord. It is a free, open forum, and it is the
            true home of everything Ripped or Stamped. The website and the Discord stay in step
            as the project moves, but Discord is where the conversation actually happens, and
            where the show is being built in the open. The door is open.
          </p>
          <div className="mt-8">
            <a
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Join the Discord →
            </a>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Updates ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">Updates</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Where the <em style={{ color: 'var(--accent)' }}>news lives.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            As each piece locks into place, the news posts here. This page is its permanent
            home, and the log below grows with every update.
          </p>

          <div className="mt-10 max-w-2xl">
            {UPDATES.map((u) => (
              <div
                key={u.date}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-6 py-5"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <p
                  className="text-xs tracking-[0.18em] uppercase font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {u.date}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-mid)' }}
                >
                  {u.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing tagline ────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow text-center">
          <p
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {TAGLINE}
          </p>
        </div>
      </section>
    </article>
  );
}
