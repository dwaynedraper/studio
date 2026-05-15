import { sql } from './db';

export type UserRole = 'member' | 'contributor' | 'admin' | 'super-admin';

export interface UserRow {
  id: string;
  discord_id: string;
  username: string;
  avatar_url: string | null;
  email: string | null;
  role: UserRole;
  created_at: Date;
  last_seen_at: Date;
}

/**
 * Insert-or-update a user row keyed by their Discord ID. Returns the
 * full row after the upsert. Touches last_seen_at every call so we get
 * a free liveness signal without a separate ping endpoint.
 *
 * Role precedence on conflict:
 *   - If the caller passes a `role` (typically only on initial sign-in
 *     when SUPER_ADMIN_DISCORD_ID matches), it wins.
 *   - Otherwise, the existing row's role is preserved.
 *
 * This keeps the super-admin bootstrap from clobbering admin
 * elevations made later via Sanity Studio.
 */
export async function upsertUserFromDiscord(args: {
  discordId: string;
  username: string;
  avatarUrl: string | null;
  email: string | null;
  role?: UserRole;
}): Promise<UserRow> {
  const { discordId, username, avatarUrl, email, role } = args;

  if (role) {
    const rows = await sql<UserRow>`
      INSERT INTO users (discord_id, username, avatar_url, email, role)
      VALUES (${discordId}, ${username}, ${avatarUrl}, ${email}, ${role})
      ON CONFLICT (discord_id) DO UPDATE
      SET username     = EXCLUDED.username,
          avatar_url   = EXCLUDED.avatar_url,
          email        = EXCLUDED.email,
          role         = ${role},
          last_seen_at = now()
      RETURNING *;
    `;
    return rows[0];
  }

  const rows = await sql<UserRow>`
    INSERT INTO users (discord_id, username, avatar_url, email)
    VALUES (${discordId}, ${username}, ${avatarUrl}, ${email})
    ON CONFLICT (discord_id) DO UPDATE
    SET username     = EXCLUDED.username,
        avatar_url   = EXCLUDED.avatar_url,
        email        = EXCLUDED.email,
        last_seen_at = now()
    RETURNING *;
  `;
  return rows[0];
}

export async function getUserByDiscordId(discordId: string): Promise<UserRow | null> {
  const rows = await sql<UserRow>`
    SELECT * FROM users WHERE discord_id = ${discordId} LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<UserRow | null> {
  const rows = await sql<UserRow>`
    SELECT * FROM users WHERE id = ${id} LIMIT 1;
  `;
  return rows[0] ?? null;
}

/* ─── Role precedence helpers ─────────────────────────────────────── */

const ROLE_LEVEL: Record<UserRole, number> = {
  member: 0,
  contributor: 1,
  admin: 2,
  'super-admin': 3,
};

export function roleAtLeast(actual: UserRole | undefined, required: UserRole): boolean {
  if (!actual) return false;
  return ROLE_LEVEL[actual] >= ROLE_LEVEL[required];
}
