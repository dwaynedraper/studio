import type { MetadataRoute } from 'next';

const BASE = 'https://sharpsighted.studio';

/**
 * Sitemap. Lists only routes that currently exist and respond with
 * 2xx — entries for unshipped routes get re-added by the step that
 * ships them. Once Sanity content lands (step 5+), this file will
 * also enumerate /journal/* , /series/* , and /10-percent archive
 * entries by querying Sanity at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
