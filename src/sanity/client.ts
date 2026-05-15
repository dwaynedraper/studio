import { createClient, type QueryParams, type SanityClient } from 'next-sanity';
import { apiVersion, apiToken, dataset, projectId } from './env';

/**
 * Sanity clients are constructed lazily so `next build` can collect
 * page data on pages whose import chain includes this module even
 * when NEXT_PUBLIC_SANITY_PROJECT_ID isn't set. Calling createClient
 * eagerly throws `Configuration must contain projectId` and fails the
 * build.
 *
 * Two clients:
 *   sanityRead  — public, CDN-fronted, "published" perspective. Used by
 *                  server components rendering /journal, /series,
 *                  /10-percent, /feed, and the homepage.
 *   sanityWrite — server-only, token-authed, "previewDrafts"
 *                  perspective. Used by webhook handlers and any
 *                  future preview routes.
 *
 * Both call sites get a typed `fetch()` shortcut so individual pages
 * can call `sanityFetch(query, params)` instead of `sanityRead().fetch(...)`.
 */

let _read: SanityClient | undefined;
let _write: SanityClient | undefined;

function sanityRead(): SanityClient {
  if (_read) return _read;
  _read = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: 'published',
  });
  return _read;
}

function sanityWrite(): SanityClient {
  if (_write) return _write;
  _write = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: apiToken,
    perspective: 'drafts',
  });
  return _write;
}

/**
 * Public-read fetch shortcut. Throws cleanly if Sanity isn't configured
 * — callers should guard with `isSanityConfigured` and supply a
 * fallback render. Pages that fall through to seeds catch the rejection.
 */
export function sanityFetch<T = unknown>(query: string, params?: QueryParams): Promise<T> {
  return sanityRead().fetch<T>(query, params ?? {});
}

export function sanityWriteFetch<T = unknown>(query: string, params?: QueryParams): Promise<T> {
  return sanityWrite().fetch<T>(query, params ?? {});
}

/* Backwards-compat re-exports for code that wants a raw client. New
   code should prefer sanityFetch() so the lazy semantics are obvious. */
export const sanityClient: { fetch: typeof sanityFetch } = {
  fetch: sanityFetch,
};

export const sanityWriteClient: { fetch: typeof sanityWriteFetch } = {
  fetch: sanityWriteFetch,
};
