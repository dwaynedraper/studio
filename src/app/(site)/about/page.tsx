import type { Metadata } from 'next';
import Link from 'next/link';
import {
  PILLARS,
  PROPERTIES,
  CONTACT,
  DISCORD_INVITE_URL,
  TAGLINE,
} from '@/lib/branding';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Sharp Sighted Studio is the channel — the connective tissue of Sharp Sighted, where the journal, series, the 10% Rule, and the community live.',
};

export default function AboutPage() {
  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">About Sharp Sighted Studio</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
              color: 'var(--text)',
            }}
          >
            The channel,
            <br />
            <em style={{ color: 'var(--accent)' }}>not the entity.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            <strong style={{ color: 'var(--text)' }}>Sharp Sighted Studio</strong> is two things,
            and they share a name. The first is a legal entity — the EIN that holds the brand,
            registered to Dean Draper in 2022. The second is this site:{' '}
            <em>sharpsighted.studio</em>, the channel where the work, the people behind it, the
            things we give back, and the conversation that happens around all of it live.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            This site is the connective tissue. It isn’t a sales surface, it isn’t a portfolio,
            and it isn’t a publication. It’s a networking site for a small creative collective.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Pillars ────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The operating philosophy</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Stay Sharp. <em style={{ color: 'var(--accent)' }}>Stay Seen.</em> Stay Human.
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Three pillars run through every Sharp Sighted property. Studio’s centre of gravity
            is <strong style={{ color: 'var(--accent)' }}>Human</strong>, but every branch
            carries every pillar — the alignments below describe each branch’s strongest pull,
            not an exclusion.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((p) => {
              const isHuman = p.id === 'human';
              return (
                <div
                  key={p.id}
                  className="surface-card"
                  style={{
                    /* Highlight Human in terracotta — Studio's primary pillar */
                    background: isHuman ? 'var(--surface-warm-2)' : 'var(--surface-2)',
                    borderColor: isHuman ? 'var(--border-accent)' : 'var(--border)',
                  }}
                >
                  <p
                    className="text-xs tracking-[0.22em] uppercase mb-3"
                    style={{ color: p.accentVar }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="font-serif italic text-lg leading-snug mb-4"
                    style={{ color: 'var(--text)' }}
                  >
                    {p.tagline}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Four properties ───────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The four properties</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            One brand. <em style={{ color: 'var(--accent)' }}>Three specialists.</em> One front
            door.
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Sharp Sighted operates as a single brand with four web properties. The hub is the
            umbrella; the three specialists each carry their own pillar.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROPERTIES.map((property) => {
              const isHere = property.id === 'studio';
              return (
                <a
                  key={property.id}
                  href={property.href}
                  rel="noopener noreferrer"
                  className="surface-card block group transition-colors duration-200"
                  style={{
                    background: isHere ? 'var(--surface-warm)' : 'var(--surface)',
                    borderColor: isHere ? 'var(--border-accent)' : 'var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs tracking-[0.22em] uppercase"
                      style={{ color: property.pillarHex }}
                    >
                      {property.label} {isHere && '· you are here'}
                    </span>
                    {!isHere && (
                      <span
                        aria-hidden="true"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        ↗
                      </span>
                    )}
                  </div>
                  <p
                    className="font-serif italic text-lg leading-snug mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {property.identity}
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {property.domain}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                    {property.blurb}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── 10% Rule ──────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-warm)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The 10% Rule</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Ten percent of the work, <em style={{ color: 'var(--accent)' }}>given.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A standing commitment to give 10% of time, resources, or effort to causes that
            align with the work. Same craft as is charged elsewhere, given freely to the right
            missions. Lives under <strong style={{ color: 'var(--accent)' }}>Human</strong>;
            documented and surfaced here on Studio.
          </p>
          <div className="mt-8">
            <Link href="/10-percent" className="btn-outline">
              See the archive →
            </Link>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Contact ───────────────────────────────────────────────── */}
      <section id="contact" className="section">
        <div className="container-narrow">
          <p className="eyebrow">Get in touch</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Reach <em style={{ color: 'var(--accent)' }}>out.</em>
          </h2>

          <dl className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            <ContactRow label="Email" value={CONTACT.email} href={CONTACT.emailHref} />
            <ContactRow
              label="Business line"
              value={CONTACT.phoneDisplay}
              href={CONTACT.phoneHref}
            />
            <ContactRow
              label="Discord"
              value="Join the conversation"
              href={DISCORD_INVITE_URL}
              external
            />
          </dl>

          <p className="mt-8 text-sm italic" style={{ color: 'var(--text-muted)' }}>
            Email is the most reliable channel. The business line forwards to a cell — answered
            when possible. Service area: {CONTACT.serviceArea}.
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

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <div>
      <dt
        className="text-xs tracking-[0.22em] uppercase mb-2"
        style={{ color: 'var(--accent)' }}
      >
        {label}
      </dt>
      <dd>
        <a
          href={href}
          {...(external ? { rel: 'noopener noreferrer' } : {})}
          className="font-serif text-lg transition-colors duration-200"
          style={{ color: 'var(--text)' }}
        >
          {value}
        </a>
      </dd>
    </div>
  );
}
