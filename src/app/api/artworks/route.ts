import { NextResponse, type NextRequest } from 'next/server';
import { searchAll } from '@/lib/aggregate';
import { parseQuery } from '@/lib/query';

// Allow slow museums a little room; the Vercel Hobby plan permits up to 60 s.
export const maxDuration = 30;

/**
 * GET /api/artworks — federated search across every enabled source.
 * See docs/technical/api-reference.md for parameters.
 */
export async function GET(req: NextRequest) {
  const query = parseQuery(req.nextUrl.searchParams);
  const cursor = req.nextUrl.searchParams.get('cursor');
  const result = await searchAll(query, cursor);
  const allFailed = result.items.length === 0 && result.sources.some((s) => s.state === 'error' || s.state === 'timeout');
  return NextResponse.json(result, {
    headers: {
      // Cache at Vercel's edge: identical searches are served instantly for an hour.
      'Cache-Control': allFailed ? 'no-store' : 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
