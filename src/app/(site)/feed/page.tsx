import type { Metadata } from 'next';
import { sql } from '@/lib/db';
import { DISCORD_INVITE_URL } from '@/lib/branding';
import type { Platform } from '@/lib/feed/types';

/**
 * /feed — the cross-network social timeline. Server-rendered from the
 * `social_feed_items` table populated by /api/cron/feed-poll. Renders
 * cleanly when the table is empty (pre-launch state).
 *
 * Caching: cached at the edge for 5 minutes — the cron refreshes every
 * 30 minutes, so a fresh page load 1 second after a cron tick is fine,
 * and a stale one 5 minutes after the previous tick is also fine.
 */

export const metadata: Metadata = {
  alternates: { canonical: '/feed' },
  title: 'Feed',
  description:
    'Cross-network social timeline from Sharp Sighted and the vetted contributors who run with us.',
};

export const revalidate = 300; /* 5 minutes */

const PAGE_SIZE = 60;

interface FeedRow {
  platform: Platform;
  author_handle: string;
  published_at: Date;
  thumbnail_url: string | null;
  link: string;
  excerpt: string | null;
}

async function getFeed(): Promise<FeedRow[]> {
  try {
    return await sql<FeedRow>`
      SELECT platform, author_handle, published_at, thumbnail_url, link, excerpt
      FROM social_feed_items
      ORDER BY published_at DESC
      LIMIT ${PAGE_SIZE}
    `;
  } catch {
    /* If DATABASE_URL isn't set (e.g. preview build without env), fall
       through to the empty state instead of 500-ing. */
    return [];
  }
}

export default async function FeedPage() {
  const items = await getFeed();

  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The Feed</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.75rem)', color: 'var(--text)' }}
          >
            The work, <em style={{ color: 'var(--accent)' }}>everywhere it lives.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Posts from Sharp Sighted and the vetted contributors who run with us, pulled in from
            YouTube, Instagram, Facebook, and LinkedIn. Updated every 30 minutes.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Feed grid ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <FeedCard key={item.link} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </article>
  );
}

function FeedCard({ item }: { item: FeedRow }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        transition: 'transform 200ms ease, border-color 200ms ease',
      }}
    >
      {item.thumbnail_url && (
        <div
          className="aspect-video w-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${item.thumbnail_url})`,
            backgroundColor: 'var(--surface-2)',
          }}
        />
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={item.platform} />
            <span
              className="text-xs tracking-[0.16em] uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              {item.author_handle}
            </span>
          </div>
          <time
            dateTime={new Date(item.published_at).toISOString()}
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {formatTimeAgo(new Date(item.published_at))}
          </time>
        </div>
        {item.excerpt && (
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: 'var(--text-mid)' }}
          >
            {item.excerpt}
          </p>
        )}
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div
      className="mx-auto max-w-xl text-center py-16"
      style={{ color: 'var(--text-mid)' }}
    >
      <p className="font-serif text-2xl mb-4" style={{ color: 'var(--text)' }}>
        Nothing in the feed yet.
      </p>
      <p className="text-base leading-relaxed">
        The cross-network timeline lights up the moment Sharp Sighted starts posting on the
        wired platforms. Until then, the action is in the Discord.
      </p>
      <a href={DISCORD_INVITE_URL} rel="noopener noreferrer" className="btn-primary mt-8">
        Join the Discord →
      </a>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  const diffDays = diffHours / 24;
  if (diffDays < 2) return 'Yesterday';
  if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function PlatformIcon({ platform }: { platform: Platform }) {
  /* Simple monochrome glyphs — full brand icons would tie us to four
     trademarks and bloat the bundle. Color comes from --text-muted so
     they read as quiet markers, not loud badges. */
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': true,
    style: { color: 'var(--text-muted)' },
  };
  switch (platform) {
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23 12c0-2.6-.3-4.6-.6-5.5-.3-1-1-1.7-2-2C18.7 4 12 4 12 4s-6.7 0-8.4.5c-1 .3-1.7 1-2 2C1.3 7.4 1 9.4 1 12s.3 4.6.6 5.5c.3 1 1 1.7 2 2C5.3 20 12 20 12 20s6.7 0 8.4-.5c1-.3 1.7-1 2-2 .3-.9.6-2.9.6-5.5zM10 16V8l6 4-6 4z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4 1 .5.4.8.8 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.8.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.8-1-1.4-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.3-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.8-.8 1.4-1 .4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 2.2c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.3-2.1.4-.5.2-.9.4-1.2.8-.4.3-.6.7-.8 1.2-.1.4-.3 1-.4 2.1-.1 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1.1.3 1.7.4 2.1.2.5.4.9.8 1.2.3.4.7.6 1.2.8.4.1 1 .3 2.1.4 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.3 2.1-.4.5-.2.9-.4 1.2-.8.4-.3.6-.7.8-1.2.1-.4.3-1 .4-2.1.1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1.1-.3-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.3-.4-.7-.6-1.2-.8-.4-.1-1-.3-2.1-.4-1.2-.1-1.5-.1-4.7-.1zM12 7.4a4.6 4.6 0 110 9.2 4.6 4.6 0 010-9.2zm0 7.6a3 3 0 100-6 3 3 0 000 6zm5.9-7.8a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M22 12a10 10 0 10-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.5 2h-17C2.7 2 2 2.7 2 3.5v17c0 .8.7 1.5 1.5 1.5h17c.8 0 1.5-.7 1.5-1.5v-17c0-.8-.7-1.5-1.5-1.5zM8 19H5V9h3v10zM6.5 7.7a1.7 1.7 0 110-3.5 1.7 1.7 0 010 3.5zM19 19h-3v-5c0-1.2 0-2.7-1.7-2.7-1.6 0-1.9 1.3-1.9 2.6V19h-3V9h2.8v1.4h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.6 2 3.6 4.5V19z" />
        </svg>
      );
  }
}
