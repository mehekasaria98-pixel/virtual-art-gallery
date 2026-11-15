'use client';

import { Box, Stack, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import { centuryLabel, centuryOf } from '@/taxonomy/eras';
import type { Artwork } from '@/types/artwork';
import { ArtworkCard } from './ArtworkCard';

interface Group {
  key: number;
  label: string;
  items: Artwork[];
}

/**
 * Results grouped on a vertical time axis. When the selected range is a
 * century or less, groups are decades; otherwise centuries.
 */
export function TimelineView({ items, from, to }: { items: Artwork[]; from: number | null; to: number | null }) {
  const byDecade = from !== null && to !== null && to - from <= 100;
  const { groups, undated } = useMemo(() => {
    const map = new Map<number, Group>();
    const undated: Artwork[] = [];
    for (const a of items) {
      if (a.yearStart === null) {
        undated.push(a);
        continue;
      }
      const key = byDecade ? Math.floor(a.yearStart / 10) * 10 : centuryOf(a.yearStart);
      const label = byDecade ? `${key}s` : centuryLabel(key);
      if (!map.has(key)) map.set(key, { key, label, items: [] });
      map.get(key)!.items.push(a);
    }
    return { groups: [...map.values()].sort((a, b) => a.key - b.key), undated };
  }, [items, byDecade]);

  return (
    <Stack gap="xl" pos="relative">
      <Box
        aria-hidden
        pos="absolute"
        top={8}
        bottom={0}
        left={5}
        w={2}
        style={{ background: 'var(--gallery-border)' }}
      />
      {groups.map((g) => (
        <Box key={g.key} pl="xl" pos="relative" component="section" aria-label={g.label}>
          <Box
            aria-hidden
            pos="absolute"
            left={0}
            top={8}
            w={12}
            h={12}
            style={{ borderRadius: '50%', background: 'var(--mantine-color-oxblood-filled)' }}
          />
          <Title order={3} mb="xs">
            {g.label}{' '}
            <Text span size="sm" className="muted" ff="var(--font-sans)">
              {g.items.length} {g.items.length === 1 ? 'work' : 'works'}
            </Text>
          </Title>
          <div className="scroll-row">
            {g.items.map((a) => (
              <ArtworkCard key={a.key} artwork={a} width={200} />
            ))}
          </div>
        </Box>
      ))}
      {undated.length > 0 && (
        <Box pl="xl" component="section" aria-label="Undated">
          <Title order={3} mb="xs">
            Date unknown
          </Title>
          <div className="scroll-row">
            {undated.map((a) => (
              <ArtworkCard key={a.key} artwork={a} width={200} />
            ))}
          </div>
        </Box>
      )}
    </Stack>
  );
}
