import type { Metadata } from 'next';
import { sanityClient } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { seriesListQuery } from '@/sanity/queries';
import { SeriesTile } from '@/components/SeriesTile';
import { SERIES_SEEDS, type SeriesBadge } from '@/lib/series-seeds';
import type { Pillar } from '@/lib/branding';
import { TAGLINE } from '@/lib/branding';

/* Always render fresh server-side; revalidation comes from the Sanity
   webhook on publish. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  alternates: { canonical: '/series' },
  title: 'The Series',
  description:
    'Six ongoing shows from Sharp Sighted Studio. Bartographer, Special Moments, Corridor, Home Architecture, Alpha Architect, and Ripped or Stamped.',
};

type SeriesRow = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  badge?: SeriesBadge;
  pillar?: Pillar;
  coverImage?: { asset?: { _ref: string } };
  externalHomeUrl?: string;
};

async function getSeries(): Promise<SeriesRow[]> {
  if (!isSanityConfigured) return [];
  try {
    return (await sanityClient.fetch(seriesListQuery)) as unknown as SeriesRow[];
  } catch {
    return [];
  }
}

export default async function SeriesIndexPage() {
  const series = await getSeries();

  /* Empty / pre-Sanity state: render the six skeleton tiles from
     SERIES_SEEDS so visitors see the shape of the section even before
     Dean imports the seed file and edits in Studio. Tiles still link
     to /series/[slug] which has the same graceful fallback. */
  const tiles =
    series.length > 0
      ? series.map((s) => ({
          slug: s.slug,
          title: s.title,
          tagline: s.tagline,
          badge: s.badge,
          pillar: s.pillar,
          coverImage: s.coverImage,
        }))
      : SERIES_SEEDS.map((s) => ({
          slug: s.slug,
          title: s.title,
          tagline: s.tagline || undefined,
          badge: s.badge,
          pillar: s.pillar,
          coverImage: undefined,
        }));

  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The Series</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
              color: 'var(--text)',
            }}
          >
            Six ongoing <em style={{ color: 'var(--accent)' }}>shows.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The series are the long-form. Each one a thread Dean and the collective keep
            pulling on. Some are open-call magnets. Some are deep-dive authority pieces. One
            is the flagship.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Tile grid ──────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiles.map((t) => (
              <SeriesTile
                key={t.slug}
                slug={t.slug}
                title={t.title}
                tagline={t.tagline}
                badge={t.badge}
                pillar={t.pillar}
                coverImage={t.coverImage}
              />
            ))}
          </div>

          {series.length === 0 && (
            <p
              className="mt-12 text-sm italic"
              style={{ color: 'var(--text-muted)' }}
            >
              Series content is being moved into Studio — taglines and cover images
              appear here as each one is published.
            </p>
          )}
        </div>
      </section>

      {/* ── Closing tagline ───────────────────────────────────────── */}
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
