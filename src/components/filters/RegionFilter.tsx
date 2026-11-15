'use client';

import { Box, Chip, Group } from '@mantine/core';
import { REGIONS, type RegionId } from '@/taxonomy/regions';
import { RegionMap } from './RegionMap';

export function RegionFilter({ value, onChange }: { value: RegionId[]; onChange: (v: RegionId[]) => void }) {
  const toggle = (id: RegionId) => onChange(value.includes(id) ? value.filter((r) => r !== id) : [...value, id]);
  return (
    <Box>
      {/* The map is a bonus on larger screens; chips are always available and are the accessible primary control. */}
      <Box visibleFrom="xs" mb="sm">
        <RegionMap selected={value} onToggle={toggle} ariaLabel="Choose regions on the map" />
      </Box>
      <Chip.Group multiple value={value} onChange={(v) => onChange(v as RegionId[])}>
        <Group gap={6}>
          {REGIONS.map((r) => (
            <Chip key={r.id} value={r.id}>
              {r.label}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Box>
  );
}
