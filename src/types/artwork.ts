import type { RegionId } from '@/taxonomy/regions';
import type { StyleId } from '@/taxonomy/styles';

/** Identifier for each upstream museum / data provider. */
export type SourceId =
  | 'aic'
  | 'met'
  | 'cma'
  | 'vam'
  | 'wikidata'
  | 'harvard'
  | 'europeana'
  | 'smithsonian';

/** One artwork, normalised from any source. */
export interface Artwork {
  /** Globally unique key: `${source}:${sourceId}` */
  key: string;
  source: SourceId;
  /** The id as the source knows it (used for detail look-ups). */
  sourceId: string;
  title: string;
  artist: string | null;
  /** Human-readable date as the museum wrote it, e.g. "ca. 1780". */
  dateText: string | null;
  /** Numeric year range (negative = BCE). */
  yearStart: number | null;
  yearEnd: number | null;
  /** Free-text place / culture from the source, e.g. "Japan, Edo period". */
  place: string | null;
  /** Our region, when we can infer it. */
  region: RegionId | null;
  /** Style ids from our taxonomy that this work matched. */
  styles: StyleId[];
  medium: string | null;
  /** Small/medium image (~400–850 px) for grids. */
  thumbUrl: string;
  /** Largest image we are allowed to show. */
  imageUrl: string;
  /** Link to the object's page at the museum. */
  sourceUrl: string;
  /** Credit line / institution. */
  credit: string;
  isPublicDomain: boolean;
  description?: string | null;
}

export type SortOrder = 'relevance' | 'oldest' | 'newest';

/** Normalised search request shared by the API and every adapter. */
export interface SearchQuery {
  regions: RegionId[];
  from: number | null;
  to: number | null;
  styles: StyleId[];
  q: string;
  sources: SourceId[];
  openAccess: boolean;
  sort: SortOrder;
}

export type SourceState = 'ok' | 'error' | 'timeout' | 'disabled' | 'skipped' | 'exhausted';

export interface SourceStatus {
  id: SourceId;
  state: SourceState;
  count: number;
  total?: number | null;
  message?: string;
}

/** Page of results from one adapter. */
export interface AdapterPage {
  items: Artwork[];
  /** Opaque per-source cursor; null when no more results. */
  next: string | null;
  total?: number | null;
}

export interface SearchResponse {
  items: Artwork[];
  cursor: string | null;
  sources: SourceStatus[];
}

export interface SourceInfo {
  id: SourceId;
  name: string;
  country: string;
  homepage: string;
  needsKey: boolean;
  enabled: boolean;
}
