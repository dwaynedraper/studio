import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { roleAtLeast, type UserRole } from '@/lib/users';

/**
 * Server-side helpers for reading and gating on the current session.
 * Import from server components, server actions, and route handlers.
 *
 *   const user = await getCurrentUser();
 *   if (!user) return null;
 *
 *   const user = await requireUser();  // redirects to sign-in if no session
 *
 *   await requireRole('admin');        // redirects to sign-in if not admin
 *
 *   if (await hasRole('contributor')) { ... }
 */

export async function getSession() {
  return auth();
}

export async function getCurrentUser() {
  const s = await auth();
  return s?.user ?? null;
}

export async function requireUser() {
  const s = await auth();
  if (!s?.user) redirect('/api/auth/signin');
  return s.user;
}

export async function requireRole(role: UserRole) {
  const s = await auth();
  if (!roleAtLeast(s?.user?.role, role)) redirect('/api/auth/signin');
  return s!.user;
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const s = await auth();
  return roleAtLeast(s?.user?.role, role);
}
