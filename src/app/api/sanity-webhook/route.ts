import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { webhookSecret } from '@/sanity/env';

/**
 * Sanity webhook receiver. Configure in Sanity's dashboard pointing at
 * https://sharpsighted.studio/api/sanity-webhook with the same secret as
 * SANITY_WEBHOOK_SECRET. Sanity signs each request with the secret in
 * the `sanity-webhook-signature` header.
 *
 * On publish/unpublish/edit, revalidates the affected URLs so visitors
 * see fresh content within seconds of an admin clicking Publish.
 *
 * Body shape (configured in the webhook UI as the projection):
 *   { _type, slug, authorHandle?, seriesSlug? }
 */

type WebhookPayload = {
  _type?: 'journalPost' | 'series' | 'tenPercentEntry' | 'contributor' | 'siteSettings';
  slug?: string;
  authorHandle?: string;
  seriesSlug?: string;
};

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, error: 'SANITY_WEBHOOK_SECRET not configured' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('sanity-webhook-signature');
  if (!signature) {
    return NextResponse.json({ ok: false, error: 'missing signature' }, { status: 401 });
  }

  const body = (await req.json()) as WebhookPayload;
  const type = body._type;

  /* Path-based revalidation. Next.js 16 reworked revalidateTag to take a
     (tag, profile) tuple tied to the new cacheLife profiles; until we
     adopt cache profiles, sticking with revalidatePath keeps the surface
     simple and predictable. */

  switch (type) {
    case 'journalPost':
      revalidatePath('/');
      revalidatePath('/journal');
      if (body.slug) revalidatePath(`/journal/${body.slug}`);
      if (body.authorHandle) revalidatePath(`/journal?author=${body.authorHandle}`);
      if (body.seriesSlug) revalidatePath(`/series/${body.seriesSlug}`);
      break;
    case 'series':
      revalidatePath('/');
      revalidatePath('/series');
      if (body.slug) revalidatePath(`/series/${body.slug}`);
      break;
    case 'tenPercentEntry':
      revalidatePath('/');
      revalidatePath('/10-percent');
      break;
    case 'contributor':
      revalidatePath('/');
      revalidatePath('/journal');
      break;
    case 'siteSettings':
      revalidatePath('/', 'layout');
      break;
    default:
      /* No-op for unknown types; we still respond ok so Sanity doesn't retry. */
      break;
  }

  return NextResponse.json({ ok: true, revalidated: type ?? 'unknown' });
}

export function GET() {
  return NextResponse.json({
    ok: true,
    note: 'POST a Sanity webhook here. GET is just a health check.',
  });
}
