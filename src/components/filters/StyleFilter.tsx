'use client';

import { Box, Chip, Group, Stack, Switch, Text, TextInput, Tooltip } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { rankStyles } from '@/taxonomy/compat';
import type { RegionId } from '@/taxonomy/regions';
import { STYLE_FAMILIES, type StyleId } from '@/taxonomy/styles';

interface Props {
  value: StyleId[];
  onChange: (v: StyleId[]) => void;
  regions: RegionId[];
  from: number | null;
  to: number | null;
}

/**
 * Styles grouped by family. Styles that don't fit the chosen era/region are
 * greyed (with a tooltip saying why) rather than hidden, and can be hidden
 * entirely with "Only matching".
 */
export function StyleFilter({ value, onChange, regions, from, to }: Props) {
  const [search, setSearch] = useState('');
  const [onlyMatching, setOnlyMatching] = useState(false);
  const ranked = useMemo(() => rankStyles(regions, from, to), [regions, from, to]);
  const filtersActive = regions.length > 0 || from !== null || to !== null;

  const toggle = (id: StyleId) => onChange(value.includes(id) ? value.filter((s) => s !== id) : [...value, id]);
  const needle = search.trim().toLowerCase();

  return (
    <Stack gap="sm">
      <TextInput
        placeholder="Find a style…"
        leftSection={<IconSearch size={14} />}
        size="xs"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        aria-label="Filter styles"
      />
      {filtersActive && (
        <Switch
          size="xs"
          label="Only styles matching my era and region"
          checked={onlyMatching}
          onChange={(e) => setOnlyMatching(e.currentTarget.checked)}
        />
      )}
      {STYLE_FAMILIES.map((family) => {
        const members = ranked.filter(
          (c) =>
            c.style.family === family.id &&
            (!needle || c.style.label.toLowerCase().includes(needle) || c.style.blurb.toLowerCase().includes(needle)) &&
            (!onlyMatching || c.compatible || value.includes(c.style.id as StyleId)),
        );
        if (members.length === 0) return null;
        return (
          <Box key={family.id}>
            <Text size="xs" tt="uppercase" fw={600} className="muted" mb={6}>
              {family.label}
            </Text>
            <Group gap={6}>
              {members.map(({ style, compatible, reason }) => {
                const id = style.id as StyleId;
                const checked = value.includes(id);
                return (
                  <Tooltip key={id} label={compatible ? style.blurb : `${reason}. ${style.blurb}`}>
                    <Chip
                      checked={checked}
                      onChange={() => toggle(id)}
                      styles={!compatible && !checked ? { label: { opacity: 0.45 } } : undefined}
                    >
                      {style.label}
                    </Chip>
                  </Tooltip>
                );
              })}
            </Group>
          </Box>
        );
      })}
    </Stack>
  );
}
