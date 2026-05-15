import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * 10% Rule archive entry. Architecture spec §9.
 *
 * Each entry documents a piece of work given as part of Dean's standing
 * commitment to give 10% of time, resources, or effort to causes that
 * align with the brand. Surfaced at /10-percent.
 */
export const tenPercentEntry = defineType({
  name: 'tenPercentEntry',
  title: '10% Archive entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
    }),
    defineField({
      name: 'partnerOrganization',
      title: 'Partner organization (optional)',
      type: 'string',
      description: 'The cause, charity, school, or group the work supports.',
    }),
    defineField({
      name: 'dateCompleted',
      title: 'Date completed',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Community', value: 'community' },
          { title: 'Education', value: 'education' },
          { title: 'Mental health', value: 'mental-health' },
          { title: 'Accessibility', value: 'accessibility' },
          { title: 'Neurodiversity', value: 'neurodiversity' },
          { title: 'Animal welfare', value: 'animal-welfare' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Story',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Pull-quote', value: 'blockquote' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery (optional)',
      type: 'array',
      of: [
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
  ],
  orderings: [
    {
      title: 'Most recent first',
      name: 'dateCompletedDesc',
      by: [{ field: 'dateCompleted', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'partnerOrganization',
      media: 'coverImage',
      date: 'dateCompleted',
    },
    prepare({ title, subtitle, media, date }) {
      const year = date ? new Date(date).getFullYear() : '';
      return {
        title,
        subtitle: [subtitle, year].filter(Boolean).join(' · '),
        media,
      };
    },
  },
});
