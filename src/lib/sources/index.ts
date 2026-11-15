import type { SourceId, SourceInfo } from '@/types/artwork';
import { aic } from './aic';
import { cma } from './cma';
import { europeana } from './europeana';
import { harvard } from './harvard';
import { met } from './met';
import { smithsonian } from './smithsonian';
import type { SourceAdapter } from './types';
import { vam } from './vam';
import { wikidata } from './wikidata';

/** Order matters: it is the interleaving order of results. */
export const ADAPTERS: SourceAdapter[] = [aic, met, cma, wikidata, vam, harvard, europeana, smithsonian];

const byId = new Map(ADAPTERS.map((a) => [a.meta.id, a]));

export function getAdapter(id: SourceId): SourceAdapter | undefined {
  return byId.get(id);
}

/** Public, key-free description of every source (safe to send to the browser). */
export function listSources(): SourceInfo[] {
  return ADAPTERS.map((a) => ({
    id: a.meta.id,
    name: a.meta.name,
    country: a.meta.country,
    homepage: a.meta.homepage,
    needsKey: a.meta.needsKey,
    enabled: a.enabled(),
  }));
}
