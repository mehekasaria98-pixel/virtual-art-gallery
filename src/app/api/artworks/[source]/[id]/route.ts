import { NextResponse, type NextRequest } from 'next/server';
import { getAdapter } from '@/lib/sources';
import { SOURCE_IDS } from '@/lib/query';
import type { SourceId } from '@/types/artwork';

export const maxDuration = 20;

/** GET /api/artworks/:source/:id — one artwork, normalised. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ source: string; id: string }> }) {
  const { source, id } = await ctx.params;
  if (!SOURCE_IDS.includes(source as SourceId)) {
    return NextResponse.json({ error: 'Unknown source' }, { status: 404 });
  }
  const adapter = getAdapter(source as SourceId)!;
  if (!adapter.enabled()) return NextResponse.json({ error: 'Source not enabled' }, { status: 404 });
  try {
    const artwork = await adapter.get(decodeURIComponent(id));
    if (!artwork) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(artwork, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || 'Upstream error' }, { status: 502 });
  }
}
