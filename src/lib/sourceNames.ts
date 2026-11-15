import type { SourceId } from '@/types/artwork';

/** Short display names, safe to import in client components. */
export const SOURCE_NAMES: Record<SourceId, string> = {
  aic: 'Art Institute of Chicago',
  met: 'The Met',
  cma: 'Cleveland Museum of Art',
  vam: 'V&A',
  wikidata: 'Wikidata',
  harvard: 'Harvard Art Museums',
  europeana: 'Europeana',
  smithsonian: 'Smithsonian',
};
