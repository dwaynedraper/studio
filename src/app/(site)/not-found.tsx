import Link from 'next/link';
import { PROPERTIES, TAGLINE } from '@/lib/branding';

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

      {/* Interior routes — most 404s land here looking for content */}
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">Studio home →</Link>
        <Link href="/journal" className="btn-outline">Journal →</Link>
        <Link href="/series" className="btn-ghost">Series →</Link>
        <Link href="/10-percent" className="btn-ghost">10% →</Link>
      </div>

      {/* The four Sharp Sighted properties */}
      <p
        className="mt-16 mb-6 text-xs tracking-[0.22em] uppercase"
        style={{ color: 'var(--accent)' }}
      >
        Or try another door
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        {PROPERTIES.map((p) => (
          <PropertyCard
            key={p.id}
            label={p.label}
            domain={p.domain}
            identity={p.identity}
            href={p.href}
            pillarHex={p.pillarHex}
            isActive={p.id === 'studio'}
          />
        ))}
      </div>

      <p
        className="mt-16 text-xs tracking-[0.22em] uppercase text-center"
        style={{ color: 'var(--text-muted)' }}
      >
        {TAGLINE}
      </p>
    </div>
  );
}

function PropertyCard({
  label,
  domain,
  identity,
  href,
  pillarHex,
  isActive,
}: {
  label: string;
  domain: string;
  identity: string;
  href: string;
  pillarHex: string;
  isActive: boolean;
}) {
  const className =
    'surface-card block transition-colors duration-200 hover:border-(--border-accent)';

  const content = (
    <>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs tracking-[0.22em] uppercase"
          style={{ color: pillarHex }}
        >
          {label} {isActive && '· you are here'}
        </span>
        {!isActive && (
          <span aria-hidden="true" style={{ color: 'var(--text-muted)' }}>↗</span>
        )}
      </div>
      <p
        className="font-serif italic text-lg leading-snug"
        style={{ color: 'var(--text)' }}
      >
        {identity}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
        {domain}
      </p>
    </>
  );

  if (isActive) {
    return (
      <Link href="/" className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={className} rel="noopener noreferrer">
      {content}
    </a>
  );
}
