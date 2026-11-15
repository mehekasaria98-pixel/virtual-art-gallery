'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { Artwork } from '@/types/artwork';

/**
 * Favourites are stored only in this browser (localStorage). No account,
 * no server, nothing leaves the device. Export/import moves them between
 * browsers as a JSON file.
 */

const KEY = 'atlas-of-art:favourites:v1';
const EMPTY: Artwork[] = [];
const listeners = new Set<() => void>();
let cache: Artwork[] | null = null;

function read(): Artwork[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed) ? (parsed.filter(isArtworkLike) as Artwork[]) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: Artwork[]) {
  cache = list;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Private mode / storage full: keep the in-memory copy for this session.
  }
  listeners.forEach((l) => l());
}

function isArtworkLike(x: unknown): boolean {
  return !!x && typeof x === 'object' && typeof (x as Artwork).key === 'string' && typeof (x as Artwork).thumbUrl === 'string';
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

export function useFavourites() {
  const favourites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const isFavourite = useCallback((key: string) => favourites.some((f) => f.key === key), [favourites]);

  const toggle = useCallback((art: Artwork) => {
    const list = read();
    write(list.some((f) => f.key === art.key) ? list.filter((f) => f.key !== art.key) : [art, ...list]);
  }, []);

  const remove = useCallback((key: string) => write(read().filter((f) => f.key !== key)), []);

  const clear = useCallback(() => write([]), []);

  const importJson = useCallback((json: string): number => {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed)) throw new Error('File does not contain a list of artworks');
    const incoming = parsed.filter(isArtworkLike) as Artwork[];
    const existing = read();
    const keys = new Set(existing.map((f) => f.key));
    const added = incoming.filter((a) => !keys.has(a.key));
    write([...added, ...existing]);
    return added.length;
  }, []);

  const exportJson = useCallback(() => JSON.stringify(read(), null, 2), []);

  return { favourites, isFavourite, toggle, remove, clear, importJson, exportJson };
}
