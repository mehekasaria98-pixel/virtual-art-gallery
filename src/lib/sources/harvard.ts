import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson } from '../http';
import type { SourceAdapter } from './types';

/**
 * Harvard Art Museums — https://github.com/harvardartmuseums/api-docs
 * Needs a free key (HARVARD_API_KEY). `culture` accepts several values joined
 * with "|"; `q` takes Elasticsearch query-string syntax for date ranges.
 */

const API = 'https://api.harvardartmuseums.org';
const FIELDS = 'id,objectid,title,people,dated,datebegin,dateend,culture,period,primaryimageurl,url,medium,classification,creditline,imagepermissionlevel,style,description';

interface HarvardRecord {
  id: number;
  title?: string;
  people?: Array<{ name: string; role?: string }>;
  dated?: string;
  datebegin?: number;
  dateend?: number;
  culture?: string;
  period?: string;
  primaryimageurl?: string | null;
  url?: string;
  medium?: string;
  classification?: string;
  creditline?: string;
  imagepermissionlevel?: number;
  style?: string;
  description?: string | null;
}

interface HarvardSearch {
  info: { totalrecords: number; pages: number; page: number };
  records: HarvardRecord[];
}

const key = () => process.env.HARVARD_API_KEY?.trim() || '';

export function normaliseHarvard(r: HarvardRecord): Artwork | null {
  if (!r.primaryimageurl || r.imagepermissionlevel === 2) return null;
  const artist = r.people?.find((p) => !p.role || p.role === 'Artist')?.name ?? null;
  return {
    key: `harvard:${r.id}`,
    source: 'harvard',
    sourceId: String(r.id),
    title: r.title || 'Untitled',
    artist,
    dateText: r.dated ?? null,
    yearStart: r.datebegin || null,
    yearEnd: r.dateend || null,
    place: [r.culture, r.period].filter(Boolean).join(', ') || null,
    region: inferRegion(r.culture, r.period),
    styles: inferStyles(r.style, r.period, r.classification),
    medium: r.medium ?? null,
    thumbUrl: `${r.primaryimageurl}?width=500`,
    imageUrl: `${r.primaryimageurl}?width=1400`,
    sourceUrl: r.url || `https://harvardartmuseums.org/collections/object/${r.id}`,
    credit: r.creditline ? `Harvard Art Museums — ${r.creditline}` : 'Harvard Art Museums',
    // Harvard images are free for non-commercial use; not marked public domain.
    isPublicDomain: false,
    description: r.description ?? null,
  };
}

export const harvard: SourceAdapter = {
  meta: {
    id: 'harvard',
    name: 'Harvard Art Museums',
    country: 'United States',
    homepage: 'https://harvardartmuseums.org/collections/api',
    needsKey: true,
    envKey: 'HARVARD_API_KEY',
    strengths: 'Asian, European and American art; rich period and culture tagging.',
  },
  enabled: () => key().length > 0,
  unsupported: (q) => (q.openAccess ? 'Harvard images are not public domain' : null),
  async search(q, cursor, limit) {
    const page = cursor ? Number(cursor) : 1;
    const terms: string[] = [];
    if (q.from !== null) terms.push(`dateend:>=${q.from}`);
    if (q.to !== null) terms.push(`datebegin:<=${q.to}`);
    const keyword = [...q.styles.map((s) => getStyle(s).keywords[0]!), q.q].filter(Boolean).join(' ');
    const url = buildUrl(`${API}/object`, {
      apikey: key(),
      hasimage: 1,
      culture: q.regions.length ? q.regions.flatMap((r) => getRegion(r).harvard).join('|') : undefined,
      keyword: keyword || undefined,
      q: terms.length ? terms.join(' AND ') : undefined,
      sort: q.sort === 'relevance' ? 'rank' : 'datebegin',
      sortorder: q.sort === 'newest' ? 'desc' : 'asc',
      fields: FIELDS,
      size: limit,
      page,
    });
    const res = await fetchJson<HarvardSearch>(url);
    const items = res.records.map(normaliseHarvard).filter((a): a is Artwork => a !== null);
    return { items, next: page < res.info.pages ? String(page + 1) : null, total: res.info.totalrecords };
  },
  async get(id) {
    const r = await fetchJson<HarvardRecord>(buildUrl(`${API}/object/${encodeURIComponent(id)}`, { apikey: key() }));
    return normaliseHarvard(r);
  },
};
