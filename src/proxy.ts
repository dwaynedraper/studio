/**
 * Next.js 16 proxy (renamed from middleware in v16). Re-exports the
 * Auth.js auth() function so every request that matches the config
 * below runs through the `authorized` callback in src/auth.ts.
 *
 * The matcher is intentionally narrow: only /studio and its API
 * helpers need the admin gate. Auth.js' own endpoints under
 * /api/auth are excluded so the OAuth callback can complete without
 * being intercepted.
 *
 * Static asset paths are excluded by the standard Next.js matcher
 * idiom.
 */

export { auth as proxy } from '@/auth';

export const config = {
  matcher: [
    /* Apply auth gate to /studio (Sanity CMS) only. Sign-in, OAuth
       callback, session, and other /api/auth/* routes must NOT be
       matched here — Auth.js needs to handle them itself. */
    '/studio/:path*',
  ],
};
