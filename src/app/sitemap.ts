import type { MetadataRoute } from 'next';
import { SERIES_SEEDS } from '@/lib/series-seeds';

const BASE = 'https://sharpsighted.studio';

/**
 * Sitemap. Lists only routes that currently exist and respond with
 * 2xx — entries for unshipped routes get re-added by the step that
 * ships them. Step 11 (SEO) will swap the seed-based series listing
 * here for a Sanity-driven enumeration so the sitemap reflects the
 * actual published catalog.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/join`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/series`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...SERIES_SEEDS.map((s) => ({
      url: `${BASE}/series/${s.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    { url: `${BASE}/journal`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    /* Individual /journal/[slug] entries get added by step 11, when
       the sitemap learns to enumerate Sanity content at build time. */
  ];
}
