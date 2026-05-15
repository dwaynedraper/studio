import { defineType, defineField } from 'sanity';

/**
 * Contributor — a member of the Sharp Sighted creative collective.
 *
 * Roles ladder (architecture spec §12):
 *   visitor      → unauth'd, not stored
 *   member       → any Discord-auth'd user, stored in Postgres only
 *   contributor  → can draft journal posts; admin must approve
 *   admin        → can publish + elevate other users
 *   super-admin  → Dean only, can elevate to admin
 *
 * `discordId` links this Sanity record to the Postgres `users` row created
 * by Auth.js on first sign-in. `feedIncluded` opts a vetted long-term
 * contributor's socials into the cross-network /feed (architecture §8).
 */
export const contributor = defineType({
  name: 'contributor',
  title: 'Contributor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Display name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'handle',
      title: 'Handle (URL slug)',
      type: 'slug',
      description: 'Used in /contributors/[handle] when V2 ships. Lowercase, no spaces.',
      options: { source: 'name', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Short label shown in bylines and contributor cards. e.g. "Photographer", "Filmmaker", "Editor".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: 'bio',
      title: 'One-line bio',
      type: 'text',
      rows: 2,
      description: 'Shown on the homepage Network block and on journal post bylines. Keep it tight.',
      validation: (rule) => rule.max(220),
    }),
    defineField({
      name: 'longBio',
      title: 'Long bio (V2 profile page)',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Optional. Surfaced when /contributors/[handle] ships in V2. Safe to leave blank for v1.',
    }),
    defineField({
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'permissionRole',
      title: 'Permission role',
      type: 'string',
      options: {
        list: [
          { title: 'Member (read only, no Sanity access)', value: 'member' },
          { title: 'Contributor (drafts, awaiting admin review)', value: 'contributor' },
          { title: 'Admin (publish directly, elevate contributors)', value: 'admin' },
          { title: 'Super-admin (Dean — can elevate admins)', value: 'super-admin' },
        ],
        layout: 'radio',
      },
      initialValue: 'contributor',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discordId',
      title: 'Discord user ID',
      type: 'string',
      description: 'The numeric Discord snowflake (not the username). Set automatically on first sign-in via Auth.js; can be edited manually if needed to bind a Sanity contributor to a specific Discord identity.',
    }),
    defineField({
      name: 'externalWork',
      title: 'External portfolio / homepage',
      type: 'url',
      description: 'Primary off-Sharp Sighted home. Used as the byline link in v1 (until V2 profile pages exist).',
    }),
    defineField({
      name: 'socials',
      title: 'Social handles',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube channel', type: 'url' }),
        defineField({ name: 'tiktok', title: 'TikTok', type: 'url' }),
        defineField({ name: 'linkedin', title: 'LinkedIn', type: 'url' }),
      ],
    }),
    defineField({
      name: 'feedIncluded',
      title: 'Include in cross-network feed',
      type: 'boolean',
      description: 'When true, this contributor’s socials are polled by /api/cron/feed-poll and surface on /feed. Reserved for vetted long-term contributors.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});
