'use client';

import {
  Alert,
  Box,
  Button,
  Container,
  Drawer,
  Group,
  Indicator,
  SegmentedControl,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { IconAlertTriangle, IconFilter, IconLayoutGrid, IconMap2, IconSearch, IconTimeline } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { ActiveFilters } from '@/components/filters/ActiveFilters';
import { FilterPanel } from '@/components/filters/FilterPanel';
import { ArtworkCard } from '@/components/gallery/ArtworkCard';
import { LoadMore } from '@/components/gallery/LoadMore';
import { MapView } from '@/components/gallery/MapView';
import { TimelineView } from '@/components/gallery/TimelineView';
import { useArtworkSearch } from '@/hooks/useArtworkSearch';
import { useExploreState } from '@/hooks/useExploreState';
import type { ViewMode } from '@/lib/query';
import { SOURCE_NAMES } from '@/lib/sourceNames';

function headline(n: number, loading: boolean): string {
  if (loading) return 'Searching museums…';
  return n === 0 ? 'No works found' : `${n}${n >= 40 ? '+' : ''} works`;
}

export function ExploreClient() {
  const { query, view, setQuery, setView, reset } = useExploreState();
  const [drawerOpen, drawer] = useDisclosure(false);
  const search = useArtworkSearch(query);
  const { items, sources, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage, lastPageEmpty } = search;

  // Keyword box: local state, pushed to the URL after typing pauses.
  const [text, setText] = useState(query.q);
  useEffect(() => setText(query.q), [query.q]);
  const pushText = useDebouncedCallback((q: string) => setQuery({ q }), 450);

  const activeCount = query.regions.length + query.styles.length + (query.from !== null || query.to !== null ? 1 : 0);
  const failed = sources.filter((s) => s.state === 'error' || s.state === 'timeout');

  const panel = <FilterPanel query={query} onChange={setQuery} statuses={sources} />;

  return (
    <Container size="xl" py="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-end" gap="sm">
          <div>
            <Title order={1} fz={{ base: 28, sm: 36 }}>
              Explore
            </Title>
            <Text className="muted" size="sm">
              Filter by region, era and style across museums worldwide.
            </Text>
          </div>
          <Group gap="xs" wrap="nowrap" style={{ flex: '1 1 320px', justifyContent: 'flex-end' }}>
            <TextInput
              placeholder="Keyword, artist, subject…"
              leftSection={<IconSearch size={16} />}
              value={text}
              onChange={(e) => {
                setText(e.currentTarget.value);
                pushText(e.currentTarget.value);
              }}
              aria-label="Keyword search"
              style={{ flex: 1, maxWidth: 360 }}
            />
            <Indicator label={activeCount} size={16} disabled={activeCount === 0} hiddenFrom="md">
              <Button variant="default" leftSection={<IconFilter size={16} />} onClick={drawer.open} hiddenFrom="md">
                Filters
              </Button>
            </Indicator>
          </Group>
        </Group>

        <Group justify="space-between" gap="sm">
          <ActiveFilters query={query} onChange={setQuery} onReset={reset} />
          <SegmentedControl
            ml="auto"
            size="xs"
            value={view}
            onChange={(v) => setView(v as ViewMode)}
            aria-label="Results view"
            data={[
              { value: 'grid', label: <ViewLabel icon={<IconLayoutGrid size={14} />} text="Grid" /> },
              { value: 'timeline', label: <ViewLabel icon={<IconTimeline size={14} />} text="Timeline" /> },
              { value: 'map', label: <ViewLabel icon={<IconMap2 size={14} />} text="Map" /> },
            ]}
          />
        </Group>

        <Box style={{ display: 'flex', gap: 'var(--mantine-spacing-xl)', alignItems: 'flex-start' }}>
          <Box
            component="aside"
            aria-label="Filters"
            visibleFrom="md"
            w={360}
            style={{ flex: '0 0 360px', position: 'sticky', top: 76 }}
          >
            {/* Plain overflow box: Mantine's ScrollArea lays content out as a table, which lets the SVG map grow unbounded. */}
            <Box mah="calc(100vh - 96px)" style={{ overflowY: 'auto', overscrollBehavior: 'contain' }} pr={4}>
              {panel}
            </Box>
          </Box>

          <Box style={{ flex: 1, minWidth: 0 }} component="section" aria-label="Results">
            <Text size="sm" className="muted" mb="sm" aria-live="polite">
              {headline(items.length, isLoading)}
            </Text>

            {failed.length > 0 && !isLoading && (
              <Alert variant="light" color="yellow" icon={<IconAlertTriangle size={16} />} mb="md" p="xs">
                <Text size="sm">
                  {failed.map((f) => SOURCE_NAMES[f.id]).join(', ')} {failed.length === 1 ? 'is' : 'are'} slow or unavailable right
                  now. Showing the other museums first; more will load as you scroll.
                </Text>
              </Alert>
            )}

            {isError && (
              <Alert color="red" title="Search failed" mb="md">
                {(error as Error)?.message}. Check your connection and try again.
              </Alert>
            )}

            {isLoading ? (
              <div className="masonry">
                {Array.from({ length: 12 }, (_, i) => (
                  <Skeleton key={i} h={160 + ((i * 53) % 140)} radius="sm" />
                ))}
              </div>
            ) : items.length === 0 && !isError ? (
              <EmptyState onReset={reset} />
            ) : view === 'timeline' ? (
              <TimelineView items={items} from={query.from} to={query.to} />
            ) : view === 'map' ? (
              <MapView items={items} />
            ) : (
              <div className="masonry">
                {items.map((a) => (
                  <ArtworkCard key={a.key} artwork={a} />
                ))}
              </div>
            )}

            {!isLoading && items.length > 0 && (
              <LoadMore
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={() => void fetchNextPage()}
                autoLoad={!lastPageEmpty}
              />
            )}
          </Box>
        </Box>
      </Stack>

      <Drawer
        opened={drawerOpen}
        onClose={drawer.close}
        title="Filters"
        position="bottom"
        size="90%"
        hiddenFrom="md"
        styles={{ body: { paddingBottom: 80 } }}
      >
        {panel}
        <Box pos="fixed" bottom={0} left={0} right={0} p="md" style={{ background: 'var(--mantine-color-body)', borderTop: '1px solid var(--gallery-border)' }}>
          <Button fullWidth onClick={drawer.close}>
            Show {isLoading ? '' : `${items.length}${hasNextPage ? '+' : ''} `}results
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}

function ViewLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Group gap={4} wrap="nowrap">
      {icon}
      <span>{text}</span>
    </Group>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <Stack align="center" py={60} gap="xs">
      <Title order={3}>Nothing matched every filter</Title>
      <Text className="muted" ta="center" maw={440}>
        Museums record places and dates differently. Try widening the era, removing a style, or turning off
        “Public domain only”.
      </Text>
      <Button variant="light" onClick={onReset} mt="sm">
        Clear filters
      </Button>
    </Stack>
  );
}
