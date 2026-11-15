import type { Artwork } from '@/types/artwork';
import { getRegion, inferRegion } from '@/taxonomy/regions';
import { getStyle, inferStyles } from '@/taxonomy/styles';
import { buildUrl, fetchJson, parseYear, stripHtml } from '../http';
import { fanOut, pairs, type SourceAdapter } from './types';

/**
 * Victoria and Albert Museum (London) — https://developers.vam.ac.uk/
 * Keyless. Images are IIIF and free for non-commercial use, but not public
 * domain, so this source is skipped when "Public domain only" is on.
 */

const API = 'https://api.vam.ac.uk/v2';

export interface VamRecord {
  systemNumber: string;
  objectType?: string;
  _primaryTitle?: string;
  _primaryMaker?: { name?: string; association?: string };
  _primaryDate?: string;
  _primaryPlace?: string;
  _images?: { _iiif_image_base_url?: string; _primary_thumbnail?: string };
}

interface VamSearch {
  info: { record_count: number; pages: number; page: number };
  records: VamRecord[];
}

interface VamObject {
  meta: { images?: { _iiif_image?: string } };
  record: {
    systemNumber: string;
    objectType?: string;
    titles?: Array<{ title: string }>;
    briefDescription?: string;
    summaryDescription?: string;
    physicalDescription?: string;
    artistMakerPerson?: Array<{ name?: { text?: string } }>;
    placesOfOrigin?: Array<{ place?: { text?: string } }>;
    productionDates?: Array<{ date?: { text?: string; earliest?: string; latest?: string } }>;
    styles?: Array<{ text?: string }>;
    materialsAndTechniques?: string;
    creditLine?: string;
  };
}

function iiif(base: string | undefined, size: number): string | null {
  return base ? `${base}full/!${size},${size}/0/default.jpg` : null;
}

export function normaliseVam(r: VamRecord): Artwork | null {
  const thumb = iiif(r._images?._iiif_image_base_url, 600);
  if (!thumb) return null;
  const maker = r._primaryMaker?.name && r._primaryMaker.name !== 'Unknown' ? r._primaryMaker.name : null;
  const year = parseYear(r._primaryDate);
  const yearEnd = r._primaryDate?.match(/\d{3,4}\s*-\s*(\d{3,4})/)?.[1];
  return {
    key: `vam:${r.systemNumber}`,
    source: 'vam',
    sourceId: r.systemNumber,
    title: r._primaryTitle || r.objectType || 'Untitled',
    artist: maker,
    dateText: r._primaryDate || null,
    yearStart: year,
    yearEnd: yearEnd ? Number(yearEnd) : year,
    place: r._primaryPlace || null,
    region: inferRegion(r._primaryPlace),
    styles: inferStyles(r._primaryTitle, r.objectType),
    medium: r.objectType || null,
    thumbUrl: thumb,
    imageUrl: iiif(r._images?._iiif_image_base_url, 1200)!,
    sourceUrl: `https://collections.vam.ac.uk/item/${r.systemNumber}/`,
    credit: '© Victoria and Albert Museum, London',
    isPublicDomain: false,
  };
}

export const vam: SourceAdapter = {
  meta: {
    id: 'vam',
    name: 'Victoria and Albert Museum',
    country: 'United Kingdom',
    homepage: 'https://developers.vam.ac.uk/',
    needsKey: false,
    strengths: 'Decorative arts, South Asian (incl. Mughal) painting, East Asian and European art.',
  },
  enabled: () => true,
  unsupported: (q) => (q.openAccess ? 'V&A images are not public domain' : null),
  async search(q, cursor, limit) {
    const places = q.regions.flatMap((r) => getRegion(r).vam.slice(0, q.regions.length > 1 ? 1 : 2));
    const keywords = q.styles.map((s) => getStyle(s).keywords[0]!);
    const subqueries = pairs(places, keywords, 3);
    return fanOut(subqueries, cursor, limit, async ([place, kw], offset, per) => {
      const page = Math.floor(offset / per) + 1;
      const url = buildUrl(`${API}/objects/search`, {
        q: [kw, q.q].filter(Boolean).join(' ') || undefined,
        q_place_name: place,
        year_made_from: q.from ?? undefined,
        year_made_to: q.to ?? undefined,
        images_exist: 1,
        page,
        page_size: per,
      });
      const res = await fetchJson<VamSearch>(url);
      const items = res.records.map(normaliseVam).filter((a): a is Artwork => a !== null);
      return { items, hasMore: page < res.info.pages, total: res.info.record_count };
    });
  },
  async get(id) {
    const res = await fetchJson<VamObject>(`${API}/museumobject/${encodeURIComponent(id)}`);
    const r = res.record;
    const date = r.productionDates?.[0]?.date;
    const place = r.placesOfOrigin?.[0]?.place?.text ?? null;
    const base = res.meta.images?._iiif_image;
    const summary: VamRecord = {
      systemNumber: r.systemNumber,
      objectType: r.objectType,
      _primaryTitle: r.titles?.[0]?.title,
      _primaryMaker: { name: r.artistMakerPerson?.[0]?.name?.text },
      _primaryDate: date?.text,
      _primaryPlace: place ?? undefined,
      _images: { _iiif_image_base_url: base },
    };
    const art = normaliseVam(summary);
    if (!art) return null;
    return {
      ...art,
      title: art.title === r.objectType && r.briefDescription ? r.briefDescription : art.title,
      yearStart: date?.earliest ? Number(date.earliest.slice(0, 4)) : art.yearStart,
      yearEnd: date?.latest ? Number(date.latest.slice(0, 4)) : art.yearEnd,
      styles: [...new Set([...art.styles, ...inferStyles(r.styles?.map((s) => s.text).join(' '), r.briefDescription)])],
      medium: r.materialsAndTechniques || art.medium,
      credit: r.creditLine ? `© Victoria and Albert Museum, London — ${r.creditLine}` : art.credit,
      description: stripHtml(r.summaryDescription || r.physicalDescription || r.briefDescription),
    };
  },
};
