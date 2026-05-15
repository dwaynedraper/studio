import type { StructureResolver } from 'sanity/structure';

/**
 * Custom Studio structure. Enforces `siteSettings` as a singleton: it
 * appears as a fixed entry at the top of the sidebar with no "create
 * another" affordance, alongside the regular document-type lists.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sharp Sighted Studio')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site settings')
        ),
      S.divider(),
      S.documentTypeListItem('journalPost').title('Journal posts'),
      S.documentTypeListItem('series').title('Series'),
      S.documentTypeListItem('tenPercentEntry').title('10% Archive'),
      S.divider(),
      S.documentTypeListItem('contributor').title('Contributors'),
    ]);
