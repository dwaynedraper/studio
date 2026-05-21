import { sql } from '@/lib/db';
import type { FeedItem } from './types';

/**
 * Upsert feed items by `link` (the natural key — every platform gives
 * each post a permanent URL). The cron runs every 30 minutes, so most
 * fetches return items we've already stored; ON CONFLICT DO UPDATE lets
 * us refresh thumbnail/excerpt/payload without duplicating rows.
 *
 * Skipped silently on empty input so the orchestrator can pass through
 * a platform's empty result without a guard.
 */
export async function upsertFeedItems(items: FeedItem[]): Promise<number> {
  if (items.length === 0) return 0;
  let written = 0;
  for (const item of items) {
    await sql`
      INSERT INTO social_feed_items
        (platform, author_handle, published_at, thumbnail_url, link, excerpt, payload_json)
      VALUES (
        ${item.platform},
        ${item.authorHandle},
        ${item.publishedAt.toISOString()},
        ${item.thumbnailUrl},
        ${item.link},
        ${item.excerpt},
        ${JSON.stringify(item.payloadJson ?? null)}::jsonb
      )
      ON CONFLICT (link) DO UPDATE SET
        thumbnail_url = EXCLUDED.thumbnail_url,
        excerpt       = EXCLUDED.excerpt,
        payload_json  = EXCLUDED.payload_json
    `;
    written++;
  }
  return written;
}
