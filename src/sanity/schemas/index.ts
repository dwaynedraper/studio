import type { SchemaTypeDefinition } from 'sanity';
import { contributor } from './contributor';
import { series } from './series';
import { journalPost } from './journalPost';
import { tenPercentEntry } from './tenPercentEntry';
import { siteSettings } from './siteSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  contributor,
  series,
  journalPost,
  tenPercentEntry,
  siteSettings,
];
