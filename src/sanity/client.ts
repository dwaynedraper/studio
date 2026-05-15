import { createClient } from 'next-sanity';
import { apiVersion, apiToken, dataset, projectId } from './env';

/**
 * Public read client. Used by server components rendering /journal, /series,
 * /10-percent, /feed, and the homepage. CDN caching is on by default — fast
 * reads, slightly stale data. Revalidation is event-driven via the Sanity
 * webhook (see /api/sanity-webhook).
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

/**
 * Write/preview client. Server-only. Used by Sanity webhook handlers and
 * any future preview routes. Skips the CDN.
 */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: apiToken,
  perspective: 'previewDrafts',
});
