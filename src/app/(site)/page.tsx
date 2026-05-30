import type { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient, sanityFetch } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { journalLatestQuery, seriesListQuery } from '@/sanity/queries';
import { JournalCard } from '@/components/JournalCard';
import { SeriesTile } from '@/components/SeriesTile';
import { SERIES_SEEDS, type SeriesBadge } from '@/lib/series-seeds';
import {
  PILLARS,
  PROPERTIES,
  DISCORD_INVITE_URL,
  TAGLINE,
  type Pillar,
} from '@/lib/branding';

/* Fresh server render; revalidation comes via the Sanity webhook on
   publish. Same pattern as /journal and /series. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sharp Sighted Studio — The Channel',
  description:
    'A small collective of photographers, videographers, and the people who care about the craft. The work, the people behind it, the things we give back, and the conversation that happens around all of it.',
};

/* ── Data shapes ──────────────────────────────────────────────────── */

type LatestPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref: string } };
  publishedAt?: string;
  tags?: string[];
  author?: { _id: string; name: string; handle: string; role?: string };
  series?: { _id: string; title: string; slug: string; pillar?: Pillar };
};

type SeriesRow = {
  _id: string;
  title: string;
  slug: string;
  tagline?: string;
  badge?: SeriesBadge;
  pillar?: Pillar;
  coverImage?: { asset?: { _ref: string } };
};

async function getLatestPosts(): Promise<LatestPost[]> {
  if (!isSanityConfigured) return [];
  try {
    const rows = (await sanityFetch(journalLatestQuery)) as unknown as LatestPost[];
    /* journalLatestQuery returns up to 4; the homepage block shows 3. */
    return rows.slice(0, 3);
  } catch {
    return [];
  }
}

async function getSeries(): Promise<SeriesRow[]> {
  if (!isSanityConfigured) return [];
  try {
    return (await sanityClient.fetch(seriesListQuery)) as unknown as SeriesRow[];
  } catch {
    return [];
  }
}

/* ── Page ─────────────────────────────────────────────────────────── */

export default async function Home() {
  const [latestPosts, sanitySeries] = await Promise.all([
    getLatestPosts(),
    getSeries(),
  ]);

  /* Series tiles: prefer Sanity, fall back to the six seeds so the
     section never collapses. Matches /series. */
  const seriesTiles =
    sanitySeries.length > 0
      ? sanitySeries.map((s) => ({
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
      {/* ── Block 1 · Hero ───────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Sharp Sighted Studio · The Channel</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 5.25rem)',
              color: 'var(--text)',
            }}
          >
            The channel,
            <br />
            <em style={{ color: 'var(--accent)' }}>not the entity.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A small collective of photographers, videographers, and the people who care
            about the craft. The work, the people behind it, the things we give back, and
            the conversation that happens around all of it.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Not a sales surface. Not a portfolio. A networking site for a small creative
            collective &mdash; and the long-form work that gets made around it.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              className="btn-primary"
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
            >
              Join the Discord &rarr;
            </a>
            <Link className="btn-outline" href="/journal">
              Read the journal &rarr;
            </Link>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 2 · Pillars ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The operating philosophy</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Stay Sharp. <em style={{ color: 'var(--accent)' }}>Stay Seen.</em> Stay Human.
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Three pillars run through every Sharp Sighted property. Studio&rsquo;s centre
            of gravity is <strong style={{ color: 'var(--accent)' }}>Human</strong> &mdash;
            community, warmth, and the 10% Rule. Every branch carries every pillar.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((p) => {
              const isHuman = p.id === 'human';
              return (
                <div
                  key={p.id}
                  className="surface-card"
                  style={{
                    background: isHuman ? 'var(--surface-warm-2)' : 'var(--surface-2)',
                    borderColor: isHuman ? 'var(--border-accent)' : 'var(--border)',
                  }}
                >
                  <p
                    className="text-xs tracking-[0.22em] uppercase mb-3"
                    style={{ color: p.accentVar }}
                  >
                    {p.name}
                  </p>
                  <p
                    className="font-serif italic text-lg leading-snug mb-4"
                    style={{ color: 'var(--text)' }}
                  >
                    {p.tagline}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 3 · Latest from the journal ───────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow">From the journal</p>
              <h2
                className="font-serif font-light leading-[1.1] mt-2"
                style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
              >
                Recent <em style={{ color: 'var(--accent)' }}>writing.</em>
              </h2>
            </div>
            <Link
              href="/journal"
              className="text-xs tracking-[0.12em] uppercase shrink-0 transition-colors duration-200"
              style={{ color: 'var(--text-mid)' }}
            >
              See all posts &rarr;
            </Link>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((p) => (
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
            <div
              className="surface-card text-center"
              style={{ background: 'var(--surface-warm)' }}
            >
              <p
                className="font-serif italic leading-snug"
                style={{ fontSize: '1.35rem', color: 'var(--text)' }}
              >
                The journal is still warming up.
              </p>
              <p
                className="mt-4 text-sm max-w-lg mx-auto leading-relaxed"
                style={{ color: 'var(--text-mid)' }}
              >
                Pieces from the collective surface here once they&rsquo;re published.
                Pitches welcome &mdash; see the Join page.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <Link href="/join" className="btn-outline">
                  Pitch a piece &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 4 · The series ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow">The series</p>
              <h2
                className="font-serif font-light leading-[1.1] mt-2"
                style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
              >
                Six ongoing <em style={{ color: 'var(--accent)' }}>shows.</em>
              </h2>
            </div>
            <Link
              href="/series"
              className="text-xs tracking-[0.12em] uppercase shrink-0 transition-colors duration-200"
              style={{ color: 'var(--text-mid)' }}
            >
              All series &rarr;
            </Link>
          </div>

          <p
            className="max-w-2xl text-base leading-relaxed mb-12"
            style={{ color: 'var(--text-mid)' }}
          >
            The long-form. Threads the collective keeps pulling on &mdash; magnets,
            authority pieces, and one flagship.{' '}
            <Link
              href="/ripped-or-stamped"
              className="underline underline-offset-4 transition-colors duration-200"
              style={{ color: 'var(--accent)' }}
            >
              Ripped or Stamped
            </Link>{' '}
            is currently in build.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesTiles.map((t) => (
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
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 5 · The 10% Rule ────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface-warm)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The 10% Rule</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Ten percent of the work, <em style={{ color: 'var(--accent)' }}>given.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A standing commitment to give ten percent of time, resources, or effort to
            causes that align with the work. Same craft as is charged elsewhere, given
            freely to the right missions. Documented and surfaced here on Studio &mdash;
            not as charity, as a way of working.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/10-percent" className="btn-outline">
              See the archive &rarr;
            </Link>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 6 · The community ───────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The community</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Where the conversation <em style={{ color: 'var(--accent)' }}>happens.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The Sharp Sighted Discord is the day-to-day room for the collective. Channels
            for craft talk, gear questions, location finds, group-shoot scheduling, and
            journal pitches. Quiet some weeks, busy others. Photographers, videographers,
            editors, and people who care about the work &mdash; all welcome.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <a
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Join the Discord &rarr;
            </a>
            <Link href="/join" className="btn-ghost">
              All three doors &rarr;
            </Link>
            <span className="text-xs italic" style={{ color: 'var(--text-muted)' }}>
              Standing invite. No application.
            </span>
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Block 7 · Four properties ──────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">One brand, four doors</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            One brand. <em style={{ color: 'var(--accent)' }}>Three specialists.</em> One
            front door.
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Sharp Sighted operates as a single brand with four web properties. The hub is
            the umbrella; the three specialists each carry their own pillar. You&rsquo;re
            on Studio.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROPERTIES.map((property) => {
              const isHere = property.id === 'studio';
              return (
                <a
                  key={property.id}
                  href={property.href}
                  rel="noopener noreferrer"
                  className="surface-card block group transition-colors duration-200"
                  style={{
                    background: isHere ? 'var(--surface-warm)' : 'var(--surface)',
                    borderColor: isHere ? 'var(--border-accent)' : 'var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs tracking-[0.22em] uppercase"
                      style={{ color: property.pillarHex }}
                    >
                      {property.label} {isHere && '· you are here'}
                    </span>
                    {!isHere && (
                      <span
                        aria-hidden="true"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        &uarr;&rarr;
                      </span>
                    )}
                  </div>
                  <p
                    className="font-serif italic text-lg leading-snug mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {property.identity}
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {property.domain}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                    {property.blurb}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing tagline ───────────────────────────────────────────────────────── */}
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
