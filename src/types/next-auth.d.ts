import type { UserRole } from '@/lib/users';
import 'next-auth';
import 'next-auth/jwt';

/**
 * Module augmentation for Auth.js v5. Extends Session.user with the
 * Sharp Sighted-specific fields (internal id, discordId, role) so
 * server components and helpers don't need to cast.
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      discordId: string;
      role: UserRole;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    discordId?: string;
    role?: UserRole;
  }
}
