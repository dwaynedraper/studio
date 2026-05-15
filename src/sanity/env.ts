/**
 * Sanity env vars — centralized so the Studio mount, the read client, and
 * any server actions all import the same values. Falls back gracefully
 * during build / preview when env vars are missing, but throws at runtime
 * if a server-side query is attempted without configuration.
 */

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? process.env.SANITY_PROJECT_ID ?? '';

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? process.env.SANITY_DATASET ?? 'production';

export const apiVersion = process.env.SANITY_API_VERSION ?? '2024-10-01';

/** Server-only token; never expose to the browser. Used for previews + writes. */
export const apiToken = process.env.SANITY_API_TOKEN;

/** Webhook secret for /api/sanity-webhook validation. */
export const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

/**
 * Throws a clear error if a Sanity-dependent code path runs without the
 * required configuration. Call at the top of any server query / write.
 */
export function assertSanityConfigured(): void {
  if (!projectId) {
    throw new Error(
      'Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID (and NEXT_PUBLIC_SANITY_DATASET) in .env.local.'
    );
  }
}

export const isSanityConfigured = Boolean(projectId);
