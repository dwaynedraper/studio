import {
  PortableText as PortableTextRoot,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/image';

/**
 * Editorial Portable Text renderer for Sharp Sighted Studio. Used by
 * series descriptions, journal post bodies, and 10% archive stories.
 *
 * Styling conventions:
 *   - body paragraphs use --text-mid with generous line-height
 *   - h2 / h3 use Playfair Display, light weight; h3 picks up the
 *     terracotta accent on its first italic word convention
 *   - blockquote becomes a left-bordered pull-quote in terracotta
 *   - links in body copy use accent color with underline
 *   - images render as <figure> with optional caption underneath
 */

type SanityImageBlock = {
  _type: 'image';
  alt?: string;
  caption?: string;
  asset?: { _ref: string };
};

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-6 text-base leading-relaxed" style={{ color: 'var(--text-mid)' }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="font-serif font-light leading-tight mt-14 mb-3"
        style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.25rem)', color: 'var(--text)' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="font-serif font-light leading-tight mt-10 mb-3"
        style={{ fontSize: '1.4rem', color: 'var(--text)' }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="mt-8 mb-4 pl-6 font-serif italic leading-snug"
        style={{
          borderLeft: '3px solid var(--accent)',
          color: 'var(--text)',
          fontSize: '1.25rem',
        }}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    em: ({ children }) => (
      <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{children}</em>
    ),
    strong: ({ children }) => (
      <strong style={{ color: 'var(--text)' }}>{children}</strong>
    ),
    link: ({ value, children }) => {
      const href = (value as { href?: string; openInNewTab?: boolean })?.href ?? '#';
      const newTab = (value as { openInNewTab?: boolean })?.openInNewTab;
      return (
        <a
          href={href}
          {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          style={{
            color: 'var(--accent)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const v = value as SanityImageBlock;
      const built = urlFor(v);
      if (!built) return null;
      const src = built.width(1200).fit('max').auto('format').url();
      return (
        <figure className="mt-10 mb-2">
          <Image
            src={src}
            alt={v.alt ?? ''}
            width={1200}
            height={800}
            className="w-full h-auto"
            sizes="(min-width: 1024px) 1100px, 100vw"
            style={{ borderRadius: 'var(--radius)' }}
          />
          {v.caption && (
            <figcaption
              className="mt-3 text-xs italic"
              style={{ color: 'var(--text-muted)' }}
            >
              {v.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] | undefined | null }) {
  if (!value || value.length === 0) return null;
  return <PortableTextRoot value={value} components={components} />;
}
