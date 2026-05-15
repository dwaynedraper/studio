import Link from 'next/link';
import { DISCORD_INVITE_URL, TAGLINE } from '@/lib/branding';

/**
 * Homepage placeholder — assembled into the full 7-block layout in step
 * 10 (after series, journal, reactions, 10% archive, and the social
 * feed are all in place). For now: hero + two CTAs + tagline, just
 * enough to verify the chrome.
 */

export default function Home() {
  return (
    <div className="container-narrow section">
      <p className="eyebrow">Sharp Sighted Studio · The Channel</p>
      <h1
        className="font-serif font-light leading-[1.05]"
        style={{
          fontSize: 'clamp(2.5rem, 8vw, 5.25rem)',
          color: 'var(--text)',
        }}
      >
        Join the conversation <em style={{ color: 'var(--accent)' }}>around the work.</em>
      </h1>
      <p
        className="mt-6 max-w-2xl text-base leading-relaxed"
        style={{ color: 'var(--text-mid)' }}
      >
        A small collective of photographers, videographers, and the people who
        care about the craft. The work, the people behind it, the things we give
        back, and the conversation that happens around all of it.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <a className="btn-primary" href={DISCORD_INVITE_URL} rel="noopener noreferrer">
          Join the Discord →
        </a>
        <Link className="btn-outline" href="/journal">
          Read the journal →
        </Link>
      </div>

      <hr className="shine-line mt-20" />

      <p
        className="mt-10 text-xs tracking-[0.22em] uppercase text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {TAGLINE}
      </p>
    </div>
  );
}
