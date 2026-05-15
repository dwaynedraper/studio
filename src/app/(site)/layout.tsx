import { Suspense } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import HubReturnToast from '@/components/HubReturnToast';

/**
 * (site) — the public-site route group layout.
 *
 * Adds the Nav, Footer, HubReturnToast, and skip-link chrome around
 * every visitor-facing page. /studio (Sanity Studio) and /api/* live
 * outside this group so they render without the chrome.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main-content" className="flex-1 pt-14">
        {children}
      </main>
      <Footer activeSite="studio" />
      <Suspense fallback={null}>
        <HubReturnToast />
      </Suspense>
    </>
  );
}
