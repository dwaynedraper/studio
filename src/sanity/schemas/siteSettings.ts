import { defineType, defineField } from 'sanity';

/**
 * Site settings — singleton document. One row only; managed via Sanity's
 * structure customization to disallow creating more than one. Surfaces
 * brand-wide knobs the journal posts and feed components need at render
 * time.
 *
 * The Studio enforces "singleton" via the structure resolver in
 * sanity.config.ts.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      initialValue: 'Sharp Sighted Studio',
    }),
    defineField({
      name: 'description',
      title: 'Site description (meta)',
      type: 'text',
      rows: 3,
      initialValue:
        'A small collective of photographers, videographers, and the people who care about the craft. Read the journal, see the work, join the conversation.',
    }),
    defineField({
      name: 'discordInviteUrl',
      title: 'Discord invite URL',
      type: 'url',
      description: 'The standing invite link surfaced on /join and the homepage hero. Falls back to the DISCORD_INVITE_URL env var if blank.',
    }),
    defineField({
      name: 'defaultDiscussChannelUrl',
      title: 'Default "Discuss in Discord" channel URL',
      type: 'url',
      description: 'Used by journal posts that don’t set their own discordChannelUrl. Typically the general or #journal channel.',
    }),
    defineField({
      name: 'officialAccounts',
      title: 'Sharp Sighted official social accounts',
      type: 'object',
      description: 'Polled by /api/cron/feed-poll. Vetted contributor socials live on the contributor record (feedIncluded toggle).',
      fields: [
        defineField({
          name: 'youtubeChannelId',
          title: 'YouTube channel ID',
          type: 'string',
          description: 'The UC... ID, not the @handle.',
        }),
        defineField({
          name: 'instagramHandle',
          title: 'Instagram @handle',
          type: 'string',
        }),
        defineField({
          name: 'facebookPageUrl',
          title: 'Facebook page URL',
          type: 'url',
        }),
        defineField({
          name: 'linkedinPageUrl',
          title: 'LinkedIn page URL',
          type: 'url',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site settings' };
    },
  },
});
