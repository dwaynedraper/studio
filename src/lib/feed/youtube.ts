import type { FeedItem, Poller, PlatformSource } from './types';

/**
 * YouTube poller stub.
 *
 * TODO(step-9-followup): wire YouTube Data API v3.
 *   1. Create a project at https://console.cloud.google.com and enable
 *      "YouTube Data API v3".
 *   2. APIs & Services → Credentials → Create credentials → API key.
 *   3. Set `YOUTUBE_API_KEY` in .env.local + Vercel env.
 *   4. For each source: GET
 *      https://www.googleapis.com/youtube/v3/search
 *        ?part=snippet&channelId=<id>&maxResults=10&order=date
 *        &type=video&key=YOUTUBE_API_KEY
 *      Map snippet.title → excerpt, snippet.thumbnails.high.url →
 *      thumbnailUrl, `https://www.youtube.com/watch?v=<id>` → link.
 *   5. Webhook fallback (PubSubHubbub) can come later — polling every
 *      30 min is fine for v1.
 *
 * Until then, returns [] silently. The orchestrator treats that as
 * "nothing new this tick."
 */
export const poll: Poller = async (sources: PlatformSource[]): Promise<FeedItem[]> => {
  if (!process.env.YOUTUBE_API_KEY) return [];
  if (sources.length === 0) return [];
  /* Real impl lands in step-9-followup. */
  return [];
};
