'use client';

import { Accordion, Badge, Group, Text } from '@mantine/core';
import { IconBrush, IconClock, IconSettings, IconWorld } from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { formatRange } from '@/taxonomy/eras';
import type { SearchQuery, SourceStatus } from '@/types/artwork';
import { EraFilter } from './EraFilter';
import { MoreFilters } from './MoreFilters';
import { RegionFilter } from './RegionFilter';
import { StyleFilter } from './StyleFilter';

interface Props {
  query: SearchQuery;
  onChange: (patch: Partial<SearchQuery>) => void;
  statuses: SourceStatus[];
}

function Heading({ icon, label, summary }: { icon: ReactNode; label: string; summary?: string | null }) {
  return (
    <Group gap="xs" wrap="nowrap">
      {icon}
      <Text fw={600} size="sm">
        {label}
      </Text>
      {summary && (
        <Badge size="xs" variant="light" style={{ textTransform: 'none' }}>
          {summary}
        </Badge>
      )}
    </Group>
  );
}

export function FilterPanel({ query, onChange, statuses }: Props) {
  const timeSummary = query.from !== null || query.to !== null ? formatRange(query.from, query.to) : null;
  return (
    <Accordion multiple defaultValue={['region', 'era', 'style']} variant="default" chevronPosition="right">
      <Accordion.Item value="region">
        <Accordion.Control>
          <Heading icon={<IconWorld size={16} />} label="Region" summary={query.regions.length ? String(query.regions.length) : null} />
        </Accordion.Control>
        <Accordion.Panel>
          <RegionFilter value={query.regions} onChange={(regions) => onChange({ regions })} />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="era">
        <Accordion.Control>
          <Heading icon={<IconClock size={16} />} label="Era" summary={timeSummary} />
        </Accordion.Control>
        <Accordion.Panel>
          <EraFilter from={query.from} to={query.to} onChange={(from, to) => onChange({ from, to })} />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="style">
        <Accordion.Control>
          <Heading icon={<IconBrush size={16} />} label="Style & movement" summary={query.styles.length ? String(query.styles.length) : null} />
        </Accordion.Control>
        <Accordion.Panel>
          <StyleFilter
            value={query.styles}
            onChange={(styles) => onChange({ styles })}
            regions={query.regions}
            from={query.from}
            to={query.to}
          />
        </Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="more">
        <Accordion.Control>
          <Heading icon={<IconSettings size={16} />} label="Sources & sorting" />
        </Accordion.Control>
        <Accordion.Panel>
          <MoreFilters query={query} onChange={onChange} statuses={statuses} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
