import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';

/**
 * Sanity Studio config. Mounted in Next.js at /studio via
 * src/app/studio/[[...tool]]/page.tsx.
 *
 * Deviation from architecture spec: the spec says "Sanity v3" — the
 * package "sanity" now resolves to v5. The defineConfig + structureTool +
 * visionTool surface used here works identically in v5.
 *
 * The siteSettings document is enforced as a singleton via the structure
 * resolver in src/sanity/structure.ts; we also filter it out of the
 * create-new menu and disable delete on its document actions.
 */
export default defineConfig({
  name: 'sharp-sighted-studio',
  title: 'Sharp Sighted Studio',
  basePath: '/studio',
  projectId,
  dataset,
  apiVersion,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    /* Hide `siteSettings` from the "new document" menu since it's a singleton. */
    templates: (prev) => prev.filter((t) => t.schemaType !== 'siteSettings'),
  },
  document: {
    /* Prevent duplicate / delete actions on the singleton siteSettings doc. */
    actions: (prev, { schemaType }) =>
      schemaType === 'siteSettings'
        ? prev.filter(({ action }) => !['duplicate', 'delete', 'unpublish'].includes(action ?? ''))
        : prev,
    /* Hide siteSettings from the "new document" picker globally. */
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((t) => t.templateId !== 'siteSettings')
        : prev,
  },
});
