import type { Metadata } from 'next';
import { CONTACT, DISCORD_INVITE_URL, TAGLINE } from '@/lib/branding';

export const metadata: Metadata = {
  title: 'Join',
  description:
    'Join the Sharp Sighted Studio Discord, pitch a journal piece, or learn how the collective works.',
};

export default function JoinPage() {
  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Join · The Conversation</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
              color: 'var(--text)',
            }}
          >
            Three doors <em style={{ color: 'var(--accent)' }}>in.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Studio is a networking site for a small creative collective. There are three ways
            to engage — the Discord, the journal, and the long road into the collective itself.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── 1. Discord ─────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-warm)' }}>
        <div className="container-narrow">
          <p className="eyebrow">Door one · The Discord</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Come <em style={{ color: 'var(--accent)' }}>say hi.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The Sharp Sighted Discord is the day-to-day room for the collective. Channels for
            craft talk, gear questions, location finds, group-shoot scheduling, and journal
            pitches. Quiet some weeks, busy others. Photographers, videographers, editors,
            and people who care about the work — all welcome.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <a
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Join the Discord →
            </a>
            <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
              Standing invite. No application.
            </span>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── 2. Pitch the journal ───────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Door two · Pitch a piece</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Write for <em style={{ color: 'var(--accent)' }}>the journal.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The journal is multi-author. Members of the Discord can pitch a piece in the
            <code className="px-1.5 py-0.5 mx-1 text-xs rounded" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>#pitches</code>
            channel or by email. Response within ~2 weeks. Alignment with Sharp Sighted’s
            pillars matters more than credentials — what you’re writing, why it belongs here,
            and how you’d treat it.
          </p>

          <ul
            className="mt-8 space-y-3 text-sm leading-relaxed list-none"
            style={{ color: 'var(--text-mid)' }}
          >
            <li className="flex gap-3">
              <span style={{ color: 'var(--accent)' }}>·</span>
              <span>
                <strong style={{ color: 'var(--text)' }}>Good fits:</strong> craft writing,
                location stories, gear philosophy, behind-the-scenes from a shoot, the human
                side of running a creative practice.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: 'var(--accent)' }}>·</span>
              <span>
                <strong style={{ color: 'var(--text)' }}>Less so:</strong> generic listicles,
                affiliate-driven gear reviews, SEO-bait. The journal is for writing that
                wouldn’t exist anywhere else.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: 'var(--accent)' }}>·</span>
              <span>
                Drafts go through Sanity Studio after the pitch is accepted. Admins review,
                edit, and publish.
              </span>
            </li>
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`mailto:${CONTACT.email}?subject=Journal%20Pitch%20%E2%80%94%20%5Byour%20title%5D&body=Title%3A%0AAngle%3A%0AWhy%20this%20belongs%20on%20Sharp%20Sighted%20Studio%3A%0AAbout%20you%3A%0A%0A%5Brough%20draft%20or%20outline%20here%5D`}
              className="btn-outline"
            >
              Email a pitch →
            </a>
            <a
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Or jump into #pitches →
            </a>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── 3. The collective (V2) ─────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">Door three · The collective</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            By <em style={{ color: 'var(--accent)' }}>relationship.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The Sharp Sighted Studio collective itself is invite-only — there is no formal
            application. Participation in the Discord plus a pattern of good contributions
            leads to invites organically. The bar isn’t portfolio size; it’s the way someone
            shows up.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            If you want to be part of it, start with door one. The rest takes care of itself.
          </p>
        </div>
      </section>

      {/* ── Closing tagline ───────────────────────────────────────── */}
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
