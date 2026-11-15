import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson } from '../http';
import { fanOut, pairs, type SourceAdapter } from './types';

/**
 * The Metropolitan Museum of Art — https://metmuseum.github.io/
 * Keyless. Search (v1.1, paginated) returns object IDs only; each object is
 * then fetched individually. The old v1 search endpoint was retired on
 * 2026-10-01. `geoLocation` accepts one place per request, so we fan out.
 */

const API = 'https://collectionapi.metmuseum.org/public/collection';

export interface MetObject {
  objectID: number;
  isPublicDomain: boolean;
  primaryImage: string;
  primaryImageSmall: string;
  title: string;
  culture?: string;
  period?: string;
  dynasty?: string;
  artistDisplayName?: string;
  artistDisplayBio?: string;
  objectDate?: string;
  objectBeginDate?: number;
  objectEndDate?: number;
  medium?: string;
  country?: string;
  region?: string;
  city?: string;
  department?: string;
  classification?: string;
  creditLine?: string;
  objectURL?: string;
  tags?: Array<{ term: string }> | null;
}

interface MetSearch {
  total: number;
  objectIDs: number[] | null;
}

export function normaliseMet(o: MetObject): Artwork | null {
  if (!o.primaryImageSmall) return null;
  const place = [o.culture, o.country, o.region, o.period].filter(Boolean).join(', ') || null;
  return {
    key: `met:${o.objectID}`,
    source: 'met',
    sourceId: String(o.objectID),
    title: o.title || 'Untitled',
    artist: o.artistDisplayName || null,
    dateText: o.objectDate || null,
    yearStart: o.objectBeginDate ?? null,
    yearEnd: o.objectEndDate ?? null,
    place,
    region: inferRegion(o.country, o.culture, o.region, o.artistDisplayBio, o.department),
    styles: inferStyles(o.period, o.classification, o.department, o.tags?.map((t) => t.term).join(' ')),
    medium: o.medium || null,
    thumbUrl: o.primaryImageSmall,
    imageUrl: o.primaryImageSmall,
    sourceUrl: o.objectURL || `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
    credit: o.creditLine ? `The Metropolitan Museum of Art — ${o.creditLine}` : 'The Metropolitan Museum of Art',
    isPublicDomain: o.isPublicDomain,
  };
}

async function getObject(id: number | string): Promise<MetObject | null> {
  try {
    return await fetchJson<MetObject>(`${API}/v1/objects/${id}`, { timeoutMs: 5000, retries: 0, revalidate: 60 * 60 * 24 });
  } catch {
    return null;
  }
}

export const met: SourceAdapter = {
  meta: {
    id: 'met',
    name: 'The Metropolitan Museum of Art',
    country: 'United States',
    homepage: 'https://www.metmuseum.org/about-the-met/policies-and-documents/open-access',
    needsKey: false,
    strengths: 'Encyclopaedic: strong on Africa, Asia, the Islamic world, Egypt and Europe.',
  },
  enabled: () => true,
  async search(q, cursor, limit) {
    const places = q.regions.flatMap((r) => getRegion(r).met.slice(0, q.regions.length > 1 ? 1 : 3));
    const keywords = q.styles.map((s) => getStyle(s).keywords[0]!);
    const subqueries = pairs(places, keywords, 3);
    // The Met fetches one object per request: keep pages modest.
    const pageSize = Math.min(limit, 9);
    return fanOut(subqueries, cursor, pageSize, async ([place, kw], offset, per) => {
      const text = [kw, q.q].filter(Boolean).join(' ');
      const url = buildUrl(`${API}/v1.1/search`, {
        q: text || undefined,
        hasImages: 'true',
        isPublicDomain: q.openAccess ? 'true' : undefined,
        geoLocation: place,
        // The Met needs both bounds together.
        dateBegin: q.from !== null || q.to !== null ? (q.from ?? -5000) : undefined,
        dateEnd: q.from !== null || q.to !== null ? (q.to ?? new Date().getFullYear()) : undefined,
        offset,
        limit: per,
      });
      const res = await fetchJson<MetSearch>(url);
      const ids = res.objectIDs ?? [];
      const objects = await Promise.all(ids.map(getObject));
      const items = objects
        .filter((o): o is MetObject => o !== null)
        .filter((o) => !q.openAccess || o.isPublicDomain)
        .map(normaliseMet)
        .filter((a): a is Artwork => a !== null);
      return { items, hasMore: offset + per < res.total, total: res.total };
    });
  },
  async get(id) {
    const o = await getObject(id);
    return o ? normaliseMet(o) : null;
  },
};
