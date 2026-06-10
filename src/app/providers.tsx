'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { plausible } from '@/lib/plausible';

type ThemePref = 'system' | 'dark' | 'light';
type Resolved = 'dark' | 'light';

interface ThemeContextValue {
  /** Preference: system | dark | light. */
  theme: ThemePref;
  /** Resolved appearance right now. */
  resolved: Resolved;
  /** Set the preference directly. */
  setTheme: (pref: ThemePref) => void;
  /** Cycle System → Light → Dark → System. */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  resolved: 'dark',
  setTheme: () => {},
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

function systemResolved(): Resolved {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const NEXT: Record<ThemePref, ThemePref> = { system: 'light', light: 'dark', dark: 'system' };

export function Providers({ children }: { children: React.ReactNode }) {
  // Default to 'system'; a saved 'dark'/'light' is respected as a pin.
  const [theme, setThemeState] = useState<ThemePref>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ss_theme') as ThemePref | null;
    const pref: ThemePref =
      stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage, an external store
    setThemeState(pref);
    setMounted(true);
  }, []);

  // Apply the resolved class + persist the preference.
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const r: Resolved = theme === 'system' ? systemResolved() : theme;
    root.classList.toggle('dark', r === 'dark');
    root.classList.toggle('light', r === 'light');
    localStorage.setItem('ss_theme', theme);
  }, [theme, mounted]);

  // Live OS day/night follow while preference is 'system'.
  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme !== 'system') return;
      const r = systemResolved();
      const root = document.documentElement;
      root.classList.toggle('dark', r === 'dark');
      root.classList.toggle('light', r === 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, mounted]);

  /* Reveal animation — runs after each render */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elements = document.querySelectorAll('.reveal');

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  function setTheme(next: ThemePref) {
    setThemeState(next);
    plausible('theme_toggled', { props: { theme: next } });
  }
  function toggle() {
    setTheme(NEXT[theme]);
  }

  const resolved: Resolved =
    !mounted || typeof window === 'undefined'
      ? 'dark'
      : theme === 'system'
        ? systemResolved()
        : theme;

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
