import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Journal post — the multi-author blog format. Architecture spec §7.
 *
 * Status ladder:
 *   draft      — author is still writing; nothing public
 *   pending    — contributor finished a draft; awaits admin review
 *   published  — visible at /journal/[slug]
 *
 * The Sanity webhook on publish triggers /api/sanity-webhook which
 * revalidates /journal and the post URL. Reaction counts come from
 * Postgres, not Sanity — `slug.current` is the join key.
 */
export const journalPost = defineType({
  name: 'journalPost',
  title: 'Journal post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(180),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Shown on the homepage Latest block and the /journal index. ~180 chars.',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'contributor' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'series',
      title: 'Series (optional)',
      type: 'reference',
      to: [{ type: 'series' }],
      description: 'If this post is an episode of a series, attach it. Otherwise leave blank.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Topical tags. Lowercase, kebab-case. Used by /journal?tag=… filter.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Pull-quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Italic', value: 'em' },
              { title: 'Strong', value: 'strong' },
            ],
            annotations: [
              defineArrayMember({
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({ name: 'href', type: 'url', validation: (r) => r.required() }),
                  defineField({ name: 'openInNewTab', type: 'boolean', initialValue: false }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'caption', type: 'string', title: 'Caption' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Pending review', value: 'pending' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'discordChannelUrl',
      title: 'Discord channel URL (optional)',
      type: 'url',
      description: 'Per-post override for the "Discuss in Discord" CTA. If blank, the post falls back to the default channel from Site Settings.',
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      status: 'status',
      media: 'coverImage',
    },
    prepare({ title, author, status, media }) {
      const statusLabel = status === 'published' ? '' : ` (${status})`;
      return {
        title,
        subtitle: `${author ?? 'No author'}${statusLabel}`,
        media,
      };
    },
  },
});
