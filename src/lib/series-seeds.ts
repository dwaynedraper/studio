/**
 * The six Sharp Sighted series — skeleton metadata for both the
 * pre-Sanity "coming soon" rendering on /series and the NDJSON seed
 * file at seed/series.ndjson.
 *
 * Authoritative content (tagline, description, cover image) lives in
 * Sanity once Dean imports the seeds and edits in Studio. Once Sanity
 * has rows, the pages query it and these skeletons stop being read.
 *
 * Badge and pillar are my best inferences from the brand bible and
 * architecture spec — Dean can flip either via Studio without code
 * changes.
 *
 *   badge   — "Magnet | Funnel | Authority | Flagship" per the Media
 *             Roadmap content classification (architecture spec §5 / §6).
 *   pillar  — the series' centre of gravity. Every series carries
 *             every pillar; this is the strongest pull.
 *   order   — display order on /series and the homepage tile grid.
 */

import type { Pillar } from './branding';

export type SeriesBadge = 'magnet' | 'funnel' | 'authority' | 'flagship';

export interface SeriesSeed {
  slug: string;
  title: string;
  badge: SeriesBadge;
  pillar: Pillar;
  tagline: string;
  order: number;
}

export const SERIES_SEEDS: SeriesSeed[] = [
  {
    slug: 'bartographer',
    title: 'Bartographer',
    badge: 'magnet',
    pillar: 'human',
    tagline: '',
    order: 10,
  },
  {
    slug: 'special-moments',
    title: 'Special Moments',
    badge: 'funnel',
    pillar: 'seen',
    tagline: '',
    order: 20,
  },
  {
    slug: 'corridor',
    title: 'Corridor',
    badge: 'authority',
    pillar: 'sharp',
    tagline: '',
    order: 30,
  },
  {
    slug: 'home-architecture',
    title: 'Home Architecture',
    badge: 'authority',
    pillar: 'sharp',
    tagline: '',
    order: 40,
  },
  {
    slug: 'alpha-architect',
    title: 'Alpha Architect',
    badge: 'authority',
    pillar: 'sharp',
    tagline: '',
    order: 50,
  },
  {
    slug: 'ripped-or-stamped',
    title: 'Ripped or Stamped',
    badge: 'flagship',
    pillar: 'human',
    /* The only seed with copy I have a source for — CLAUDE.md describes
       RoS as "a radical reality series about photography and fine art
       printing." Dean to refine in Studio. */
    tagline: 'A radical reality series about photography and fine art printing.',
    order: 60,
  },
];

/* ─── Badge presentation ───────────────────────────────────────────── */

export const BADGE_LABEL: Record<SeriesBadge, string> = {
  magnet: 'Magnet',
  funnel: 'Funnel',
  authority: 'Authority',
  flagship: 'Flagship',
};

/* All badges currently render in terracotta to keep the visual
   register coherent on Studio. If we want per-badge hue differentiation
   later, swap this map. */
export const BADGE_HEX: Record<SeriesBadge, string> = {
  magnet: '#c25f3e',
  funnel: '#a0462a',
  authority: '#6e2f1b',
  flagship: '#a0462a',
};
