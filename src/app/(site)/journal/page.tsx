import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityFetch } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { journalIndexFilteredQuery } from '@/sanity/queries';
import { JournalCard } from '@/components/JournalCard';
import { TAGLINE } from '@/lib/branding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/journal' },
  title: 'The Journal',
  description:
    'Multi-author writing from the Sharp Sighted collective — craft, behind-the-scenes, education, and the human side of running a creative practice.',
};

const PAGE_SIZE = 10;

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref: string } };
  publishedAt?: string;
  tags?: string[];
  author?: { _id: string; name: string; handle: string; role?: string };
  series?: { _id: string; title: string; slug: string; pillar?: 'sharp' | 'seen' | 'human' };
};

async function getPosts(opts: {
  page: number;
  author?: string;
  series?: string;
  tag?: string;
}): Promise<{ posts: PostCard[]; hasMore: boolean }> {
  if (!isSanityConfigured) return { posts: [], hasMore: false };

  /* Fetch one extra past the page boundary so we can tell whether a
     "next" page exists without a separate count query. Filter params
     are only set when present — the GROQ uses `!defined($author)`
     etc. to treat absent values as a no-op clause. */
  const start = (opts.page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE + 1;

  const params: Record<string, string | number> = { start, end };
  if (opts.author) params.author = opts.author;
  if (opts.series) params.series = opts.series;
  if (opts.tag) params.tag = opts.tag;

  try {
    const rows = (await sanityFetch(
      journalIndexFilteredQuery,
      params
    )) as unknown as PostCard[];
    return { posts: rows.slice(0, PAGE_SIZE), hasMore: rows.length > PAGE_SIZE };
  } catch {
    return { posts: [], hasMore: false };
  }
}

function paramString(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export default async function JournalIndexPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const author = paramString(sp.author);
  const series = paramString(sp.series);
  const tag = paramString(sp.tag);
  const pageRaw = paramString(sp.page);
  const page = Math.max(1, parseInt(pageRaw ?? '1', 10) || 1);

  const { posts, hasMore } = await getPosts({ page, author, series, tag });

  const filterChips: { label: string; href: string }[] = [];
  if (author) filterChips.push({ label: `Author: ${author}`, href: '/journal' });
  if (series) filterChips.push({ label: `Series: ${series}`, href: '/journal' });
  if (tag) filterChips.push({ label: `Tag: ${tag}`, href: '/journal' });

  const hasActiveFilter = filterChips.length > 0;

  /* Build query strings that preserve other filters when paginating. */
  const baseParams = new URLSearchParams();
  if (author) baseParams.set('author', author);
  if (series) baseParams.set('series', series);
  if (tag) baseParams.set('tag', tag);

  const prevHref = (() => {
    const p = new URLSearchParams(baseParams);
    if (page > 2) p.set('page', String(page - 1));
    return p.size > 0 ? `/journal?${p.toString()}` : '/journal';
  })();
  const nextHref = (() => {
    const p = new URLSearchParams(baseParams);
    p.set('page', String(page + 1));
    return `/journal?${p.toString()}`;
  })();

  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The Journal</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.75rem)', color: 'var(--text)' }}
          >
            Writing from <em style={{ color: 'var(--accent)' }}>the collective.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Craft, behind-the-scenes, education, the human side of running a creative practice.
            Multi-author. Edited, not algorithmic.
          </p>

          {hasActiveFilter && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className="text-xs tracking-[0.22em] uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Filtered by
              </span>
              {filterChips.map((c) => (
                <Link
                  key={c.label}
                  href={c.href}
                  className="text-xs px-3 py-1.5 transition-opacity duration-200 hover:opacity-80"
                  style={{
                    background: 'var(--accent-dim)',
                    color: 'var(--accent)',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {c.label} <span aria-hidden="true">×</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Posts grid ─────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p) => (
                <JournalCard
                  key={p._id}
                  slug={p.slug}
                  title={p.title}
                  excerpt={p.excerpt}
                  coverImage={p.coverImage}
                  publishedAt={p.publishedAt}
                  author={p.author}
                  series={p.series}
                />
              ))}
            </div>
          ) : (
            <EmptyState hasFilter={hasActiveFilter} />
          )}

          {/* Pagination */}
          {(page > 1 || hasMore) && (
            <nav
              className="mt-16 flex items-center justify-between"
              aria-label="Pagination"
            >
              {page > 1 ? (
                <Link href={prevHref} className="btn-outline">
                  ← Newer posts
                </Link>
              ) : (
                <span />
              )}
              {hasMore && (
                <Link href={nextHref} className="btn-outline">
                  Older posts →
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container-narrow text-center">
          <p
            className="text-xs tracking-[0.22em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {TAGLINE}
          </p>
        </div>
      </section>
    </article>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div
      className="surface-card text-center"
      style={{ background: 'var(--surface-warm)' }}
    >
      <p
        className="font-serif italic leading-snug"
        style={{ fontSize: '1.35rem', color: 'var(--text)' }}
      >
        {hasFilter ? 'No posts match that filter.' : 'The journal is still warming up.'}
      </p>
      <p
        className="mt-4 text-sm max-w-lg mx-auto leading-relaxed"
        style={{ color: 'var(--text-mid)' }}
      >
        {hasFilter
          ? 'Try clearing the filter or browsing the full archive.'
          : 'Once contributors start publishing, their pieces show up here. Pitches welcome — see the Join page.'}
      </p>
      {hasFilter && (
        <div className="mt-6">
          <Link href="/journal" className="btn-outline">
            See all posts →
          </Link>
        </div>
      )}
    </div>
  );
}
