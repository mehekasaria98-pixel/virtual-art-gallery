'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { parseQuery, parseView, toSearchParams, type ViewMode } from '@/lib/query';
import type { SearchQuery } from '@/types/artwork';

/**
 * Explore filters live in the URL, so every view is a shareable link and the
 * browser back button undoes filter changes.
 */
export function useExploreState() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = useMemo(() => parseQuery(params), [params]);
  const view = useMemo(() => parseView(params), [params]);

  const push = useCallback(
    (q: SearchQuery, v: ViewMode) => {
      const sp = toSearchParams(q, { view: v === 'grid' ? null : v });
      const s = sp.toString();
      router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setQuery = useCallback((patch: Partial<SearchQuery>) => push({ ...query, ...patch }, view), [push, query, view]);
  const setView = useCallback((v: ViewMode) => push(query, v), [push, query]);
  const reset = useCallback(() => push({ ...parseQuery(new URLSearchParams()) }, view), [push, view]);

  return { query, view, setQuery, setView, reset };
}
