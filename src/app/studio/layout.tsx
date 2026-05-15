/**
 * Studio route layout — exists solely to host the metadata + viewport
 * re-exports from next-sanity/studio. The page.tsx in this directory is
 * a client component so it can't export these directly.
 *
 * This layout sits outside the (site) route group, so it inherits only
 * the root layout's <html>/<body> — no Nav, Footer, or HubReturnToast.
 * Sanity Studio renders full-bleed.
 */

export { metadata, viewport } from 'next-sanity/studio';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
