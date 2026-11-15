import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { ArtworkDetail } from '@/components/artwork/ArtworkDetail';
import { SOURCE_IDS } from '@/lib/query';
import { getAdapter } from '@/lib/sources';
import type { SourceId } from '@/types/artwork';

export const maxDuration = 20;
// Render on demand and cache for a day (ISR); there are millions of possible works.
export const revalidate = 86400;

type Params = Promise<{ source: string; id: string }>;

const load = cache(async (source: string, id: string) => {
  if (!SOURCE_IDS.includes(source as SourceId)) return null;
  const adapter = getAdapter(source as SourceId);
  if (!adapter?.enabled()) return null;
  try {
    return await adapter.get(decodeURIComponent(id));
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { source, id } = await params;
  const art = await load(source, id);
  if (!art) return { title: 'Artwork not found' };
  const by = art.artist ? ` by ${art.artist}` : '';
  return {
    title: `${art.title}${by}`,
    description: [art.dateText, art.place, art.credit].filter(Boolean).join(' · '),
    openGraph: { images: [{ url: art.thumbUrl }] },
  };
}

export default async function ArtworkPage({ params }: { params: Params }) {
  const { source, id } = await params;
  const art = await load(source, id);
  if (!art) notFound();
  return <ArtworkDetail artwork={art} />;
}
