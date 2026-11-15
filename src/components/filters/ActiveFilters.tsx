'use client';

import { Button, Group, Pill } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { formatRange } from '@/taxonomy/eras';
import { getRegion } from '@/taxonomy/regions';
import { getStyle } from '@/taxonomy/styles';
import type { SearchQuery } from '@/types/artwork';
import { isEmptyQuery } from '@/lib/query';

interface Props {
  query: SearchQuery;
  onChange: (patch: Partial<SearchQuery>) => void;
  onReset: () => void;
}

/** Removable pills summarising the current filters. */
export function ActiveFilters({ query, onChange, onReset }: Props) {
  if (isEmptyQuery(query) && !query.openAccess) return null;
  return (
    <Group gap={6} aria-label="Active filters">
      {query.regions.map((r) => (
        <Pill key={r} withRemoveButton onRemove={() => onChange({ regions: query.regions.filter((x) => x !== r) })} removeButtonProps={{ 'aria-label': `Remove ${getRegion(r).label}` }}>
          {getRegion(r).label}
        </Pill>
      ))}
      {(query.from !== null || query.to !== null) && (
        <Pill withRemoveButton onRemove={() => onChange({ from: null, to: null })} removeButtonProps={{ 'aria-label': 'Remove date range' }}>
          {formatRange(query.from, query.to)}
        </Pill>
      )}
      {query.styles.map((s) => (
        <Pill key={s} withRemoveButton onRemove={() => onChange({ styles: query.styles.filter((x) => x !== s) })} removeButtonProps={{ 'aria-label': `Remove ${getStyle(s).label}` }}>
          {getStyle(s).label}
        </Pill>
      ))}
      {query.q && (
        <Pill withRemoveButton onRemove={() => onChange({ q: '' })} removeButtonProps={{ 'aria-label': 'Remove keyword' }}>
          “{query.q}”
        </Pill>
      )}
      {query.openAccess && (
        <Pill withRemoveButton onRemove={() => onChange({ openAccess: false })}>
          Public domain
        </Pill>
      )}
      <Button variant="subtle" size="compact-xs" color="gray" onClick={onReset} rightSection={<IconX size={12} aria-hidden />}>
        Clear all
      </Button>
    </Group>
  );
}
