import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson, stripHtml } from '../http';
import { fanOut, pairs, type SourceAdapter } from './types';

/**
 * Cleveland Museum of Art Open Access — https://openaccess-api.clevelandart.org/
 * Keyless. `culture` is a substring match ("Africa" matches
 * "Africa, West Africa, Nigeria…"), one value per request.
 */

const API = 'https://openaccess-api.clevelandart.org/api/artworks/';

export interface CmaArtwork {
  id: number;
  title: string;
  url?: string;
  creation_date?: string | null;
  creation_date_earliest?: number | null;
  creation_date_latest?: number | null;
  culture?: string[] | null;
  technique?: string | null;
  department?: string | null;
  type?: string | null;
  share_license_status?: string | null;
  credit_line?: string | null;
  description?: string | null;
  creators?: Array<{ description?: string | null }> | null;
  images?: { web?: { url: string } | null; print?: { url: string } | null } | null;
}

interface CmaSearch {
  info: { total: number };
  data: CmaArtwork[];
}

export function normaliseCma(a: CmaArtwork): Artwork | null {
  const web = a.images?.web?.url;
  if (!web) return null;
  const culture = a.culture?.join('; ') ?? null;
  const artist = a.creators?.[0]?.description?.replace(/\s*\(.*\)\s*$/, '') ?? null;
  return {
    key: `cma:${a.id}`,
    source: 'cma',
    sourceId: String(a.id),
    title: a.title || 'Untitled',
    artist,
    dateText: a.creation_date ?? null,
    yearStart: a.creation_date_earliest ?? null,
    yearEnd: a.creation_date_latest ?? null,
    place: culture,
    region: inferRegion(culture, a.department),
    styles: inferStyles(culture, a.department, a.type),
    medium: a.technique ?? null,
    thumbUrl: web,
    imageUrl: a.images?.print?.url ?? web,
    sourceUrl: a.url || `https://www.clevelandart.org/art/collection/search?search=${a.id}`,
    credit: a.credit_line ? `Cleveland Museum of Art — ${a.credit_line}` : 'Cleveland Museum of Art',
    isPublicDomain: a.share_license_status === 'CC0',
    description: stripHtml(a.description),
  };
}

export const cma: SourceAdapter = {
  meta: {
    id: 'cma',
    name: 'Cleveland Museum of Art',
    country: 'United States',
    homepage: 'https://www.clevelandart.org/open-access',
    needsKey: false,
    strengths: 'Global and CC0: excellent Asian, African, Egyptian and European holdings.',
  },
  enabled: () => true,
  async search(q, cursor, limit) {
    const cultures = q.regions.flatMap((r) => getRegion(r).cma.slice(0, q.regions.length > 1 ? 1 : 2));
    const keywords = q.styles.map((s) => getStyle(s).keywords[0]!);
    const subqueries = pairs(cultures, keywords, 3);
    return fanOut(subqueries, cursor, limit, async ([culture, kw], skip, per) => {
      const url = buildUrl(API, {
        q: [kw, q.q].filter(Boolean).join(' ') || undefined,
        culture,
        created_after: q.from ?? undefined,
        created_before: q.to ?? undefined,
        has_image: 1,
        cc0: q.openAccess ? 1 : undefined,
        skip,
        limit: per,
      });
      const res = await fetchJson<CmaSearch>(url);
      const items = res.data.map(normaliseCma).filter((a): a is Artwork => a !== null);
      return { items, hasMore: skip + per < res.info.total, total: res.info.total };
    });
  },
  async get(id) {
    const res = await fetchJson<{ data: CmaArtwork }>(`${API}${encodeURIComponent(id)}`);
    return normaliseCma(res.data);
  },
};
