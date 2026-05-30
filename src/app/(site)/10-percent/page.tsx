import type { Metadata } from 'next';
import Image from 'next/image';
import { sanityClient } from '@/sanity/client';
import { isSanityConfigured } from '@/sanity/env';
import { tenPercentListQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { CONTACT, DISCORD_INVITE_URL, TAGLINE } from '@/lib/branding';

/* Fresh server render; revalidation comes via the Sanity webhook on
   publish. Same pattern as /series and /journal. */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'The 10% Rule',
  description:
    'Ten percent of the work, given. Sharp Sighted Studio’s standing commitment to causes that align with the brand — same craft as is charged elsewhere, given freely to the right missions.',
};

type ArchiveEntry = {
  _id: string;
  title: string;
  slug: string;
  coverImage?: { asset?: { _ref: string } };
  partnerOrganization?: string;
  dateCompleted?: string;
  category?: string;
};

async function getEntries(): Promise<ArchiveEntry[]> {
  if (!isSanityConfigured) return [];
  try {
    return (await sanityClient.fetch(tenPercentListQuery)) as unknown as ArchiveEntry[];
  } catch {
    return [];
  }
}

const CATEGORY_LABEL: Record<string, string> = {
  community: 'Community',
  education: 'Education',
  'mental-health': 'Mental health',
  accessibility: 'Accessibility',
  neurodiversity: 'Neurodiversity',
  'animal-welfare': 'Animal welfare',
  other: 'Other',
};

/* Curated, non-polarizing subset of the cause list from the brand bible
   §7.1. Surfaces the heart of the commitment without rendering all
   fourteen entries (which would read as a checklist instead of a
   stance). Keeps to the non-controversial range per §7.2. */
const CAUSE_AREAS: { label: string; blurb: string }[] = [
  {
    label: 'Legacy work for people in crisis',
    blurb:
      'Make-A-Wish-style portraits and short films — especially for children — made to outlast the moment.',
  },
  {
    label: 'Autism and neurodivergence',
    blurb:
      'Broadly framed. Sessions, portraits, and storytelling for organizations and individuals across the spectrum.',
  },
  {
    label: 'Mental health and recovery',
    blurb:
      'PTSD support, addiction recovery, and the day-to-day work of staying alive and well.',
  },
  {
    label: 'Cancer battles',
    blurb:
      'Any age, any type. Especially pediatric. Family portraits, treatment-journey stories, heirloom prints.',
  },
  {
    label: 'Foster youth and second-chance work',
    blurb:
      'Youth aging out of care, reentry programs, restorative-justice work. Storytelling in service of the mission.',
  },
  {
    label: 'Disability rights, broadly',
    blurb:
      'Physical, vision, hearing, access advocacy. Brand and event work for the organizations doing the work.',
  },
  {
    label: 'Photography education',
    blurb:
      'Meetups, mentoring, the portable-printer-for-strangers loop. Passing the craft along.',
  },
  {
    label: 'Habitat for Humanity and affordable housing',
    blurb:
      'Real estate media for the organizations that build homes for the people who need them.',
  },
];

export default async function TenPercentPage() {
  const entries = await getEntries();
  const hasEntries = entries.length > 0;

  return (
    <article>
      {/* ── Hero ───────────────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">The 10% Rule</p>
          <h1
            className="font-serif font-light leading-[1.05]"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 4.75rem)',
              color: 'var(--text)',
            }}
          >
            Ten percent of the work, <em style={{ color: 'var(--accent)' }}>given.</em>
          </h1>
          <p
            className="mt-8 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            A standing commitment to give ten percent of time, resources, or effort to
            causes that align with the work. The same craft as is charged elsewhere, given
            freely to the right missions.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Lives under <strong style={{ color: 'var(--accent)' }}>Human</strong>, the
            pillar of warmth and community. Documented here so the work can be seen,
            shared, and built on.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── What it is ─────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">How it works</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Not <em style={{ color: 'var(--accent)' }}>charity.</em> A way of working.
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The 10% Rule isn’t a one-off donation. It’s a structural part of how Sharp
            Sighted operates — a deliberate share of capacity reserved for work that earns
            no invoice. Most often that looks like the same portrait, real-estate media, or
            short-film work the studio sells, given to a person or organization who couldn’t
            commission it.
          </p>
          <p
            className="mt-5 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            The bar is the same as paid work. The craft doesn’t change. The intention does.
          </p>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── Where it shows up ───────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Where it shows up</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            The causes the work <em style={{ color: 'var(--accent)' }}>moves toward.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Not every cause is the right fit. The ones below are. Pitches outside this
            range are politely declined or referred elsewhere — the rule works best when
            it’s focused.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAUSE_AREAS.map((c) => (
              <div
                key={c.label}
                className="surface-card"
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border)',
                }}
              >
                <p
                  className="text-xs tracking-[0.22em] uppercase mb-3"
                  style={{ color: 'var(--accent)' }}
                >
                  {c.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-mid)' }}>
                  {c.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── The archive ─────────────────────────────────────────────────────────── */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container-narrow">
          <p className="eyebrow">The archive</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            The work, <em style={{ color: 'var(--accent)' }}>logged.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            Every 10% engagement gets documented here — the partner, the work, the story.
            Not as a portfolio. As a record.
          </p>

          <div className="mt-12">
            {hasEntries ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entries.map((e) => (
                  <ArchiveTile key={e._id} entry={e} />
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
                  The archive is still warming up.
                </p>
                <p
                  className="mt-4 text-sm max-w-lg mx-auto leading-relaxed"
                  style={{ color: 'var(--text-mid)' }}
                >
                  Entries are being moved into Studio. Each completed 10% engagement gets
                  its own page once the partner sign-off lands.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="shine-line" />

      {/* ── CTA ────────────────────────────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-narrow">
          <p className="eyebrow">Want this for your cause?</p>
          <h2
            className="font-serif font-light leading-[1.1]"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: 'var(--text)' }}
          >
            Reach <em style={{ color: 'var(--accent)' }}>out.</em>
          </h2>
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed"
            style={{ color: 'var(--text-mid)' }}
          >
            If you’re running an organization — or you know one — whose work lives in
            the range above, send a note. Capacity is finite; the right fit gets the time.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <a
              href={`mailto:${CONTACT.email}?subject=10%25%20Rule%20%E2%80%94%20%5Byour%20organization%5D&body=Organization%3A%0AWhat%20you%20do%3A%0AThe%20work%20you%27re%20hoping%20for%3A%0ATimeline%3A%0AContact%3A%0A`}
              className="btn-primary"
            >
              Email a pitch &rarr;
            </a>
            <a
              href={DISCORD_INVITE_URL}
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Or start in the Discord &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ── Closing tagline ───────────────────────────────────────────────────────────────── */}
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

/* ── Archive tile ───────────────────────────────────────────────────────────────
   No detail page exists yet — the tile is non-linking, so a click
   doesn’t 404 into an unbuilt route. When the [slug] page lands, wrap
   the outer div in a <Link href={`/10-percent/${slug}`}> and add hover
   states. ─────────────────────────────────────────────────────── */
function ArchiveTile({ entry }: { entry: ArchiveEntry }) {
  const built = urlFor(entry.coverImage);
  const cover = built ? built.width(720).height(450).fit('crop').auto('format').url() : null;
  const year = entry.dateCompleted ? new Date(entry.dateCompleted).getFullYear() : null;
  const categoryLabel = entry.category ? CATEGORY_LABEL[entry.category] ?? entry.category : null;

  return (
    <div
      className="surface-card"
      style={{ background: 'var(--surface)', padding: 0, overflow: 'hidden' }}
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
      </div>

      <div className="p-6 md:p-7">
        <p className="text-xs tracking-[0.22em] uppercase flex items-center gap-2 mb-3">
          <span style={{ color: 'var(--accent)' }}>10%</span>
          {categoryLabel && (
            <>
              <span style={{ color: 'var(--text-muted)' }}>&middot;</span>
              <span style={{ color: 'var(--text-mid)' }}>{categoryLabel}</span>
            </>
          )}
        </p>
        <h3
          className="font-serif font-light leading-tight"
          style={{ fontSize: '1.4rem', color: 'var(--text)' }}
        >
          {entry.title}
        </h3>
        {entry.partnerOrganization && (
          <p className="mt-3 text-sm" style={{ color: 'var(--text-mid)' }}>
            With {entry.partnerOrganization}
          </p>
        )}
        {year && (
          <p
            className="mt-4 text-xs tracking-[0.12em] uppercase"
            style={{ color: 'var(--text-muted)' }}
          >
            {year}
          </p>
        )}
      </div>
    </div>
  );
}
