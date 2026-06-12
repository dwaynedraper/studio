import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { PortableTextBlock } from '@portabletext/react';
import { sanityFetch } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { journalPostBySlugQuery, journalSlugsQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { PortableText } from '@/components/PortableText';
import { JournalCard } from '@/components/JournalCard';
import { ReactionsBlock } from '@/components/ReactionsBlock';
import { DiscordCTA } from '@/components/DiscordCTA';
import { getReactionState } from '@/lib/reactions-server';
import { resolveReactionIdentity } from '@/lib/reaction-identity';
import { TAGLINE } from '@/lib/branding';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];
  try {
    const slugs = (await sanityFetch(journalSlugsQuery)) as unknown as string[];
    return Array.isArray(slugs) ? slugs.map((slug) => ({ slug })) : [];
  } catch {
    return [];
  }
}

type Author = {
  _id: string;
  name: string;
  handle: string;
  role?: string;
  bio?: string;
  avatar?: { asset?: { _ref: string } };
  externalWork?: string;
};

type Series = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  pillar?: 'sharp' | 'seen' | 'human';
  badge?: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref: string }; alt?: string };
  publishedAt?: string;
  tags?: string[];
  body?: PortableTextBlock[];
  discordChannelUrl?: string;
  author?: Author;
  series?: Series;
  related?: Array<{
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: { asset?: { _ref: string } };
    publishedAt?: string;
    author?: { name?: string; role?: string | null; handle?: string };
    series?: { title?: string; slug?: string; pillar?: 'sharp' | 'seen' | 'human' };
  }>;
};

async function getPost(slug: string): Promise<Post | null> {
  if (!isSanityConfigured) return null;
  try {
    return (await sanityFetch(journalPostBySlugQuery, {
      slug,
    })) as unknown as Post | null;
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
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };
  const coverUrl = post.coverImage
    ? urlFor(post.coverImage)?.width(1200).height(630).fit('crop').url()
    : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: coverUrl ? [coverUrl] : undefined,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  /* Resolve the visitor's reaction identity. Signed-in user wins; an
     anon visitor's signed cookie (HMAC verified) comes next; otherwise
     none. The /api/react POST issues the cookie on first reaction. */
  const identity = await resolveReactionIdentity();
  const { counts, mine } = await getReactionState(post.slug, identity);

  const built = urlFor(post.coverImage);
  const cover = built ? built.width(2400).height(1200).fit('crop').auto('format').url() : null;
  const avatar = urlFor(post.author?.avatar);
  const avatarUrl = avatar ? avatar.width(160).height(160).fit('crop').url() : null;

  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">
            <Link
              href="/journal"
              style={{ color: 'var(--accent)' }}
              className="hover:opacity-80"
            >
              Journal
            </Link>
            {post.series && (
              <>
                <span style={{ color: 'var(--text-muted)' }}> · </span>
                <Link
                  href={`/series/${post.series.slug}`}
                  style={{ color: 'var(--text-mid)' }}
                  className="hover:text-(--accent) transition-colors duration-200"
                >
                  {post.series.title}
                </Link>
              </>
            )}
            {dateLabel && (
              <>
                <span style={{ color: 'var(--text-muted)' }}> · </span>
                <span style={{ color: 'var(--text-muted)' }}>{dateLabel}</span>
              </>
            )}
          </p>

          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              color: 'var(--text)',
            }}
          >
            {post.title}
          </h1>

          {post.excerpt && (
            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed"
              style={{ color: 'var(--text-mid)' }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Byline row */}
          {post.author && (
            <div className="mt-10 flex items-center gap-4">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={post.author.name}
                  width={56}
                  height={56}
                  style={{ borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: 'var(--surface-2)',
                  }}
                />
              )}
              <div>
                <ByauthorLink author={post.author} />
                {post.author.role && (
                  <p
                    className="text-xs tracking-[0.12em] uppercase mt-1"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {post.author.role}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Cover ──────────────────────────────────────────────────── */}
      {cover && (
        <section className="pb-8">
          <div className="container-narrow">
            <div
              className="relative w-full"
              style={{
                aspectRatio: '2 / 1',
                overflow: 'hidden',
                borderRadius: 'var(--radius)',
              }}
            >
              <Image
                src={cover}
                alt={post.coverImage?.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 1100px, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Body ───────────────────────────────────────────────────── */}
      <section className="pb-12">
        <div className="container-narrow">
          <div className="max-w-2xl">
            <PortableText value={post.body ?? []} />
          </div>
        </div>
      </section>

      {/* ── Tags ───────────────────────────────────────────────────── */}
      {post.tags && post.tags.length > 0 && (
        <section className="pb-8">
          <div className="container-narrow">
            <div className="max-w-2xl flex flex-wrap items-center gap-2">
              <span
                className="text-xs tracking-[0.22em] uppercase mr-1"
                style={{ color: 'var(--text-muted)' }}
              >
                Tagged
              </span>
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/journal?tag=${encodeURIComponent(t)}`}
                  className="text-xs px-3 py-1.5 transition-opacity duration-200 hover:opacity-80"
                  style={{
                    background: 'var(--surface-warm)',
                    color: 'var(--accent)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Reactions ──────────────────────────────────────────────── */}
      <section className="pb-12 pt-4">
        <div className="container-narrow">
          <div className="max-w-2xl">
            <ReactionsBlock
              postSlug={post.slug}
              initialCounts={counts}
              initialMine={mine}
            />
          </div>
        </div>
      </section>

      {/* ── Discuss in Discord ─────────────────────────────────────── */}
      <section className="pb-16">
        <div className="container-narrow">
          <div className="max-w-2xl">
            <DiscordCTA channelUrl={post.discordChannelUrl} />
          </div>
        </div>
      </section>

      {/* ── Related posts ──────────────────────────────────────────── */}
      {post.related && post.related.length > 0 && (
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container-narrow">
            <p className="eyebrow">Related</p>
            <h2
              className="font-serif font-light leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', color: 'var(--text)' }}
            >
              More from the <em style={{ color: 'var(--accent)' }}>journal.</em>
            </h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {post.related.map((r) => (
                <JournalCard
                  key={r._id}
                  slug={r.slug}
                  title={r.title}
                  excerpt={r.excerpt}
                  coverImage={r.coverImage}
                  publishedAt={r.publishedAt}
                  author={r.author}
                  series={r.series}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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

function ByauthorLink({ author }: { author: Author }) {
  /* V1 byline: link to the author's external work URL if set; otherwise
     surface the name as plain text. V2 will route to /contributors/[handle]. */
  if (author.externalWork) {
    return (
      <a
        href={author.externalWork}
        rel="noopener noreferrer"
        className="font-serif italic transition-colors duration-200 hover:text-(--accent)"
        style={{ fontSize: '1.1rem', color: 'var(--text)' }}
      >
        {author.name}
      </a>
    );
  }
  return (
    <span
      className="font-serif italic"
      style={{ fontSize: '1.1rem', color: 'var(--text)' }}
    >
      {author.name}
    </span>
  );
}
