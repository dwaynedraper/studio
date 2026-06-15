'use client';

import Link from 'next/link';

const branches = [
  {
    label: 'Photos',
    domain: 'sharpsighted.photos',
    href: 'https://sharpsighted.photos',
    pillarColor: '#38bdf8',
  },
  {
    label: 'Media',
    domain: 'sharpsighted.media',
    href: 'https://sharpsighted.media',
    pillarColor: '#c9922a',
  },
  {
    label: 'Studio',
    domain: 'sharpsighted.studio',
    href: 'https://sharpsighted.studio',
    pillarColor: '#a0462a',
  },
];

interface FooterProps {
  activeSite?: 'hub' | 'photos' | 'media' | 'studio';
}

export default function Footer({ activeSite = 'studio' }: FooterProps) {
  return (
    <footer
      className="mt-auto"
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-275 mx-auto px-5 md:px-10 py-12 md:py-16">
        {/* Wordmark + tagline */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ApertureMark />
            <span
              className="text-sm font-sans font-semibold tracking-[0.2em] uppercase"
              style={{ color: 'var(--brand-cyan)' }}
            >
              Sharp Sighted
            </span>
          </div>
          <p
            className="text-xs tracking-[0.14em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            Stay Sharp. Stay Seen. Stay Human.
          </p>
          <address className="not-italic mt-4 flex flex-col gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--text)' }}>Sharp Sighted Studio</span>
            <a href="tel:+12142335338" className="hover:text-(--text) transition-colors duration-200">(214) 233-5338</a>
            <a href="mailto:dean@sharpsightedstudio.com" className="hover:text-(--text) transition-colors duration-200">dean@sharpsightedstudio.com</a>
            <span>Serving the DFW 121 corridor &amp; North Texas</span>
          </address>
        </div>

        {/* Property links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {branches.map((b) => (
            <BranchLink
              key={b.label}
              label={b.label}
              domain={b.domain}
              href={b.href}
              pillarColor={b.pillarColor}
              isActive={activeSite === b.label.toLowerCase()}
            />
          ))}
          <HubLink isActive={activeSite === 'hub'} />
        </div>

        {/* Secondary nav */}
        <div
          className="flex flex-wrap gap-x-6 gap-y-2 text-xs tracking-[0.12em] uppercase mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          <Link href="/about" className="hover:text-(--text) transition-colors duration-200">
            About
          </Link>
          <Link href="/series" className="hover:text-(--text) transition-colors duration-200">
            Series
          </Link>
          <Link href="/journal" className="hover:text-(--text) transition-colors duration-200">
            Journal
          </Link>
          <Link href="/10-percent" className="hover:text-(--text) transition-colors duration-200">
            10%
          </Link>
          <Link href="/join" className="hover:text-(--text) transition-colors duration-200">
            Join Discord
          </Link>
          <a
            href="https://sharpsightedstudio.com/?reset=true"
            className="hover:text-(--text) transition-colors duration-200"
          >
            Switch site →
          </a>
        </div>

        {/* Legal */}
        <p
          className="text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          © 2026 Sharp Sighted Studio · Dean Draper · North Texas
        </p>
      </div>
    </footer>
  );
}

function BranchLink({
  label,
  domain,
  href,
  pillarColor,
  isActive,
}: {
  label: string;
  domain: string;
  href: string;
  pillarColor: string;
  isActive: boolean;
}) {
  if (isActive) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
        <span className="text-xs" style={{ color: 'var(--text)' }}>
          <span className="font-medium tracking-[0.06em]">{label}</span>
          <span className="ml-2" style={{ color: 'var(--text-muted)' }}>{domain}</span>
        </span>
      </div>
    );
  }

  return (
    <a
      href={href}
      className="flex items-center gap-2 group"
      style={{ color: 'var(--text-mid)' }}
      rel="noopener noreferrer"
    >
      <span className="text-xs">
        <span
          className="font-medium tracking-[0.06em] transition-colors duration-200"
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.color = pillarColor)
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.color = '')
          }
        >
          {label}
        </span>
        <span
          className="ml-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {domain}
        </span>
      </span>
      <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>→</span>
    </a>
  );
}

function HubLink({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
          style={{ background: 'var(--brand-cyan)' }}
          aria-hidden="true"
        />
        <span className="text-xs" style={{ color: 'var(--text)' }}>
          <span className="font-medium tracking-[0.06em]">Hub</span>
          <span className="ml-2" style={{ color: 'var(--text-muted)' }}>sharpsightedstudio.com</span>
        </span>
      </div>
    );
  }

  return (
    <a
      href="https://sharpsightedstudio.com"
      className="flex items-center gap-2 group"
      style={{ color: 'var(--text-mid)' }}
    >
      <span className="text-xs">
        <span
          className="font-medium tracking-[0.06em] group-hover:text-(--brand-cyan) transition-colors duration-200"
        >
          Hub
        </span>
        <span className="ml-2" style={{ color: 'var(--text-muted)' }}>
          sharpsightedstudio.com
        </span>
      </span>
      <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>→</span>
    </a>
  );
}

function ApertureMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#38bdf8" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" fill="#38bdf8" />
      <line x1="12" y1="2" x2="12" y2="8.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="15.5" x2="12" y2="22" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="2" y1="12" x2="8.5" y2="12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15.5" y1="12" x2="22" y2="12" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.93" y1="4.93" x2="9.52" y2="9.52" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14.48" y1="14.48" x2="19.07" y2="19.07" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19.07" y1="4.93" x2="14.48" y2="9.52" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.52" y1="14.48" x2="4.93" y2="19.07" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
