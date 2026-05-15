import { defineType, defineField } from 'sanity';

/**
 * Series — one of the six ongoing shows. Bartographer, Special Moments,
 * Corridor, Home Architecture, Alpha Architect, Ripped or Stamped.
 *
 * Badge values follow the Media Roadmap content classification:
 *   magnet     — discovery, top-of-funnel
 *   funnel     — relationship-building, mid-funnel
 *   authority  — depth and expertise, bottom-funnel
 *   flagship   — a hero series that anchors the brand
 *
 * Pillar association lets a series page surface the right tag colour
 * (Sharp gold, Seen cyan, Human terracotta) — though every series carries
 * every pillar, this is its centre of gravity.
 */
export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line description shown on /series cards and the series page hero.',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'badge',
      title: 'Role badge',
      type: 'string',
      options: {
        list: [
          { title: 'Magnet', value: 'magnet' },
          { title: 'Funnel', value: 'funnel' },
          { title: 'Authority', value: 'authority' },
          { title: 'Flagship', value: 'flagship' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pillar',
      title: 'Primary pillar',
      type: 'string',
      options: {
        list: [
          { title: 'Sharp (gold)', value: 'sharp' },
          { title: 'Seen (cyan)', value: 'seen' },
          { title: 'Human (terracotta)', value: 'human' },
        ],
        layout: 'radio',
      },
      description: 'Every series carries every pillar — this is its centre of gravity.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'About this series',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rendered on /series/[slug]. A few paragraphs of context.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'primaryAuthor',
      title: 'Primary author (optional)',
      type: 'reference',
      to: [{ type: 'contributor' }],
      description: 'If a series has a host or showrunner other than Dean, point it here. Surfaced on the series page.',
    }),
    defineField({
      name: 'externalHomeUrl',
      title: 'External home URL',
      type: 'url',
      description: 'YouTube channel, the eventual standalone RoS site, etc. If set, the series page surfaces a "Subscribe" CTA pointing here.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower = earlier on /series and homepage. Six tiles total.',
      initialValue: 100,
    }),
  ],
  orderings: [
    { title: 'Display order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'tagline', media: 'coverImage' },
  },
});
