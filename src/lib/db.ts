import { Pool, type QueryResultRow } from 'pg';

/**
 * Single Postgres pool, shared across all server code. Vercel's Node
 * runtime keeps the module instance alive between invocations on the
 * same lambda warm path, so a pool is preferable to one-off clients.
 *
 * For local dev set DATABASE_URL in .env.local; for prod Vercel injects
 * it from the project's Postgres integration (Vercel Postgres or Neon
 * — both speak vanilla pg).
 */

declare global {
  var __ss_pg_pool__: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set. See .env.example.');
  }
  return new Pool({
    connectionString,
    /* Neon, Vercel Postgres, and most managed providers require TLS.
       Local Postgres without TLS will need to override this via the
       URL (e.g. ?sslmode=disable). */
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30_000,
  });
}

/**
 * Lazily construct the pool on first use. Two reasons we don't eagerly
 * init at module evaluation time:
 *   1. `next build` collects page data without DATABASE_URL set,
 *      and eager init would fail the build for every route that even
 *      transitively imports this module (the auth route does).
 *   2. Edge runtimes don't expose pg; if a route is later moved to the
 *      Edge runtime we'd want a clean import-time error there rather
 *      than a silent module init.
 *
 * Caches on globalThis in dev so HMR doesn't leak connections.
 */
export function getPool(): Pool {
  if (global.__ss_pg_pool__) return global.__ss_pg_pool__;
  const p = createPool();
  if (process.env.NODE_ENV !== 'production') {
    global.__ss_pg_pool__ = p;
  }
  return p;
}

/**
 * Thin tagged-template wrapper around `pool.query` for the common case.
 * Returns rows directly. Throws on error so callers can let errors
 * bubble or wrap them in try/catch as appropriate.
 *
 *   const rows = await sql<UserRow>`SELECT * FROM users WHERE id = ${id}`;
 *
 * Parameter substitution uses positional placeholders ($1, $2, ...).
 */
export async function sql<T extends QueryResultRow = QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  let text = strings[0];
  for (let i = 0; i < values.length; i++) {
    text += `$${i + 1}${strings[i + 1] ?? ''}`;
  }
  const result = await getPool().query<T>(text, values as unknown[]);
  return result.rows;
}
