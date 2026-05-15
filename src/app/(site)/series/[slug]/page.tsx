import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityClient } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { seriesBySlugQuery, seriesSlugsQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@/components/PortableText';
import {
  SERIES_SEEDS,
  BADGE_LABEL,
  type SeriesBadge,
} from '@/lib/series-seeds';
import type { Pillar } from '@/lib/branding';
import { TAGLINE } from '@/lib/branding';

export const dynamic = 'force-dynamic';

/* Pre-build the routes for the seeded six so the page renders without
   a runtime Sanity fetch on cold hits. If Sanity adds more series,
   they're served via on-demand rendering and revalidated by the
   webhook. */
export async function generateStaticParams() {
  if (isSanityConfigured) {
    try {
      const slugs = (await sanityClient.fetch(seriesSlugsQuery)) as unknown as string[];
      if (Array.isArray(slugs) && slugs.length > 0) {
        return slugs.map((slug) => ({ slug }));
      }
    } catch {
      /* fall through to seeds */
    }
  }
  return SERIES_SEEDS.map((s) => ({ slug: s.slug }));
}

type SeriesContributor = {
  _id: string;
  name: string;
  handle: string;
  role?: string;
  avatar?: { asset?: { _ref: string } };
  externalWork?: string;
};

type SeriesPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  author?: { name?: string };
};

type SeriesDetail = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  badge?: SeriesBadge;
  pillar?: Pillar;
  description?: PortableTextBlock[];
  coverImage?: { asset?: { _ref: string } };
  externalHomeUrl?: string;
  primaryAuthor?: SeriesContributor;
  posts?: SeriesPost[];
};

async function getSeries(slug: string): Promise<SeriesDetail | null> {
  if (!isSanityConfigured) return null;
  try {
    return (await sanityClient.fetch(seriesBySlugQuery, {
      slug,
    })) as unknown as SeriesDetail | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fromSanity = await getSeries(slug);
  const fromSeed = SERIES_SEEDS.find((s) => s.slug === slug);
  const title = fromSanity?.title ?? fromSeed?.title;
  if (!title) return { title: 'Series not found' };
  const description = fromSanity?.tagline || fromSeed?.tagline || `${title} — a Sharp Sighted series.`;
  return { title, description };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const series = await getSeries(slug);
  const seed = SERIES_SEEDS.find((s) => s.slug === slug);

  /* If neither Sanity nor the seed list knows this slug, 404. */
  if (!series && !seed) notFound();

  /* Compose a display object that prefers Sanity data, falls back to seed. */
  const display = {
    title: series?.title ?? seed!.title,
    tagline: series?.tagline ?? seed?.tagline ?? '',
    badge: series?.badge ?? seed?.badge,
    pillar: series?.pillar ?? seed?.pillar,
    description: series?.description,
    coverImage: series?.coverImage,
    externalHomeUrl: series?.externalHomeUrl,
    primaryAuthor: series?.primaryAuthor,
    posts: series?.posts ?? [],
  };

  const built = urlFor(display.coverImage);
  const cover = built ? built.width(2400).height(1200).fit('crop').auto('format').url() : null;

  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">
            <Link
              href="/series"
              style={{ color: 'var(--accent)' }}
              className="hover:opacity-80"
            >
              The Series
            </Link>
            {display.pillar && (
              <span style={{ color: 'var(--text-muted)' }}> · {display.pillar}</span>
            )}
            {display.badge && (
              <span style={{ color: 'var(--text-muted)' }}>
                {' '}· {BADGE_LABEL[display.badge]}
              </span>
            )}
          </p>

          <h1
            className="font-serif italic font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5.25rem)',
              color: 'var(--text)',
            }}
          >
            {display.title}
          </h1>
          {display.tagline && (
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--text-mid)' }}
            >
              {display.tagline}
            </p>
          )}

          {cover && (
            <div
              className="relative mt-10 w-full"
              style={{
                aspectRatio: '2 / 1',
                overflow: 'hidden',
                borderRadius: 'var(--radius)',
              }}
            >
              <Image
                src={cover}
                alt=""
                fill
                sizes="(min-width: 1024px) 1100px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* ── About this series ─────────────────────────────────────── */}
      {display.description && display.description.length > 0 && (
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container-narrow">
            <p className="eyebrow">About this series</p>
            <div className="max-w-2xl">
              <PortableText value={display.description} />
            </div>
          </div>
        </section>
      )}

      {/* ── Featured contributor ──────────────────────────────────── */}
      {display.primaryAuthor && (
        <section className="section">
          <div className="container-narrow">
            <p className="eyebrow">Featured contributor</p>
            <ContributorCard contributor={display.primaryAuthor} />
          </div>
        </section>
      )}

      {/* ── Episodes / posts ──────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-warm)' }}>
        <div className="container-narrow">
          <p className="eyebrow">Episodes</p>
          {display.posts.length > 0 ? (
            <ul className="mt-8 space-y-6 max-w-3xl">
              {display.posts.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/journal/${p.slug}`}
                    className="block group transition-colors duration-200"
                  >
                    <h3
                      className="font-serif font-light text-2xl leading-tight transition-colors duration-200 group-hover:text-(--accent)"
                      style={{ color: 'var(--text)' }}
                    >
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ color: 'var(--text-mid)' }}
                      >
                        {p.excerpt}
                      </p>
                    )}
                    <p
                      className="mt-2 text-xs tracking-[0.12em] uppercase"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {p.author?.name && <>{p.author.name} · </>}
                      {p.publishedAt && new Date(p.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="mt-6 text-sm italic max-w-xl"
              style={{ color: 'var(--text-mid)' }}
            >
              Episodes show up here as journal posts in this series are published.
            </p>
          )}
        </div>
      </section>

      {/* ── Subscribe CTA ─────────────────────────────────────────── */}
      {display.externalHomeUrl && (
        <section className="section">
          <div className="container-narrow">
            <p className="eyebrow">Subscribe</p>
            <p
              className="mt-4 max-w-2xl text-base leading-relaxed"
              style={{ color: 'var(--text-mid)' }}
            >
              {display.title} also lives at its own home — subscribe there for the full feed.
            </p>
            <div className="mt-6">
              <a
                href={display.externalHomeUrl}
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit the series →
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ── Closing ───────────────────────────────────────────────── */}
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

function ContributorCard({ contributor }: { contributor: SeriesContributor }) {
  const avatar = urlFor(contributor.avatar)?.width(160).height(160).fit('crop').url();
  return (
    <div
      className="mt-6 surface-card flex items-center gap-5 max-w-xl"
      style={{ background: 'var(--surface-warm)' }}
    >
      {avatar ? (
        <Image
          src={avatar}
          alt={contributor.name}
          width={64}
          height={64}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <div
          aria-hidden="true"
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--surface-2)',
          }}
        />
      )}
      <div>
        <p
          className="font-serif text-xl leading-tight"
          style={{ color: 'var(--text)' }}
        >
          {contributor.name}
        </p>
        {contributor.role && (
          <p className="text-xs tracking-[0.12em] uppercase mt-1" style={{ color: 'var(--text-muted)' }}>
            {contributor.role}
          </p>
        )}
        {contributor.externalWork && (
          <a
            href={contributor.externalWork}
            rel="noopener noreferrer"
            className="text-xs mt-2 inline-block hover:opacity-80"
            style={{ color: 'var(--accent)' }}
          >
            Visit their work →
          </a>
        )}
      </div>
    </div>
  );
}
