import { NextResponse } from 'next/server';
import { listSources } from '@/lib/sources';

export const dynamic = 'force-dynamic';

/** GET /api/sources — which museums are available (keys are never exposed). */
export function GET() {
  return NextResponse.json(listSources(), { headers: { 'Cache-Control': 'public, s-maxage=300' } });
}
