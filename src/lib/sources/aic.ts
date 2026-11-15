import type { Artwork, SearchQuery } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles, styleFromAic, type StyleId } from '@/taxonomy/styles';
import { fetchJson, stripHtml } from '../http';
import type { SourceAdapter } from './types';

/**
 * Art Institute of Chicago — https://api.artic.edu/docs/
 * Keyless. Elasticsearch-backed, so region, era, style and keyword combine in
 * one request. Images are IIIF.
 */

const API = 'https://api.artic.edu/api/v1';
const IIIF = 'https://www.artic.edu/iiif/2';
const FIELDS = [
  'id', 'title', 'artist_display', 'artist_title', 'date_display', 'date_start', 'date_end',
  'place_of_origin', 'style_id', 'style_ids', 'style_title', 'image_id', 'is_public_domain',
  'medium_display', 'credit_line',
].join(',');

export interface AicArtwork {
  id: number;
  title: string | null;
  artist_display?: string | null;
  artist_title?: string | null;
  date_display?: string | null;
  date_start?: number | null;
  date_end?: number | null;
  place_of_origin?: string | null;
  style_id?: string | null;
  style_ids?: string[] | null;
  style_title?: string | null;
  image_id?: string | null;
  is_public_domain?: boolean;
  medium_display?: string | null;
  credit_line?: string | null;
  description?: string | null;
}

interface AicSearchResponse {
  pagination: { total: number; limit: number; current_page: number; total_pages: number };
  data: AicArtwork[];
}

export function buildAicQuery(q: SearchQuery) {
  const filter: unknown[] = [{ exists: { field: 'image_id' } }];
  if (q.openAccess) filter.push({ term: { is_public_domain: true } });
  if (q.to !== null) filter.push({ range: { date_start: { lte: q.to } } });
  if (q.from !== null) filter.push({ range: { date_end: { gte: q.from } } });
  if (q.regions.length) {
    const places = q.regions.flatMap((r) => getRegion(r).aic);
    filter.push({ terms: { 'place_of_origin.keyword': places } });
  }
  const must: unknown[] = [];
  if (q.styles.length) {
    // AIC tags only some works with style terms (e.g. ukiyo-e prints are not), so
    // match either a style id or the style's keyword in titles/terms.
    const styleIds = q.styles.flatMap((s) => getStyle(s).aic ?? []);
    const keywords = q.styles.map((s) => getStyle(s).keywords[0]!);
    const should: unknown[] = [];
    if (styleIds.length) should.push({ terms: { style_ids: styleIds } });
    for (const kw of keywords) {
      should.push({ multi_match: { query: kw, type: 'phrase', fields: ['title', 'style_titles', 'term_titles', 'classification_titles'] } });
    }
    must.push({ bool: { should, minimum_should_match: 1 } });
  }
  if (q.q) must.push({ multi_match: { query: q.q, fields: ['title^3', 'artist_title^2', 'term_titles', 'style_titles', 'place_of_origin'] } });
  // Nudge popular, well-photographed works to the top when there is no keyword.
  const should = q.q ? [] : [{ term: { is_boosted: { value: true, boost: 4 } } }];
  const sort =
    q.sort === 'oldest' ? [{ date_start: 'asc' }] : q.sort === 'newest' ? [{ date_start: 'desc' }] : undefined;
  return { query: { bool: { filter, must, should } }, ...(sort ? { sort } : {}) };
}

export function normaliseAic(a: AicArtwork): Artwork | null {
  if (!a.image_id) return null;
  const styleIds = new Set<StyleId>();
  for (const t of a.style_ids ?? []) {
    const s = styleFromAic(t);
    if (s) styleIds.add(s);
  }
  for (const s of inferStyles(a.style_title)) styleIds.add(s);
  return {
    key: `aic:${a.id}`,
    source: 'aic',
    sourceId: String(a.id),
    title: a.title || 'Untitled',
    artist: a.artist_title || a.artist_display?.split('\n')[0] || null,
    dateText: a.date_display ?? null,
    yearStart: a.date_start ?? null,
    yearEnd: a.date_end ?? null,
    place: a.place_of_origin ?? null,
    region: inferRegion(a.place_of_origin, a.artist_display),
    styles: [...styleIds],
    medium: a.medium_display ?? null,
    thumbUrl: `${IIIF}/${a.image_id}/full/400,/0/default.jpg`,
    imageUrl: `${IIIF}/${a.image_id}/full/843,/0/default.jpg`,
    sourceUrl: `https://www.artic.edu/artworks/${a.id}`,
    credit: a.credit_line ? `Art Institute of Chicago — ${a.credit_line}` : 'Art Institute of Chicago',
    isPublicDomain: Boolean(a.is_public_domain),
    description: stripHtml(a.description),
  };
}

export const aic: SourceAdapter = {
  meta: {
    id: 'aic',
    name: 'Art Institute of Chicago',
    country: 'United States',
    homepage: 'https://www.artic.edu/open-access',
    needsKey: false,
    strengths: 'European and American painting, Impressionism, Asian and Indian art; tagged by style.',
  },
  enabled: () => true,
  async search(q, cursor, limit) {
    const page = cursor ? Number(cursor) : 1;
    const body = { ...buildAicQuery(q), limit, page, fields: FIELDS };
    const res = await fetchJson<AicSearchResponse>(`${API}/artworks/search`, { method: 'POST', body });
    const items = res.data.map(normaliseAic).filter((a): a is Artwork => a !== null);
    const hasMore = res.pagination.current_page < res.pagination.total_pages && page * limit < 1000;
    return { items, next: hasMore ? String(page + 1) : null, total: res.pagination.total };
  },
  async get(id) {
    const res = await fetchJson<{ data: AicArtwork }>(`${API}/artworks/${encodeURIComponent(id)}?fields=${FIELDS},description`);
    return normaliseAic(res.data);
  },
};
