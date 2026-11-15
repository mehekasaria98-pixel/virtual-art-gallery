import type { Artwork, SearchQuery } from '@/types/artwork';
import { getRegion, inferRegion, REGIONS, type RegionId } from '@/taxonomy/regions';
import { getStyle, styleFromWikidata, type StyleId } from '@/taxonomy/styles';
import { fetchJson } from '../http';
import type { SourceAdapter } from './types';

/**
 * Wikidata Query Service — https://query.wikidata.org/
 * Keyless SPARQL over a global, crowd-sourced catalogue of artworks whose
 * images live on Wikimedia Commons. It is the best source for art movements
 * (property P135) and for modern artists from Africa, Latin America and Asia.
 * Keyword search is not supported here (label search is too slow over SPARQL).
 */

const ENDPOINT = 'https://query.wikidata.org/sparql';
const PUBLIC_DOMAIN = 'Q19652';
/** painting, sculpture, print, woodblock print, drawing */
const TYPES = ['Q3305213', 'Q860861', 'Q11060274', 'Q18218093', 'Q93184'];

const countryToRegion = new Map<string, RegionId>();
for (const r of REGIONS) for (const c of r.wikidataCountries) countryToRegion.set(c, r.id);

interface Binding {
  [key: string]: { value: string } | undefined;
}

interface SparqlResponse {
  results: { bindings: Binding[] };
}

export function buildSparql(q: SearchQuery, limit: number, offset: number, only?: string): string {
  // Blazegraph's optimiser sometimes starts from "all paintings" and times out.
  // We disable it and write the patterns most-selective-first instead.
  const where: string[] = ['hint:Query hint:optimizer "None" .'];
  if (only) where.push(`VALUES ?item { wd:${only} }`);
  const movements = q.styles.flatMap((s) => getStyle(s).wikidata ?? []);
  if (movements.length) where.push(`VALUES ?mv0 { ${movements.map((m) => `wd:${m}`).join(' ')} } ?item wdt:P135 ?mv0 .`);
  const countries = q.regions.flatMap((r) => getRegion(r).wikidataCountries);
  if (countries.length) where.push(`VALUES ?c0 { ${countries.map((c) => `wd:${c}`).join(' ')} } ?item wdt:P495 ?c0 .`);
  where.push(`VALUES ?type { ${TYPES.map((t) => `wd:${t}`).join(' ')} }`);
  where.push('?item wdt:P31 ?type ; wdt:P18 [] .');
  const needsDate = q.from !== null || q.to !== null || q.sort !== 'relevance';
  if (needsDate) {
    where.push('?item wdt:P571 ?d0 .');
    const conds: string[] = [];
    if (q.from !== null) conds.push(`YEAR(?d0) >= ${q.from}`);
    if (q.to !== null) conds.push(`YEAR(?d0) <= ${q.to}`);
    if (conds.length) where.push(`FILTER(${conds.join(' && ')})`);
  }
  if (q.openAccess) where.push(`?item wdt:P6216 wd:${PUBLIC_DOMAIN} .`);
  const order = q.sort === 'oldest' ? 'ORDER BY ?d0' : q.sort === 'newest' ? 'ORDER BY DESC(?d0)' : '';
  return `SELECT ?item (SAMPLE(?l) AS ?label) (SAMPLE(?img) AS ?image) (MIN(?inc) AS ?inception)
  (SAMPLE(?cl) AS ?creator) (SAMPLE(?col) AS ?country) (SAMPLE(?cq) AS ?countryId)
  (SAMPLE(?ml) AS ?material) (SAMPLE(?coll) AS ?collection)
  (GROUP_CONCAT(DISTINCT STRAFTER(STR(?mv), "entity/"); separator=" ") AS ?movements)
  (SAMPLE(?pdv) AS ?pd)
WHERE {
  { SELECT DISTINCT ?item ${needsDate ? '?d0 ' : ''}WHERE {
      ${where.join('\n      ')}
    } ${order} LIMIT ${limit} OFFSET ${offset} }
  ?item wdt:P18 ?img .
  OPTIONAL { ?item rdfs:label ?l FILTER(LANG(?l) = "en") }
  OPTIONAL { ?item wdt:P571 ?inc }
  OPTIONAL { ?item wdt:P170 ?cr . ?cr rdfs:label ?cl FILTER(LANG(?cl) = "en") }
  OPTIONAL { ?item wdt:P495 ?cq . ?cq rdfs:label ?col FILTER(LANG(?col) = "en") }
  OPTIONAL { ?item wdt:P186 ?m . ?m rdfs:label ?ml FILTER(LANG(?ml) = "en") }
  OPTIONAL { ?item wdt:P195 ?cn . ?cn rdfs:label ?coll FILTER(LANG(?coll) = "en") }
  OPTIONAL { ?item wdt:P135 ?mv }
  OPTIONAL { ?item wdt:P6216 ?pdv }
} GROUP BY ?item ${needsDate ? '?d0' : ''} ${order}`;
}

function qid(uri: string | undefined): string | null {
  return uri ? (uri.split('/').pop() ?? null) : null;
}

function commons(url: string, width: number): string {
  return `${url.replace(/^http:/, 'https:')}?width=${width}`;
}

export function normaliseWikidata(b: Binding): Artwork | null {
  const id = qid(b.item?.value);
  const image = b.image?.value;
  if (!id || !image) return null;
  const inception = b.inception?.value;
  // xsd:dateTime; BCE dates start with "-"
  const year = inception ? Number(inception.match(/^(-?\d+)/)?.[1]) : null;
  const countryId = qid(b.countryId?.value);
  const styles = new Set<StyleId>();
  for (const m of (b.movements?.value ?? '').split(' ').filter(Boolean)) {
    const s = styleFromWikidata(m);
    if (s) styles.add(s);
  }
  const label = b.label?.value;
  return {
    key: `wikidata:${id}`,
    source: 'wikidata',
    sourceId: id,
    title: label && !/^Q\d+$/.test(label) ? label : 'Untitled',
    artist: b.creator?.value ?? null,
    dateText: year !== null && Number.isFinite(year) ? (year < 0 ? `${-year} BCE` : String(year)) : null,
    yearStart: Number.isFinite(year) ? year : null,
    yearEnd: Number.isFinite(year) ? year : null,
    place: b.country?.value ?? null,
    region: (countryId && countryToRegion.get(countryId)) || inferRegion(b.country?.value),
    styles: [...styles],
    medium: b.material?.value ?? null,
    thumbUrl: commons(image, 500),
    imageUrl: commons(image, 1400),
    sourceUrl: `https://www.wikidata.org/wiki/${id}`,
    credit: b.collection?.value ? `${b.collection.value} — image via Wikimedia Commons` : 'Image via Wikimedia Commons',
    isPublicDomain: qid(b.pd?.value) === PUBLIC_DOMAIN,
  };
}

async function runSparql(query: string): Promise<Binding[]> {
  const url = `${ENDPOINT}?query=${encodeURIComponent(query)}`;
  const res = await fetchJson<SparqlResponse>(url, {
    headers: { Accept: 'application/sparql-results+json' },
    timeoutMs: 6500,
    retries: 0,
    revalidate: 60 * 60 * 24,
  });
  return res.results.bindings;
}

export const wikidata: SourceAdapter = {
  meta: {
    id: 'wikidata',
    name: 'Wikidata & Wikimedia Commons',
    country: 'Global (Wikimedia Foundation)',
    homepage: 'https://www.wikidata.org/wiki/Wikidata:WikiProject_sum_of_all_paintings',
    needsKey: false,
    strengths: 'Art movements worldwide, including modern African, Latin American and Asian artists.',
  },
  enabled: () => true,
  unsupported: (q) => {
    if (q.q) return 'Keyword search is not available for Wikidata';
    if (q.sort !== 'relevance' && !q.styles.length && !q.regions.length) return 'Sorting Wikidata needs a style or region filter';
    return null;
  },
  async search(q, cursor, limit) {
    const offset = cursor ? Number(cursor) : 0;
    const bindings = await runSparql(buildSparql(q, limit, offset));
    const items = bindings.map(normaliseWikidata).filter((a): a is Artwork => a !== null);
    return { items, next: bindings.length >= limit ? String(offset + limit) : null, total: null };
  },
  async get(id) {
    if (!/^Q\d+$/.test(id)) return null;
    const q: SearchQuery = { regions: [], styles: [], from: null, to: null, q: '', sources: [], openAccess: false, sort: 'relevance' };
    const bindings = await runSparql(buildSparql(q, 1, 0, id));
    return bindings[0] ? normaliseWikidata(bindings[0]) : null;
  },
};
