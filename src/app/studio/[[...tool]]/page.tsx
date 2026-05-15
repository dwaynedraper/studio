'use client';

/**
 * Sanity Studio mount at /studio.
 *
 * Marked 'use client' because Sanity Studio is a full client-rendered
 * React app — it calls React.createContext at module evaluation time,
 * which trips the server runtime if SSR is attempted. Metadata/viewport
 * are re-exported from a sibling layout.tsx instead (server components
 * can't sit alongside a client-component page that owns the route).
 *
 * Admin-only gating happens in `proxy.ts` once Auth.js is wired in build
 * step 3. Today the route is reachable by anyone, but Sanity itself
 * requires login against the project before any data can be read or
 * written — the Next.js gate is an extra layer, not the primary defense.
 */

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
