import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson, parseYear } from '../http';
import type { SourceAdapter } from './types';

/**
 * Europeana — https://pro.europeana.eu/page/search
 * Needs a free key (EUROPEANA_API_KEY). Aggregates thousands of European
 * museums, so it is only queried for Europe (or when no region is chosen).
 */

const API = 'https://api.europeana.eu/record/v2';

interface EuropeanaItem {
  id: string;
  guid?: string;
  title?: string[];
  dcCreator?: string[];
  year?: string[];
  country?: string[];
  dataProvider?: string[];
  rights?: string[];
  edmPreview?: string[];
  edmIsShownBy?: string[];
  dcDescription?: string[];
  type?: string;
}

interface EuropeanaSearch {
  success: boolean;
  totalResults: number;
  items?: EuropeanaItem[];
  nextCursor?: string;
}

const key = () => process.env.EUROPEANA_API_KEY?.trim() || '';

function isOpen(rights: string | undefined): boolean {
  return !!rights && /publicdomain|\/zero\//.test(rights);
}

export function normaliseEuropeana(i: EuropeanaItem): Artwork | null {
  const preview = i.edmPreview?.[0];
  if (!preview) return null;
  const year = parseYear(i.year?.[0]);
  const country = i.country?.[0] ?? null;
  return {
    key: `europeana:${i.id}`,
    source: 'europeana',
    sourceId: i.id.replace(/^\//, ''),
    title: i.title?.[0] || 'Untitled',
    artist: i.dcCreator?.find((c) => !/^https?:/.test(c)) ?? null,
    dateText: i.year?.[0] ?? null,
    yearStart: year,
    yearEnd: year,
    place: country,
    region: inferRegion(country) ?? 'europe',
    styles: inferStyles(i.title?.[0], i.dcDescription?.[0]),
    medium: null,
    thumbUrl: preview,
    imageUrl: i.edmIsShownBy?.[0] ?? preview,
    sourceUrl: i.guid ?? `https://www.europeana.eu/item${i.id}`,
    credit: i.dataProvider?.[0] ? `${i.dataProvider[0]} via Europeana` : 'Europeana',
    isPublicDomain: isOpen(i.rights?.[0]),
    description: i.dcDescription?.[0] ?? null,
  };
}

export const europeana: SourceAdapter = {
  meta: {
    id: 'europeana',
    name: 'Europeana',
    country: 'European Union',
    homepage: 'https://www.europeana.eu/',
    needsKey: true,
    envKey: 'EUROPEANA_API_KEY',
    strengths: 'Thousands of European museums and archives in one search.',
  },
  enabled: () => key().length > 0,
  unsupported: (q) =>
    q.regions.length && !q.regions.includes('europe') ? 'Europeana covers European collections only' : null,
  async search(q, cursor, limit) {
    const qf = ['TYPE:IMAGE'];
    if (q.regions.includes('europe')) {
      const countries = getRegion('europe').europeana.map((c) => `"${c}"`).join(' OR ');
      qf.push(`COUNTRY:(${countries})`);
    }
    if (q.from !== null || q.to !== null) qf.push(`YEAR:[${q.from ?? '*'} TO ${q.to ?? '*'}]`);
    const text = [...q.styles.map((s) => getStyle(s).keywords[0]!), q.q].filter(Boolean).join(' ');
    const url = buildUrl(`${API}/search.json`, {
      wskey: key(),
      query: text || '*',
      qf,
      reusability: q.openAccess ? 'open' : undefined,
      media: 'true',
      thumbnail: 'true',
      rows: limit,
      cursor: cursor ?? '*',
      profile: 'standard',
    });
    const res = await fetchJson<EuropeanaSearch>(url);
    const items = (res.items ?? []).map(normaliseEuropeana).filter((a): a is Artwork => a !== null);
    return { items, next: res.nextCursor ?? null, total: res.totalResults };
  },
  async get(id) {
    // The record API is deeply nested; a search by id returns the same flat shape as results.
    const search = await fetchJson<EuropeanaSearch>(
      buildUrl(`${API}/search.json`, { wskey: key(), query: `europeana_id:"/${id}"`, rows: 1, profile: 'standard' }),
    );
    const item = search.items?.[0];
    return item ? normaliseEuropeana(item) : null;
  },
};
