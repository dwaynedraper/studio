-- ────────────────────────────────────────────────────────────────────
-- Sharp Sighted Studio — Postgres schema
--
-- Three tables cover Studio's persistent state. Apply this file once
-- against the Postgres instance pointed at by DATABASE_URL:
--
--   psql "$DATABASE_URL" -f src/lib/db/schema.sql
--
-- Idempotent: every CREATE uses IF NOT EXISTS. Indexes too.
--
-- Schema decisions
--   users               — Auth.js v5 uses JWT sessions, so it doesn't
--                          require its own account/session tables. This
--                          users table is ours alone: we manage role
--                          elevation and last-seen tracking. The signIn
--                          callback in src/auth.ts upserts rows here.
--   reactions           — used by /api/react (build step 7). Anonymous
--                          reactions store cookie_id; authenticated ones
--                          store user_id. The composite uniqueness keeps
--                          a single emoji per (post, identity).
--   social_feed_items   — populated by the polling cron (build step 9)
--                          and read by /feed. The `link` column is the
--                          natural key for upserts.
-- ────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── users ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id   TEXT NOT NULL UNIQUE,
  username     TEXT NOT NULL,
  avatar_url   TEXT,
  email        TEXT,
  role         TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'contributor', 'admin', 'super-admin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- ─── reactions ─────────────────────────────────────────────────────
-- Either user_id (auth'd) or cookie_id (anon) is set, never both.
CREATE TABLE IF NOT EXISTS reactions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug  TEXT NOT NULL,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  cookie_id  TEXT,
  emoji      TEXT NOT NULL
              CHECK (emoji IN ('useful', 'resonant', 'beautiful', 'real', 'shareworthy')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK ((user_id IS NULL) <> (cookie_id IS NULL))
);

-- One reaction per emoji per (post, identity)
CREATE UNIQUE INDEX IF NOT EXISTS reactions_unique_user
  ON reactions(post_slug, emoji, user_id) WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS reactions_unique_cookie
  ON reactions(post_slug, emoji, cookie_id) WHERE cookie_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS reactions_post_idx ON reactions(post_slug);

-- ─── social_feed_items ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_feed_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      TEXT NOT NULL
                  CHECK (platform IN ('youtube', 'instagram', 'tiktok', 'linkedin')),
  author_handle TEXT NOT NULL,
  published_at  TIMESTAMPTZ NOT NULL,
  thumbnail_url TEXT,
  link          TEXT NOT NULL UNIQUE,
  excerpt       TEXT,
  payload_json  JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS social_feed_items_published_idx
  ON social_feed_items(published_at DESC);
CREATE INDEX IF NOT EXISTS social_feed_items_platform_idx
  ON social_feed_items(platform);
