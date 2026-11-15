import { z } from 'zod';
import type { SearchQuery, SortOrder, SourceId } from '@/types/artwork';
import { clampYear } from '@/taxonomy/eras';
import { isRegionId, type RegionId } from '@/taxonomy/regions';
import { isStyleId, type StyleId } from '@/taxonomy/styles';

/**
 * One URL schema for the whole app — used by the Explore page (shareable
 * links) and by `/api/artworks`. Lists are comma-separated.
 *
 *   ?regions=europe,east-asia&from=1800&to=1899&styles=romanticism
 *    &q=sea&sources=aic,met&pd=1&sort=oldest&view=grid
 */

export const SOURCE_IDS: SourceId[] = ['aic', 'met', 'cma', 'vam', 'wikidata', 'harvard', 'europeana', 'smithsonian'];
export const SORTS: SortOrder[] = ['relevance', 'oldest', 'newest'];
export const VIEWS = ['grid', 'timeline', 'map'] as const;
export type ViewMode = (typeof VIEWS)[number];

export const EMPTY_QUERY: SearchQuery = {
  regions: [],
  from: null,
  to: null,
  styles: [],
  q: '',
  sources: [],
  openAccess: false,
  sort: 'relevance',
};

const list = z
  .string()
  .optional()
  .transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []));

const year = z
  .string()
  .optional()
  .transform((v) => {
    if (v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? clampYear(n) : null;
  });

const schema = z.object({
  regions: list,
  styles: list,
  sources: list,
  from: year,
  to: year,
  q: z.string().optional().transform((v) => (v ?? '').trim().slice(0, 120)),
  pd: z.string().optional(),
  sort: z.string().optional(),
});

type ParamsLike = URLSearchParams | { get(name: string): string | null };

export function parseQuery(params: ParamsLike): SearchQuery {
  const raw = Object.fromEntries(
    ['regions', 'styles', 'sources', 'from', 'to', 'q', 'pd', 'sort'].map((k) => [k, params.get(k) ?? undefined]),
  );
  const p = schema.parse(raw);
  let from = p.from;
  let to = p.to;
  if (from !== null && to !== null && from > to) [from, to] = [to, from];
  return {
    regions: unique(p.regions.filter(isRegionId)) as RegionId[],
    styles: unique(p.styles.filter(isStyleId)) as StyleId[],
    sources: unique(p.sources.filter((s): s is SourceId => SOURCE_IDS.includes(s as SourceId))),
    from,
    to,
    q: p.q,
    openAccess: p.pd === '1' || p.pd === 'true',
    sort: SORTS.includes(p.sort as SortOrder) ? (p.sort as SortOrder) : 'relevance',
  };
}

export function parseView(params: ParamsLike): ViewMode {
  const v = params.get('view');
  return VIEWS.includes(v as ViewMode) ? (v as ViewMode) : 'grid';
}

/** Serialise to URLSearchParams, omitting defaults so links stay short. */
export function toSearchParams(q: SearchQuery, extra: Record<string, string | null> = {}): URLSearchParams {
  const p = new URLSearchParams();
  if (q.regions.length) p.set('regions', q.regions.join(','));
  if (q.from !== null) p.set('from', String(q.from));
  if (q.to !== null) p.set('to', String(q.to));
  if (q.styles.length) p.set('styles', q.styles.join(','));
  if (q.q) p.set('q', q.q);
  if (q.sources.length) p.set('sources', q.sources.join(','));
  if (q.openAccess) p.set('pd', '1');
  if (q.sort !== 'relevance') p.set('sort', q.sort);
  for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
  return p;
}

export function isEmptyQuery(q: SearchQuery): boolean {
  return !q.regions.length && !q.styles.length && q.from === null && q.to === null && !q.q;
}

function unique<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
