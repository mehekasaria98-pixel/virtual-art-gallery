'use client';

import { Badge, Checkbox, Group, Select, Stack, Switch, Text, Tooltip } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import type { SearchQuery, SortOrder, SourceId, SourceInfo, SourceStatus } from '@/types/artwork';

const STATE_COLOUR: Record<SourceStatus['state'], string> = {
  ok: 'teal',
  exhausted: 'gray',
  skipped: 'yellow',
  disabled: 'gray',
  timeout: 'orange',
  error: 'red',
};

export function useSources() {
  return useQuery({
    queryKey: ['sources'],
    queryFn: async () => (await (await fetch('/api/sources')).json()) as SourceInfo[],
    staleTime: Infinity,
  });
}

interface Props {
  query: SearchQuery;
  onChange: (patch: Partial<SearchQuery>) => void;
  statuses: SourceStatus[];
}

export function MoreFilters({ query, onChange, statuses }: Props) {
  const { data: sources = [] } = useSources();
  const selected: SourceId[] = query.sources.length ? query.sources : sources.filter((s) => s.enabled).map((s) => s.id);

  const toggleSource = (id: SourceId, on: boolean) => {
    const next = on ? [...selected, id] : selected.filter((s) => s !== id);
    const allEnabled = sources.filter((s) => s.enabled).map((s) => s.id);
    // Store "all" as an empty list so links stay short and new sources are included automatically.
    onChange({ sources: next.length === allEnabled.length && allEnabled.every((s) => next.includes(s)) ? [] : next });
  };

  return (
    <Stack gap="md">
      <Select
        label="Sort"
        size="xs"
        value={query.sort}
        onChange={(v) => onChange({ sort: (v as SortOrder) ?? 'relevance' })}
        data={[
          { value: 'relevance', label: 'Most relevant' },
          { value: 'oldest', label: 'Oldest first' },
          { value: 'newest', label: 'Newest first' },
        ]}
        allowDeselect={false}
      />
      <Switch
        label="Public domain only"
        description="Show only works whose images are free to reuse for any purpose (CC0 / public domain)."
        checked={query.openAccess}
        onChange={(e) => onChange({ openAccess: e.currentTarget.checked })}
      />
      <Stack gap={6}>
        <Text size="sm" fw={500}>
          Museums &amp; sources
        </Text>
        {sources.map((s) => {
          const status = statuses.find((x) => x.id === s.id);
          return (
            <Group key={s.id} justify="space-between" wrap="nowrap" gap="xs">
              <Tooltip label={s.enabled ? `${s.country}` : 'Needs a free API key. See the setup guide (docs/setup/api-keys.md).'}>
                <Checkbox
                  size="xs"
                  label={s.name}
                  disabled={!s.enabled}
                  checked={s.enabled && selected.includes(s.id)}
                  onChange={(e) => toggleSource(s.id, e.currentTarget.checked)}
                />
              </Tooltip>
              {!s.enabled ? (
                <Badge size="xs" variant="light" color="gray">
                  key needed
                </Badge>
              ) : status ? (
                <Tooltip label={status.message ?? status.state}>
                  <Badge size="xs" variant="dot" color={STATE_COLOUR[status.state]}>
                    {status.state === 'ok' ? (status.total != null ? compact(status.total) : status.count) : status.state}
                  </Badge>
                </Tooltip>
              ) : null}
            </Group>
          );
        })}
      </Stack>
    </Stack>
  );
}

function compact(n: number): string {
  return new Intl.NumberFormat('en-CA', { notation: 'compact' }).format(n);
}
