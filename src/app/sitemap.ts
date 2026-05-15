import type { MetadataRoute } from 'next';

const BASE = 'https://sharpsighted.studio';

/**
 * Static routes for v1. Once Sanity is in place (build step 2), this file
 * will also enumerate /journal/* , /series/* , and /10-percent archive
 * entries by querying Sanity at build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/journal`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/series`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/feed`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.6 },
    { url: `${BASE}/10-percent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
