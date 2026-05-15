import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import {
  upsertUserFromDiscord,
  getUserByDiscordId,
  roleAtLeast,
  type UserRole,
} from '@/lib/users';

/**
 * Auth.js v5 configuration. Discord OAuth → JWT session → Postgres
 * users row keyed by discord_id.
 *
 * Strategy: JWT sessions (Auth.js manages the token; no session table
 * needed). Our `users` table is the source of truth for role + identity
 * across the app.
 *
 * Flow:
 *   1. signIn callback   — upsert the Discord identity into users.
 *                          If their discord_id matches SUPER_ADMIN_DISCORD_ID
 *                          (Dean), assign super-admin role on first sign-in.
 *   2. jwt callback      — first invocation has `account` + `profile`;
 *                          we look up the user row and stash {userId,
 *                          discordId, role} on the token. Subsequent
 *                          invocations reuse the cached token. Role
 *                          changes after sign-in require a re-login.
 *   3. session callback  — surface the cached token fields on session.user
 *                          so server components can read them directly.
 *   4. authorized callback — the proxy.ts re-export hits this on every
 *                            matched request. /studio requires admin+.
 *
 * The hardcoded super-admin id is loaded from env on every signIn so
 * Dean can change it without redeploys.
 */

const SUPER_ADMIN_DISCORD_ID = process.env.SUPER_ADMIN_DISCORD_ID;

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify email' } },
    }),
  ],
  pages: {
    /* Auth.js' built-in /api/auth/signin page is fine for v1. When we
       want a branded sign-in screen we'll point this at a custom
       /signin page. */
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'discord' || !profile?.id) return false;

      const discordId = String(profile.id);
      const isSuperAdmin = SUPER_ADMIN_DISCORD_ID && discordId === SUPER_ADMIN_DISCORD_ID;

      type DiscordProfile = { username?: string; global_name?: string | null };
      const dp = profile as DiscordProfile;
      const username = dp.username ?? dp.global_name ?? user.name ?? 'unknown';

      await upsertUserFromDiscord({
        discordId,
        username,
        avatarUrl: user.image ?? null,
        email: user.email ?? null,
        ...(isSuperAdmin ? { role: 'super-admin' as UserRole } : {}),
      });

      return true;
    },

    async jwt({ token, profile, account }) {
      /* First sign-in: account + profile present. Look up the freshly
         upserted user row and stash the canonical fields on the token. */
      if (account?.provider === 'discord' && profile?.id) {
        const u = await getUserByDiscordId(String(profile.id));
        if (u) {
          token.userId = u.id;
          token.discordId = u.discord_id;
          token.role = u.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.userId) session.user.id = token.userId;
      if (token.discordId) session.user.discordId = token.discordId;
      if (token.role) session.user.role = token.role;
      return session;
    },

    async authorized({ auth: a, request }) {
      const path = request.nextUrl.pathname;

      /* /studio (Sanity CMS) — admin or super-admin only. Returning
         false sends the user through the Auth.js sign-in flow. */
      if (path.startsWith('/studio')) {
        return roleAtLeast(a?.user?.role, 'admin');
      }

      /* All other routes are public by default. Per-page server
         components can call auth() directly when they need to gate. */
      return true;
    },
  },
});
