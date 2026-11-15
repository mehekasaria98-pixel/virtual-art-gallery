'use client';

import { Box, Skeleton, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { journeyHref, journeyQuery, type Journey } from '@/lib/journeys';
import { toSearchParams } from '@/lib/query';
import type { SearchResponse } from '@/types/artwork';

/** A journey tile; its cover is the first result from one fast source, loaded when scrolled into view. */
export function JourneyCard({ journey }: { journey: Journey }) {
  const { ref, entry } = useIntersection({ rootMargin: '200px' });
  const params = toSearchParams({ ...journeyQuery(journey), sources: [journey.coverSource] }).toString();
  const { data, isLoading } = useQuery({
    queryKey: ['cover', params],
    queryFn: async () => (await (await fetch(`/api/artworks?${params}`)).json()) as SearchResponse,
    enabled: !!entry?.isIntersecting,
    staleTime: Infinity,
  });
  const cover = data?.items.find((a) => a.thumbUrl);

  return (
    <Link href={journeyHref(journey)} className="artwork-card" ref={ref as never} style={{ height: '100%' }}>
      <Box pos="relative" h={200} style={{ overflow: 'hidden', background: 'var(--gallery-map-land)' }}>
        {cover ? (
          <img src={cover.thumbUrl} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          isLoading && entry?.isIntersecting && <Skeleton h="100%" radius={0} />
        )}
      </Box>
      <Box p="md">
        <Text fw={500} ff="var(--font-serif), Georgia, serif" fz="lg" lh={1.25}>
          {journey.title}
        </Text>
        <Text size="sm" className="muted">
          {journey.subtitle}
        </Text>
      </Box>
    </Link>
  );
}
