'use client';

import Link from 'next/link';
import { useTheme } from '@/app/providers';

export default function Nav() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 h-14"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 group"
        aria-label="Sharp Sighted Studio — return to homepage"
      >
        <ApertureMark />
        <span
          className="text-xs font-sans font-semibold tracking-[0.2em] uppercase"
          style={{ color: 'var(--brand-cyan)' }}
        >
          Sharp Sighted
        </span>
        <span
          className="text-xs font-sans tracking-[0.2em] uppercase hidden sm:inline"
          style={{ color: 'var(--accent)' }}
        >
          · Studio
        </span>
      </Link>

      <div className="flex items-center gap-5">
        <Link
          href="/about"
          className="text-xs tracking-[0.12em] uppercase hidden sm:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          About
        </Link>
        <Link
          href="/journal"
          className="text-xs tracking-[0.12em] uppercase hidden sm:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          Journal
        </Link>
        <Link
          href="/series"
          className="text-xs tracking-[0.12em] uppercase hidden sm:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          Series
        </Link>
        <Link
          href="/ripped-or-stamped"
          className="text-xs tracking-[0.12em] uppercase hidden md:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
          aria-label="Ripped or Stamped"
        >
          RoS
        </Link>
        <Link
          href="/feed"
          className="text-xs tracking-[0.12em] uppercase hidden md:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          Feed
        </Link>
        <Link
          href="/10-percent"
          className="text-xs tracking-[0.12em] uppercase hidden md:inline-block transition-colors duration-200"
          style={{ color: 'var(--text-muted)' }}
        >
          10%
        </Link>
        <Link
          href="/join"
          className="text-xs tracking-[0.12em] uppercase hidden sm:inline-block transition-colors duration-200"
          style={{ color: 'var(--accent)' }}
        >
          Join
        </Link>
        <button
          onClick={toggle}
          aria-pressed={theme === 'light'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded"
          style={{ color: 'var(--text-muted)' }}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  );
}

function ApertureMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
