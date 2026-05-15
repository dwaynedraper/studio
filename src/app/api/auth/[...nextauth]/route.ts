import { handlers } from '@/auth';

/**
 * Auth.js v5 route handler. Exposes:
 *   /api/auth/signin          → Discord OAuth flow
 *   /api/auth/signout
 *   /api/auth/callback/discord
 *   /api/auth/session
 *   /api/auth/csrf
 *   /api/auth/providers
 */
export const { GET, POST } = handlers;
