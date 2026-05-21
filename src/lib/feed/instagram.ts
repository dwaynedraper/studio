import type { FeedItem, Poller, PlatformSource } from './types';

/**
 * Instagram poller stub.
 *
 * TODO(step-9-followup): wire the Instagram Basic Display API.
 *   1. Meta for Developers → create app → add "Instagram Basic Display."
 *   2. Add an Instagram Test User and authorize the app against the
 *      account you want to poll.
 *   3. Exchange short-lived token → long-lived token (60-day, refreshable
 *      every <60 days via /refresh_access_token).
 *   4. Set `INSTAGRAM_ACCESS_TOKEN` in .env.local + Vercel env.
 *   5. For the authorized user: GET
 *      https://graph.instagram.com/me/media
 *        ?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp
 *        &access_token=INSTAGRAM_ACCESS_TOKEN&limit=10
 *      Map permalink → link, caption → excerpt, media_url (or
 *      thumbnail_url for videos) → thumbnailUrl, timestamp → publishedAt.
 *   6. For contributor accounts, each contributor needs their own
 *      token — Basic Display is per-user. Plan: store tokens on the
 *      contributor Sanity doc (encrypted) or skip contributor IG polling
 *      until Meta's Business API is in scope.
 *
 * Until then, returns [] silently.
 */
export const poll: Poller = async (sources: PlatformSource[]): Promise<FeedItem[]> => {
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) return [];
  if (sources.length === 0) return [];
  return [];
};
