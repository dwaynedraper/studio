'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { plausible } from '@/lib/plausible';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('ss_theme') as Theme | null;
    const resolved: Theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage, an external store
    setTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
    localStorage.setItem('ss_theme', theme);
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

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    plausible('theme_toggled', { props: { theme: next } });
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
