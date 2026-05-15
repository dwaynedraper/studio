import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <div className="container-narrow section">
      <p className="eyebrow">404 · Off the map</p>
      <h1
        className="font-serif font-light leading-[1.05]"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
          color: 'var(--text)',
        }}
      >
        That page <em style={{ color: 'var(--accent)' }}>isn&rsquo;t here.</em>
      </h1>
      <p
        className="mt-6 max-w-xl text-base leading-relaxed"
        style={{ color: 'var(--text-mid)' }}
      >
        Either the link is old, or you wandered into a corner of Sharp Sighted
        we haven&rsquo;t built yet. Pick a door below.
      </p>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <PropertyCard
          label="Studio"
          tagline="Community, journal, the 10%"
          href="/"
          isActive
        />
        <PropertyCard
          label="Hub"
          tagline="sharpsightedstudio.com"
          href="https://sharpsightedstudio.com"
          external
        />
        <PropertyCard
          label="Photos"
          tagline="sharpsighted.photos · Portraits & headshots"
          href="https://sharpsighted.photos"
          external
        />
        <PropertyCard
          label="Media"
          tagline="sharpsighted.media · Real estate"
          href="https://sharpsighted.media"
          external
        />
      </div>

      <p
        className="mt-16 text-xs tracking-[0.14em] uppercase text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        Stay Sharp. Stay Seen. Stay Human.
      </p>
    </div>
  );
}

function PropertyCard({
  label,
  tagline,
  href,
  external,
  isActive,
}: {
  label: string;
  tagline: string;
  href: string;
  external?: boolean;
  isActive?: boolean;
}) {
  const className = 'surface-card block transition-colors duration-200 hover:border-(--border-accent)';
  const content = (
    <>
      <div className="flex items-center justify-between">
        <span
          className="font-serif text-2xl"
          style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          style={{ color: 'var(--text-muted)' }}
        >
          {external ? '↗' : '→'}
        </span>
      </div>
      <p className="mt-2 text-sm" style={{ color: 'var(--text-mid)' }}>
        {tagline}
      </p>
    </>
  );

  if (external) {
    return (
      <a href={href} className={className} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
