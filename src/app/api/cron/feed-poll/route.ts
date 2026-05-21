import { NextResponse, type NextRequest } from 'next/server';
import { pollAll } from '@/lib/feed/poll';

/**
 * Vercel Cron Job entry point for refreshing /feed. Scheduled in
 * vercel.json to run every 30 minutes.
 *
 * Auth: Vercel Cron POSTs include `Authorization: Bearer <CRON_SECRET>`
 * automatically when the project has `CRON_SECRET` set. We reject
 * anything without that header so a leaked URL can't be abused to spam
 * the social APIs and burn quotas. If CRON_SECRET isn't set in env
 * (local dev without the secret), the route still 401s — set the
 * secret or skip the route locally.
 *
 * The orchestrator is resilient: per-platform failures don't stop other
 * platforms. We always return 200 with a per-platform result array so
 * Vercel doesn't retry on a partial failure; the response body is the
 * source of truth for what worked.
 */

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: 'CRON_SECRET not configured' },
      { status: 401 },
    );
  }
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const results = await pollAll();
  return NextResponse.json({ ok: true, results });
}

/* Vercel Cron defaults to GET on the configured path. Accept both so
   `vercel.json` can use either verb without surprise. */
export const GET = POST;
