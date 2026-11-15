'use client';

import { Box, Paper, Stack, Text, Title } from '@mantine/core';
import { useMemo, useState } from 'react';
import { RegionMap } from '@/components/filters/RegionMap';
import { getRegion, REGIONS, type RegionId } from '@/taxonomy/regions';
import type { Artwork } from '@/types/artwork';
import { ArtworkCard } from './ArtworkCard';

/**
 * Where do the loaded results come from? Click a region to see its works.
 * (Counts reflect the results loaded so far, not the museums' full totals.)
 */
export function MapView({ items }: { items: Artwork[] }) {
  const counts = useMemo(() => {
    const c: Partial<Record<RegionId, number>> = {};
    for (const r of REGIONS) c[r.id] = 0;
    for (const a of items) if (a.region) c[a.region] = (c[a.region] ?? 0) + 1;
    return c;
  }, [items]);
  const busiest = (Object.entries(counts) as Array<[RegionId, number]>).sort((a, b) => b[1] - a[1])[0];
  const [picked, setPicked] = useState<RegionId | null>(null);
  const active = picked ?? (busiest && busiest[1] > 0 ? busiest[0] : null);
  const inRegion = active ? items.filter((a) => a.region === active) : [];
  const unknown = items.filter((a) => !a.region).length;

  return (
    <Stack gap="lg">
      <Paper withBorder p="sm" radius="md" style={{ background: 'var(--gallery-surface)' }}>
        <RegionMap
          selected={active ? [active] : []}
          counts={counts}
          onToggle={(id) => setPicked(id)}
          ariaLabel="Results by region. Choose a region to list its works."
        />
        <Text size="xs" className="muted" ta="center">
          Counts are for the {items.length} works loaded so far{unknown ? `; ${unknown} have no recorded place` : ''}.
        </Text>
      </Paper>
      {active && (
        <Box component="section" aria-live="polite">
          <Title order={3} mb="xs">
            {getRegion(active).label}
          </Title>
          {inRegion.length ? (
            <div className="scroll-row">
              {inRegion.map((a) => (
                <ArtworkCard key={a.key} artwork={a} width={200} />
              ))}
            </div>
          ) : (
            <Text className="muted">No loaded works from this region yet. Try adding it to the Region filter.</Text>
          )}
        </Box>
      )}
    </Stack>
  );
}
