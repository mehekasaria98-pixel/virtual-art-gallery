import type { AdapterPage, Artwork, SearchQuery, SourceId } from '@/types/artwork';

export interface SourceMeta {
  id: SourceId;
  name: string;
  /** Where the institution is based. */
  country: string;
  homepage: string;
  needsKey: boolean;
  /** Environment variable holding the key, for keyed sources. */
  envKey?: string;
  /** One-line note on coverage, shown in the UI. */
  strengths: string;
}

export interface SourceAdapter {
  meta: SourceMeta;
  /** False when a required key is missing. */
  enabled(): boolean;
  /**
   * Returns null when this source cannot answer the query at all
   * (e.g. Europeana for a non-European region), with a reason.
   */
  unsupported?(q: SearchQuery): string | null;
  search(q: SearchQuery, cursor: string | null, limit: number): Promise<AdapterPage>;
  get(sourceId: string): Promise<Artwork | null>;
}

export class SkipSource extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'SkipSource';
  }
}

export interface SubPage {
  items: Artwork[];
  hasMore: boolean;
  total?: number | null;
}

/**
 * Many APIs accept only one place / keyword per request. `fanOut` runs a small
 * set of sub-queries in parallel, splits the page size between them,
 * interleaves the results and tracks one offset per sub-query in the cursor.
 */
export async function fanOut<K>(
  keys: K[],
  cursor: string | null,
  limit: number,
  fetchOne: (key: K, offset: number, limit: number) => Promise<SubPage>,
): Promise<AdapterPage> {
  if (keys.length === 0) return { items: [], next: null, total: 0 };
  const offsets: number[] = cursor ? (JSON.parse(cursor) as number[]) : keys.map(() => 0);
  const active = keys.map((k, i) => ({ k, i })).filter(({ i }) => (offsets[i] ?? -1) >= 0);
  if (active.length === 0) return { items: [], next: null };
  const per = Math.max(1, Math.ceil(limit / active.length));

  const settled = await Promise.allSettled(active.map(({ k, i }) => fetchOne(k, offsets[i]!, per)));
  const lists: Artwork[][] = [];
  let total = 0;
  let anyOk = false;
  let firstError: unknown = null;
  settled.forEach((r, j) => {
    const i = active[j]!.i;
    if (r.status === 'fulfilled') {
      anyOk = true;
      lists.push(r.value.items);
      total += r.value.total ?? 0;
      offsets[i] = r.value.hasMore ? offsets[i]! + per : -1;
    } else {
      firstError ??= r.reason;
      offsets[i] = -1;
    }
  });
  if (!anyOk && firstError) throw firstError;
  const items = interleave(lists);
  const next = offsets.some((o) => o >= 0) ? JSON.stringify(offsets) : null;
  return { items, next, total };
}

export function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i]!);
  return out;
}

/** Cartesian pairs of (a, b), taking at most `cap`, spreading across both lists. */
export function pairs<A, B>(as: A[], bs: B[], cap: number): Array<[A, B]> {
  const aList = as.length ? as : [undefined as A];
  const bList = bs.length ? bs : [undefined as B];
  const all: Array<{ p: [A, B]; d: number }> = [];
  aList.forEach((a, i) => bList.forEach((b, j) => all.push({ p: [a, b], d: i + j })));
  // Diagonal order: (0,0), (1,0), (0,1), (2,0), (1,1)… so both lists get variety.
  return all
    .sort((x, y) => x.d - y.d)
    .slice(0, cap)
    .map((x) => x.p);
}
