import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';
import type { Pillar } from '@/lib/branding';

/**
 * JournalCard — the canonical shape for journal post previews. Used on
 * /journal index, /journal/[slug] related-posts row, /series/[slug]
 * episode list (a leaner variant), and the homepage Latest block.
 *
 * Cover image is optional; absence falls back to a soft terracotta
 * gradient. Series eyebrow surfaces a pillar accent dot when present,
 * to thread the pillar colour through the listing without overpowering.
 */

type JournalCardProps = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: { asset?: { _ref: string } } | null;
  publishedAt?: string | null;
  author?: {
    name?: string;
    role?: string | null;
    handle?: string;
  } | null;
  series?: {
    title?: string;
    slug?: string;
    pillar?: Pillar;
  } | null;
  variant?: 'card' | 'compact';
};

export function JournalCard({
  slug,
  title,
  excerpt,
  coverImage,
  publishedAt,
  author,
  series,
  variant = 'card',
}: JournalCardProps) {
  const built = urlFor(coverImage);
  const cover = built ? built.width(720).height(450).fit('crop').auto('format').url() : null;

  const dateLabel = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <Link
      href={`/journal/${slug}`}
      className="surface-card block group transition-colors duration-200 hover:border-(--border-accent)"
      style={{
        background: 'var(--surface)',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {variant === 'card' && (
        <div
          className="relative w-full"
          style={{
            aspectRatio: '8 / 5',
            background: cover
              ? undefined
              : 'linear-gradient(135deg, var(--surface-warm-2), var(--surface-2))',
          }}
        >
          {cover && (
            <Image
              src={cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
      )}

      <div className="p-6 md:p-7">
        <p className="text-xs tracking-[0.22em] uppercase flex items-center gap-2 mb-3">
          <span style={{ color: 'var(--accent)' }}>Journal</span>
          {series?.title && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ color: 'var(--text-mid)' }}>{series.title}</span>
            </>
          )}
        </p>

        <h3
          className="font-serif font-light leading-tight transition-colors duration-200 group-hover:text-(--accent)"
          style={{
            fontSize: variant === 'compact' ? '1.25rem' : '1.5rem',
            color: 'var(--text)',
          }}
        >
          {title}
        </h3>

        {excerpt && variant === 'card' && (
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            {excerpt}
          </p>
        )}

        <p
          className="mt-4 text-xs tracking-[0.12em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          {author?.name && <>{author.name}</>}
          {author?.name && dateLabel && <> · </>}
          {dateLabel}
        </p>
      </div>
    </Link>
  );
}
