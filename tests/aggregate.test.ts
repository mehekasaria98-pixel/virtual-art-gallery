import { describe, expect, it } from 'vitest';
import { decodeCursor, dedupe, encodeCursor, sortItems } from '@/lib/aggregate';
import type { Artwork } from '@/types/artwork';

const art = (o: Partial<Artwork>): Artwork => ({
  key: 'aic:1', source: 'aic', sourceId: '1', title: 'T', artist: null, dateText: null, yearStart: null,
  yearEnd: null, place: null, region: null, styles: [], medium: null, thumbUrl: 'https://x', imageUrl: 'https://x',
  sourceUrl: 'https://x', credit: '', isPublicDomain: true, ...o,
});

describe('aggregation helpers', () => {
  it('round-trips cursors and rejects garbage', () => {
    const state = { aic: '2', met: null };
    expect(decodeCursor(encodeCursor(state))).toEqual(state);
    expect(decodeCursor('not-base64-json')).toBeNull();
  });

  it('dedupes the same work from two sources but keeps distinct untitled works', () => {
    const out = dedupe([
      art({ key: 'aic:1', title: 'The Bedroom', artist: 'Vincent van Gogh', yearStart: 1889 }),
      art({ key: 'wikidata:Q1', source: 'wikidata', title: 'the bedroom', artist: 'Vincent van Gogh', yearStart: 1889 }),
      art({ key: 'met:2', source: 'met', title: 'Untitled' }),
      art({ key: 'met:3', source: 'met', title: 'Untitled' }),
    ]);
    expect(out.map((a) => a.key)).toEqual(['aic:1', 'met:2', 'met:3']);
  });

  it('sorts by year with unknown dates last', () => {
    const items = [art({ key: 'a', yearStart: 1900 }), art({ key: 'b', yearStart: null }), art({ key: 'c', yearStart: -200 })];
    expect(sortItems(items, 'oldest').map((a) => a.key)).toEqual(['c', 'a', 'b']);
    expect(sortItems(items, 'newest').map((a) => a.key)).toEqual(['a', 'c', 'b']);
  });
});
