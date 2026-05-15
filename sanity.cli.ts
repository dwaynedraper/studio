import { defineCliConfig } from 'sanity/cli';
import { dataset, projectId } from './src/sanity/env';

/**
 * Sanity CLI config — used by `npx sanity` commands (graphql deploy,
 * dataset export, etc.). Reads from the same env vars as the runtime
 * Studio config so there's a single source of truth.
 */
export default defineCliConfig({
  api: { projectId, dataset },
  studioHost: 'sharpsighted',
  autoUpdates: true,
});
