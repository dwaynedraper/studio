/**
 * Cross-network /feed types. Mirrors the social_feed_items table shape
 * defined in src/lib/db/schema.sql so DB rows round-trip without a
 * mapping layer.
 *
 * `Platform` is closed-set — adding one means updating the schema's
 * CHECK constraint, this union, the Poller registry in poll.ts, and the
 * platform icon switch in the /feed page. Intentionally a four-step
 * change so no platform sneaks in half-wired.
 */

export type Platform = 'youtube' | 'instagram' | 'facebook' | 'linkedin';

export interface FeedItem {
  platform: Platform;
  authorHandle: string;
  publishedAt: Date;
  thumbnailUrl: string | null;
  link: string;
  excerpt: string | null;
  payloadJson: unknown;
}

/**
 * A single source the orchestrator hands to a platform poller. May be
 * either an official Sharp Sighted account (from siteSettings) or a
 * vetted contributor with feedIncluded=true (from contributor docs).
 *
 * `identifier` is whatever string the platform's API needs:
 *   youtube   → channel ID (UC...)
 *   instagram → user ID or handle (depends on API path)
 *   facebook  → Page ID or username
 *   linkedin  → org URN or page URL
 */
export interface PlatformSource {
  platform: Platform;
  identifier: string;
  authorHandle: string;
}

/**
 * Every platform module exports a function matching this signature so
 * the orchestrator can dispatch uniformly. Return [] when the platform's
 * env token is missing — callers should treat that as "no items," not
 * an error. Throw only for genuine API/network failures.
 */
export type Poller = (sources: PlatformSource[]) => Promise<FeedItem[]>;
