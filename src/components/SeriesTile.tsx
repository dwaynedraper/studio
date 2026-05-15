import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';
import { BADGE_LABEL, type SeriesBadge } from '@/lib/series-seeds';
import type { Pillar } from '@/lib/branding';

/**
 * Series tile — used on /series (3×2 grid on desktop, 2×3 tablet, 1×6
 * mobile) and the homepage Block 4. Shape is identical in both places
 * per spec §5 Block 4.
 *
 * Cover image is optional. When absent, the tile shows a soft
 * terracotta gradient surface so the layout doesn't collapse — fits
 * the dialect's "warm hand-made" vibe.
 */

type Cover = { asset?: { _ref: string } } | null | undefined;

export function SeriesTile({
  slug,
  title,
  tagline,
  badge,
  pillar,
  coverImage,
}: {
  slug: string;
  title: string;
  tagline?: string | null;
  badge?: SeriesBadge | null;
  pillar?: Pillar | null;
  coverImage?: Cover;
}) {
  const built = urlFor(coverImage);
  const cover = built ? built.width(800).height(500).fit('crop').auto('format').url() : null;

  return (
    <Link
      href={`/series/${slug}`}
      className="surface-card block group transition-colors duration-200 hover:border-(--border-accent)"
      style={{
        background: 'var(--surface)',
        padding: 0,
        overflow: 'hidden',
      }}
    >
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
        {badge && (
          <span
            className="absolute top-3 left-3 text-[0.65rem] tracking-[0.2em] uppercase px-2 py-1"
            style={{
              background: 'rgba(17, 17, 16, 0.78)',
              color: 'var(--accent-light)',
              borderRadius: 'var(--radius-sm)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {BADGE_LABEL[badge]}
          </span>
        )}
      </div>

      <div className="p-6 md:p-7">
        <p
          className="text-xs tracking-[0.22em] uppercase mb-3"
          style={{ color: 'var(--accent)' }}
        >
          {pillar ?? 'series'}
        </p>
        <h3
          className="font-serif font-light leading-tight"
          style={{ fontSize: '1.45rem', color: 'var(--text)' }}
        >
          {title}
        </h3>
        {tagline && (
          <p
            className="mt-3 text-sm leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            {tagline}
          </p>
        )}
      </div>
    </Link>
  );
}
