import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from './env';

const builder = imageUrlBuilder({ projectId, dataset });

/**
 * Returns an image URL builder for a Sanity image reference. Usage:
 *
 *   <img src={urlFor(post.coverImage).width(1200).url()} />
 *
 * Returns null if no source is provided so callers can guard cleanly.
 */
export function urlFor(source: SanityImageSource | undefined | null) {
  if (!source) return null;
  return builder.image(source);
}
