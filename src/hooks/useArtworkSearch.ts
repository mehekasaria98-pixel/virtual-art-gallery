'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toSearchParams } from '@/lib/query';
import type { Artwork, SearchQuery, SearchResponse, SourceStatus } from '@/types/artwork';

async function fetchPage(params: string, cursor: string | null, signal: AbortSignal): Promise<SearchResponse> {
  const sp = new URLSearchParams(params);
  if (cursor) sp.set('cursor', cursor);
  const res = await fetch(`/api/artworks?${sp.toString()}`, { signal });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return (await res.json()) as SearchResponse;
}

/** Infinite, cached search across all museums for the given filters. */
export function useArtworkSearch(query: SearchQuery, enabled = true) {
  const params = toSearchParams(query).toString();
  const result = useInfiniteQuery({
    queryKey: ['artworks', params],
    queryFn: ({ pageParam, signal }) => fetchPage(params, pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.cursor,
    enabled,
  });

  const items = useMemo<Artwork[]>(() => {
    const seen = new Set<string>();
    const out: Artwork[] = [];
    for (const page of result.data?.pages ?? []) {
      for (const a of page.items) {
        if (seen.has(a.key)) continue;
        seen.add(a.key);
        out.push(a);
      }
    }
    return out;
  }, [result.data]);

  /** Status of each source on the most recent page (falls back to first). */
  const sources = useMemo<SourceStatus[]>(() => {
    const pages = result.data?.pages ?? [];
    const first = pages[0]?.sources ?? [];
    const last = pages[pages.length - 1]?.sources ?? [];
    return first.map((s) => last.find((l) => l.id === s.id && l.state !== 'exhausted') ?? s);
  }, [result.data]);

  const lastPageEmpty = (result.data?.pages.at(-1)?.items.length ?? 1) === 0;

  return { ...result, items, sources, lastPageEmpty };
}
