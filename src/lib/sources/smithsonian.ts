import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson, parseYear } from '../http';
import type { SourceAdapter } from './types';

/**
 * Smithsonian Open Access — https://edan.si.edu/openaccess/apidocs/
 * Needs a free api.data.gov key (SMITHSONIAN_API_KEY). Restricted to the art
 * museums: National Museum of African Art, American Art, Asian Art (NMAA /
 * Freer|Sackler), Hirshhorn, Cooper Hewitt and the National Portrait Gallery.
 */

const API = 'https://api.si.edu/openaccess/api/v1.0';
const ART_UNITS = ['NMAfA', 'SAAM', 'FSG', 'NMAA', 'HMSG', 'CHNDM', 'NPG'];

interface SiRow {
  id: string;
  title: string;
  unitCode?: string;
  content?: {
    descriptiveNonRepeating?: {
      record_link?: string;
      data_source?: string;
      online_media?: { media?: Array<{ content?: string; thumbnail?: string; usage?: { access?: string } }> };
    };
    freetext?: Record<string, Array<{ label: string; content: string }> | undefined>;
    indexedStructured?: { date?: string[]; place?: string[]; culture?: string[] };
  };
}

interface SiSearch {
  response: { rows: SiRow[]; rowCount: number };
}

const key = () => process.env.SMITHSONIAN_API_KEY?.trim() || '';

function free(row: SiRow, field: string, label?: string): string | null {
  const list = row.content?.freetext?.[field];
  const hit = label ? list?.find((x) => x.label === label) : list?.[0];
  return hit?.content?.replace(/<[^>]+>/g, '') ?? null;
}

export function normaliseSmithsonian(row: SiRow): Artwork | null {
  const media = row.content?.descriptiveNonRepeating?.online_media?.media?.[0];
  if (!media?.content) return null;
  const dateText = free(row, 'date');
  const place = free(row, 'place') ?? row.content?.indexedStructured?.place?.[0] ?? null;
  const year = parseYear(dateText ?? row.content?.indexedStructured?.date?.[0]);
  return {
    key: `smithsonian:${row.id}`,
    source: 'smithsonian',
    sourceId: row.id,
    title: row.title || 'Untitled',
    artist: free(row, 'name'),
    dateText,
    yearStart: year,
    yearEnd: year,
    place,
    region: inferRegion(place, row.content?.indexedStructured?.culture?.join(' ')),
    styles: inferStyles(row.title, free(row, 'topic'), free(row, 'notes')),
    medium: free(row, 'physicalDescription'),
    thumbUrl: media.thumbnail ?? media.content,
    imageUrl: media.content,
    sourceUrl: row.content?.descriptiveNonRepeating?.record_link ?? `https://collections.si.edu/search/results.htm?q=${encodeURIComponent(row.id)}`,
    credit: `${row.content?.descriptiveNonRepeating?.data_source ?? 'Smithsonian Institution'}`,
    isPublicDomain: media.usage?.access === 'CC0',
    description: free(row, 'notes', 'Description'),
  };
}

export const smithsonian: SourceAdapter = {
  meta: {
    id: 'smithsonian',
    name: 'Smithsonian Open Access',
    country: 'United States',
    homepage: 'https://www.si.edu/openaccess',
    needsKey: true,
    envKey: 'SMITHSONIAN_API_KEY',
    strengths: 'National Museum of African Art, Asian art (Freer|Sackler) and American art.',
  },
  enabled: () => key().length > 0,
  async search(q, cursor, limit) {
    const start = cursor ? Number(cursor) : 0;
    const parts = ['online_media_type:Images', `(${ART_UNITS.map((u) => `unit_code:${u}`).join(' OR ')})`];
    if (q.regions.length) {
      const places = q.regions.flatMap((r) => getRegion(r).smithsonian).map((p) => `place:"${p}"`);
      parts.push(`(${places.join(' OR ')})`);
    }
    if (q.from !== null || q.to !== null) {
      // The index stores decades/centuries as strings ("1850s"); approximate with decades.
      const from = Math.max(q.from ?? -3000, -3000);
      const to = Math.min(q.to ?? new Date().getFullYear(), new Date().getFullYear());
      if (from >= 0 && to - from <= 300) {
        const decades: string[] = [];
        for (let y = Math.floor(from / 10) * 10; y <= to; y += 10) decades.push(`date:"${y}s"`);
        parts.push(`(${decades.join(' OR ')})`);
      }
    }
    const text = [...q.styles.map((s) => getStyle(s).keywords[0]!), q.q].filter(Boolean);
    if (text.length) parts.push(text.map((t) => `"${t}"`).join(' AND '));
    const url = buildUrl(`${API}/search`, { q: parts.join(' AND '), rows: limit, start, api_key: key() });
    const res = await fetchJson<SiSearch>(url);
    const items = res.response.rows
      .map(normaliseSmithsonian)
      .filter((a): a is Artwork => a !== null)
      .filter((a) => !q.openAccess || a.isPublicDomain);
    return {
      items,
      next: start + limit < res.response.rowCount ? String(start + limit) : null,
      total: res.response.rowCount,
    };
  },
  async get(id) {
    const res = await fetchJson<{ response: SiRow }>(buildUrl(`${API}/content/${encodeURIComponent(id)}`, { api_key: key() }));
    return normaliseSmithsonian(res.response);
  },
};
