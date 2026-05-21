import type { FeedItem, Poller, PlatformSource } from './types';

/**
 * Facebook poller stub.
 *
 * TODO(step-9-followup): wire the Facebook Graph API for Pages.
 *   1. Meta for Developers → use the same app set up for Instagram.
 *   2. Add the "Pages" product and request `pages_read_engagement` +
 *      `pages_read_user_content` permissions for the Page you manage.
 *   3. Convert a User Access Token → Page Access Token (long-lived) via
 *      Graph API Explorer or the /me/accounts endpoint.
 *   4. Set `FACEBOOK_ACCESS_TOKEN` in .env.local + Vercel env.
 *   5. The Sanity Site settings doc holds `facebookPageUrl`; extract the
 *      page slug or use Graph API to resolve to a Page ID. For each
 *      source: GET
 *      https://graph.facebook.com/v19.0/<page-id>/posts
 *        ?fields=id,message,full_picture,permalink_url,created_time
 *        &access_token=FACEBOOK_ACCESS_TOKEN&limit=10
 *      Map permalink_url → link, message → excerpt, full_picture →
 *      thumbnailUrl, created_time → publishedAt.
 *   6. Webhooks (Page subscriptions) can come later for freshness.
 *
 * Until then, returns [] silently.
 */
export const poll: Poller = async (sources: PlatformSource[]): Promise<FeedItem[]> => {
  if (!process.env.FACEBOOK_ACCESS_TOKEN) return [];
  if (sources.length === 0) return [];
  return [];
};
