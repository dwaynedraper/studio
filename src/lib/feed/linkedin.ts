import type { FeedItem, Poller, PlatformSource } from './types';

/**
 * LinkedIn poller stub.
 *
 * TODO(step-9-followup): wire the LinkedIn Marketing Developer Platform.
 *   1. LinkedIn Developers → create app, associate it with a Company
 *      Page. Request access to "Marketing Developer Platform" — this
 *      gate is the slowest step; expect 1–2 weeks for approval.
 *   2. OAuth 2.0 → 3-legged flow with scopes `r_organization_social`,
 *      `rw_organization_admin`.
 *   3. Set `LINKEDIN_ACCESS_TOKEN` in .env.local + Vercel env (token
 *      refreshes every 60 days; document the refresh pattern when wiring).
 *   4. For each source (company URN like `urn:li:organization:12345`):
 *      GET https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(<urn>)
 *        with Authorization: Bearer LINKEDIN_ACCESS_TOKEN
 *      Parse the returned UGC posts; map commentary → excerpt, the
 *      first image asset → thumbnailUrl, the post URN → link via
 *      `https://www.linkedin.com/feed/update/<urn>/`.
 *   5. Personal-profile posting is harder (separate scope, not freely
 *      granted) — skip until LinkedIn opens the API or scope this to
 *      Company Pages only.
 *
 * Until then, returns [] silently.
 */
export const poll: Poller = async (sources: PlatformSource[]): Promise<FeedItem[]> => {
  if (!process.env.LINKEDIN_ACCESS_TOKEN) return [];
  if (sources.length === 0) return [];
  return [];
};
