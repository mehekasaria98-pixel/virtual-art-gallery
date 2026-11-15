import { describe, expect, it } from 'vitest';
import aicSearch from './fixtures/aic-search.json';
import metObject from './fixtures/met-object.json';
import cmaSearch from './fixtures/cma-search.json';
import vamSearch from './fixtures/vam-search.json';
import wdSearch from './fixtures/wikidata-search.json';
import { buildAicQuery, normaliseAic, type AicArtwork } from '@/lib/sources/aic';
import { normaliseMet, type MetObject } from '@/lib/sources/met';
import { normaliseCma, type CmaArtwork } from '@/lib/sources/cma';
import { normaliseVam, type VamRecord } from '@/lib/sources/vam';
import { buildSparql, normaliseWikidata } from '@/lib/sources/wikidata';
import { fanOut, pairs } from '@/lib/sources/types';
import { EMPTY_QUERY } from '@/lib/query';
import type { Artwork } from '@/types/artwork';

function expectValid(a: Artwork | null): asserts a is Artwork {
  expect(a).not.toBeNull();
  expect(a!.key).toBe(`${a!.source}:${a!.sourceId}`);
  expect(a!.title.length).toBeGreaterThan(0);
  expect(a!.thumbUrl).toMatch(/^https:\/\//);
  expect(a!.imageUrl).toMatch(/^https:\/\//);
  expect(a!.sourceUrl).toMatch(/^https:\/\//);
}

describe('Art Institute of Chicago', () => {
  it('normalises search results and maps style ids', () => {
    const items = (aicSearch.data as AicArtwork[]).map(normaliseAic);
    items.forEach(expectValid);
    expect(items.some((a) => a!.styles.includes('impressionism') || a!.styles.includes('post-impressionism'))).toBe(true);
  });

  it('builds an Elasticsearch query from filters', () => {
    const body = buildAicQuery({
      ...EMPTY_QUERY,
      regions: ['east-asia'],
      styles: ['ukiyo-e'],
      from: 1700,
      to: 1800,
      openAccess: true,
    });
    const json = JSON.stringify(body);
    expect(json).toContain('"place_of_origin.keyword":["China","Japan","Korea"]');
    expect(json).toContain('TM-5310');
    expect(json).toContain('"is_public_domain":true');
  });
});

describe('The Met', () => {
  it('normalises an object', () => {
    const a = normaliseMet(metObject as MetObject);
    expectValid(a);
    expect(a.region).toBe('east-asia');
    expect(a.artist).toBe('Yosa Buson');
    expect(a.yearStart).toBe(1770);
  });
});

describe('Cleveland Museum of Art', () => {
  it('normalises CC0 works with region inference', () => {
    const items = (cmaSearch.data as CmaArtwork[]).map(normaliseCma);
    items.forEach(expectValid);
    expect(items[0]!.region).toBe('africa');
    expect(items[0]!.isPublicDomain).toBe(true);
  });
});

describe('V&A', () => {
  it('normalises IIIF records', () => {
    const items = (vamSearch.records as VamRecord[]).map(normaliseVam);
    items.forEach(expectValid);
    expect(items[0]!.region).toBe('south-asia');
    expect(items[0]!.isPublicDomain).toBe(false);
  });
});

describe('Wikidata', () => {
  it('normalises SPARQL bindings', () => {
    const b = wdSearch.results.bindings[0] as Record<string, { value: string }>;
    // The recorded fixture uses ungrouped variable names; map them to the grouped ones.
    const a = normaliseWikidata({ ...b, label: b.itemLabel, creator: b.creatorLabel, movements: { value: 'Q37068' } });
    expectValid(a);
    expect(a.styles).toContain('romanticism');
    expect(a.thumbUrl).toContain('?width=500');
  });

  it('builds SPARQL with movement, country and date filters', () => {
    const s = buildSparql(
      { ...EMPTY_QUERY, styles: ['romanticism'], regions: ['europe'], from: 1800, to: 1850, sort: 'oldest' },
      10,
      20,
    );
    expect(s).toContain('wd:Q37068');
    expect(s).toContain('wd:Q142');
    expect(s).toContain('YEAR(?d0) >= 1800 && YEAR(?d0) <= 1850');
    expect(s).toContain('ORDER BY ?d0 LIMIT 10 OFFSET 20');
  });
});

describe('fan-out helper', () => {
  const mk = (id: string): Artwork => ({
    key: `aic:${id}`, source: 'aic', sourceId: id, title: id, artist: null, dateText: null, yearStart: null,
    yearEnd: null, place: null, region: null, styles: [], medium: null, thumbUrl: 'https://x', imageUrl: 'https://x',
    sourceUrl: 'https://x', credit: '', isPublicDomain: true,
  });

  it('spreads pairs diagonally', () => {
    expect(pairs(['a', 'b'], [1, 2], 3)).toEqual([['a', 1], ['a', 2], ['b', 1]]);
    expect(pairs([], [], 3)).toEqual([[undefined, undefined]]);
  });

  it('tracks offsets per sub-query and stops exhausted ones', async () => {
    const page1 = await fanOut(['x', 'y'], null, 4, async (k, offset, per) => ({
      items: [mk(`${k}${offset}`), mk(`${k}${offset + 1}`)].slice(0, per),
      hasMore: k === 'x',
    }));
    expect(page1.items.map((a) => a.title)).toEqual(['x0', 'y0', 'x1', 'y1']);
    expect(JSON.parse(page1.next!)).toEqual([2, -1]);
  });
});
