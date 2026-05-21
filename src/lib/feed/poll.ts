import { sanityFetch } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { upsertFeedItems } from './upsert';
import { poll as pollYouTube } from './youtube';
import { poll as pollInstagram } from './instagram';
import { poll as pollFacebook } from './facebook';
import { poll as pollLinkedIn } from './linkedin';
import type { FeedItem, Platform, PlatformSource } from './types';

/**
 * Orchestrator for /api/cron/feed-poll. Reads source accounts from
 * Sanity (site settings + feedIncluded contributors), dispatches to
 * each platform module, upserts results.
 *
 * Resilient to per-platform failure: a thrown error from one poller
 * is caught and surfaced in the result counts but does not stop the
 * other platforms from running. The cron route logs the per-platform
 * outcome so Vercel's function logs make failure modes visible.
 */

interface OfficialAccounts {
  youtubeChannelId?: string | null;
  instagramHandle?: string | null;
  facebookPageUrl?: string | null;
  linkedinPageUrl?: string | null;
}

interface ContributorSocials {
  name: string;
  socials?: {
    youtube?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
  };
}

const sourcesQuery = `{
  "official": *[_type == "siteSettings"][0].officialAccounts,
  "contributors": *[_type == "contributor" && feedIncluded == true]{ name, socials }
}`;

interface SourcesResult {
  official: OfficialAccounts | null;
  contributors: ContributorSocials[];
}

function collectSources(data: SourcesResult): Record<Platform, PlatformSource[]> {
  const grouped: Record<Platform, PlatformSource[]> = {
    youtube: [],
    instagram: [],
    facebook: [],
    linkedin: [],
  };

  const official = data.official ?? {};
  if (official.youtubeChannelId) {
    grouped.youtube.push({
      platform: 'youtube',
      identifier: official.youtubeChannelId,
      authorHandle: 'Sharp Sighted',
    });
  }
  if (official.instagramHandle) {
    grouped.instagram.push({
      platform: 'instagram',
      identifier: official.instagramHandle,
      authorHandle: 'Sharp Sighted',
    });
  }
  if (official.facebookPageUrl) {
    grouped.facebook.push({
      platform: 'facebook',
      identifier: official.facebookPageUrl,
      authorHandle: 'Sharp Sighted',
    });
  }
  if (official.linkedinPageUrl) {
    grouped.linkedin.push({
      platform: 'linkedin',
      identifier: official.linkedinPageUrl,
      authorHandle: 'Sharp Sighted',
    });
  }

  for (const contributor of data.contributors) {
    const handle = contributor.name;
    const socials = contributor.socials ?? {};
    if (socials.youtube) {
      grouped.youtube.push({ platform: 'youtube', identifier: socials.youtube, authorHandle: handle });
    }
    if (socials.instagram) {
      grouped.instagram.push({ platform: 'instagram', identifier: socials.instagram, authorHandle: handle });
    }
    if (socials.facebook) {
      grouped.facebook.push({ platform: 'facebook', identifier: socials.facebook, authorHandle: handle });
    }
    if (socials.linkedin) {
      grouped.linkedin.push({ platform: 'linkedin', identifier: socials.linkedin, authorHandle: handle });
    }
  }

  return grouped;
}

export interface PollResult {
  platform: Platform;
  fetched: number;
  written: number;
  error?: string;
}

export async function pollAll(): Promise<PollResult[]> {
  const data: SourcesResult = isSanityConfigured
    ? await sanityFetch<SourcesResult>(sourcesQuery)
    : { official: null, contributors: [] };

  const grouped = collectSources(data);

  const pollers: Array<[Platform, typeof pollYouTube]> = [
    ['youtube', pollYouTube],
    ['instagram', pollInstagram],
    ['facebook', pollFacebook],
    ['linkedin', pollLinkedIn],
  ];

  const results: PollResult[] = [];
  for (const [platform, run] of pollers) {
    try {
      const items: FeedItem[] = await run(grouped[platform]);
      const written = await upsertFeedItems(items);
      results.push({ platform, fetched: items.length, written });
    } catch (err) {
      results.push({
        platform,
        fetched: 0,
        written: 0,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
  return results;
}
