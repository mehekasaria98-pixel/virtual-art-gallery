import type { Artwork, SearchQuery, SearchResponse, SourceId, SourceStatus } from '@/types/artwork';
import { TimeoutError } from './http';
import { ADAPTERS } from './sources';
import { interleave } from './sources/types';

/** Results requested from each source per page. */
export const PER_SOURCE = 8;
/** Hard ceiling per source so one slow museum never stalls the page. */
const SOURCE_BUDGET_MS = 7000;
/** After this, respond with whatever sources have answered. */
const SOFT_DEADLINE_MS = 3500;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Cursor = per-source state. Missing key → start; null → exhausted. */
type CursorState = Partial<Record<SourceId, string | null>>;

export function encodeCursor(state: CursorState): string {
  return Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
}

export function decodeCursor(token: string | null | undefined): CursorState | null {
  if (!token) return null;
  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as CursorState) : null;
  } catch {
    return null;
  }
}

function withBudget<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(`https://${label}`, ms)), ms);
  });
  return Promise.race([p, timeout]).finally(() => clearTimeout(timer));
}

/** Normalised identity used to drop the same work appearing via two sources. */
export function dedupeKey(a: Artwork): string {
  const norm = (s: string | null) =>
    (s ?? '')
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  return `${norm(a.title)}|${norm(a.artist)}|${a.yearStart ?? ''}`;
}

export function dedupe(items: Artwork[], seen = new Set<string>()): Artwork[] {
  const out: Artwork[] = [];
  for (const a of items) {
    const k = dedupeKey(a);
    if (a.title !== 'Untitled' && seen.has(k)) continue;
    seen.add(k);
    out.push(a);
  }
  return out;
}

export function sortItems(items: Artwork[], sort: SearchQuery['sort']): Artwork[] {
  if (sort === 'relevance') return items;
  const dir = sort === 'oldest' ? 1 : -1;
  return [...items].sort((a, b) => {
    if (a.yearStart === null) return 1;
    if (b.yearStart === null) return -1;
    return (a.yearStart - b.yearStart) * dir;
  });
}

export async function searchAll(q: SearchQuery, cursorToken: string | null): Promise<SearchResponse> {
  const prev = decodeCursor(cursorToken);
  const selected = ADAPTERS.filter((a) => q.sources.length === 0 || q.sources.includes(a.meta.id));
  const nextState: CursorState = {};
  const statuses: SourceStatus[] = [];

  const runs = selected.map(async (adapter) => {
    const id = adapter.meta.id;
    if (!adapter.enabled()) {
      statuses.push({ id, state: 'disabled', count: 0, message: `Add ${adapter.meta.envKey} to enable` });
      nextState[id] = null;
      return [] as Artwork[];
    }
    const reason = adapter.unsupported?.(q) ?? null;
    if (reason) {
      statuses.push({ id, state: 'skipped', count: 0, message: reason });
      nextState[id] = null;
      return [];
    }
    if (prev && prev[id] === null) {
      statuses.push({ id, state: 'exhausted', count: 0 });
      nextState[id] = null;
      return [];
    }
    if (prev && !(id in prev)) {
      // Source was not part of the original search; don't start it mid-scroll.
      nextState[id] = null;
      return [];
    }
    try {
      const page = await withBudget(adapter.search(q, prev?.[id] ?? null, PER_SOURCE), SOURCE_BUDGET_MS, id);
      statuses.push({ id, state: 'ok', count: page.items.length, total: page.total ?? null });
      nextState[id] = page.next;
      return page.items;
    } catch (e) {
      const timedOut = e instanceof TimeoutError;
      statuses.push({
        id,
        state: timedOut ? 'timeout' : 'error',
        count: 0,
        message: timedOut ? 'Took too long to respond' : (e as Error).message?.slice(0, 160) || 'Request failed',
      });
      // A timeout keeps its cursor ('' = first page) so the next scroll retries;
      // a hard error stops that source for this search.
      nextState[id] = timedOut ? (prev?.[id] ?? '') : null;
      return [];
    }
  });

  // Don't let one slow museum hold the page hostage: after a soft deadline,
  // answer with what has arrived. Late sources keep their cursor, so they are
  // fetched on the next scroll — by then Next's data cache usually has them.
  const lists: Artwork[][] = selected.map(() => []);
  const settled = selected.map(() => false);
  const all = Promise.all(
    runs.map((p, i) =>
      p.then((items) => {
        lists[i] = items;
        settled[i] = true;
      }),
    ),
  );
  await Promise.race([all, sleep(SOFT_DEADLINE_MS)]);
  if (!settled.some((s, i) => s && lists[i]!.length > 0)) {
    // Nothing useful yet: wait for the full budget instead of returning an empty page.
    await Promise.race([all, sleep(SOURCE_BUDGET_MS - SOFT_DEADLINE_MS + 200)]);
  }
  selected.forEach((adapter, i) => {
    if (settled[i]) return;
    const id = adapter.meta.id;
    statuses.push({ id, state: 'timeout', count: 0, message: 'Still loading; its works will appear as you scroll' });
    nextState[id] = prev?.[id] ?? '';
  });

  const items = sortItems(dedupe(interleave(lists)), q.sort);
  const hasMore = Object.values(nextState).some((v) => v !== null);
  // Stable order for the UI regardless of which source answered first.
  statuses.sort((a, b) => ADAPTERS.findIndex((x) => x.meta.id === a.id) - ADAPTERS.findIndex((x) => x.meta.id === b.id));
  return { items, cursor: hasMore ? encodeCursor(nextState) : null, sources: statuses };
}
