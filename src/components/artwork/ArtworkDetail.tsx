'use client';

import {
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  CopyButton,
  Group,
  Modal,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconCheck, IconExternalLink, IconLink, IconZoomIn } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArtworkCard, FavouriteButton } from '@/components/gallery/ArtworkCard';
import { useArtworkSearch } from '@/hooks/useArtworkSearch';
import { EMPTY_QUERY, toSearchParams } from '@/lib/query';
import { SOURCE_NAMES } from '@/lib/sourceNames';
import { centuryLabel, centuryOf, centuryRange } from '@/taxonomy/eras';
import { getRegion } from '@/taxonomy/regions';
import { getStyle } from '@/taxonomy/styles';
import type { Artwork, SearchQuery } from '@/types/artwork';

export function ArtworkDetail({ artwork: a }: { artwork: Artwork }) {
  const router = useRouter();
  const [zoomOpen, zoom] = useDisclosure(false);
  const century = a.yearStart !== null ? centuryOf(a.yearStart) : null;

  const rows: Array<[string, React.ReactNode]> = [
    ['Artist', a.artist],
    ['Date', a.dateText],
    ['Place / culture', a.place],
    ['Region', a.region ? <Anchor component={Link} href={`/explore?regions=${a.region}`}>{getRegion(a.region).label}</Anchor> : null],
    ['Century', century !== null ? <Anchor component={Link} href={`/explore?from=${centuryRange(century).from}&to=${centuryRange(century).to}&view=timeline`}>{centuryLabel(century)}</Anchor> : null],
    ['Medium', a.medium],
    ['Credit', a.credit],
    ['Licence', a.isPublicDomain ? 'Public domain / CC0' : 'See the museum page for reuse terms'],
  ];

  return (
    <Container size="xl" py="lg">
      <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => router.back()} mb="md" px={0}>
        Back
      </Button>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 'lg', md: 48 }}>
        <Box>
          <Box
            component="button"
            onClick={zoom.open}
            aria-label="View larger image"
            style={{ all: 'unset', cursor: 'zoom-in', display: 'block', width: '100%', position: 'relative' }}
          >
            <img
              src={a.imageUrl}
              alt={`${a.title}${a.artist ? ` by ${a.artist}` : ''}`}
              style={{ width: '100%', height: 'auto', maxHeight: '78vh', objectFit: 'contain', background: 'var(--gallery-map-land)', borderRadius: 4 }}
            />
            <Badge pos="absolute" bottom={12} right={12} leftSection={<IconZoomIn size={12} />} variant="default">
              Zoom
            </Badge>
          </Box>
        </Box>

        <Stack gap="md">
          <div>
            <Title order={1} fz={{ base: 28, sm: 40 }}>
              {a.title}
            </Title>
            <Text size="lg" className="muted" mt={4}>
              {[a.artist, a.dateText].filter(Boolean).join(', ')}
            </Text>
          </div>

          <Group gap="xs">
            <FavouriteButton artwork={a} size="lg" />
            <Button component="a" href={a.sourceUrl} target="_blank" rel="noopener noreferrer" variant="default" rightSection={<IconExternalLink size={14} />}>
              View at {SOURCE_NAMES[a.source]}
            </Button>
            <CopyButton value={typeof window !== 'undefined' ? window.location.href : ''}>
              {({ copied, copy }) => (
                <Button variant="subtle" color="gray" onClick={copy} leftSection={copied ? <IconCheck size={14} /> : <IconLink size={14} />}>
                  {copied ? 'Link copied' : 'Copy link'}
                </Button>
              )}
            </CopyButton>
          </Group>

          {a.styles.length > 0 && (
            <Group gap={6}>
              {a.styles.map((s) => (
                <Badge key={s} component={Link} href={`/explore?styles=${s}`} variant="light" style={{ cursor: 'pointer', textTransform: 'none' }}>
                  {getStyle(s).label}
                </Badge>
              ))}
            </Group>
          )}

          {a.description && (
            <Text style={{ whiteSpace: 'pre-line' }} lh={1.7}>
              {a.description}
            </Text>
          )}

          <Table variant="vertical" layout="fixed" withTableBorder={false}>
            <Table.Tbody>
              {rows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <Table.Tr key={k}>
                    <Table.Th w={140} className="muted" fw={500}>
                      {k}
                    </Table.Th>
                    <Table.Td>{v}</Table.Td>
                  </Table.Tr>
                ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </SimpleGrid>

      <Stack gap={40} mt={56}>
        {a.yearStart !== null && (
          <Related
            title={`Also from ${a.yearStart < 0 ? 'around this time' : `around ${Math.round(a.yearStart / 10) * 10}`}`}
            query={{ ...EMPTY_QUERY, from: a.yearStart - 20, to: a.yearStart + 20, regions: a.region ? [a.region] : [] }}
            exclude={a.key}
          />
        )}
        {a.styles[0] && (
          <Related title={`More ${getStyle(a.styles[0]).label}`} query={{ ...EMPTY_QUERY, styles: [a.styles[0]] }} exclude={a.key} />
        )}
        {a.region && (
          <Related title={`More from ${getRegion(a.region).label}`} query={{ ...EMPTY_QUERY, regions: [a.region] }} exclude={a.key} />
        )}
      </Stack>

      <ZoomModal opened={zoomOpen} onClose={zoom.close} artwork={a} />
    </Container>
  );
}

function Related({ title, query, exclude }: { title: string; query: SearchQuery; exclude: string }) {
  const { items, isLoading } = useArtworkSearch(query);
  const list = items.filter((x) => x.key !== exclude).slice(0, 16);
  if (!isLoading && list.length === 0) return null;
  return (
    <Box component="section" aria-label={title}>
      <Group justify="space-between" mb="sm">
        <Title order={3}>{title}</Title>
        <Anchor component={Link} href={`/explore?${toSearchParams(query).toString()}`} size="sm">
          See all
        </Anchor>
      </Group>
      <div className="scroll-row">
        {isLoading
          ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} w={200} h={290} />)
          : list.map((x) => <ArtworkCard key={x.key} artwork={x} width={200} />)}
      </div>
    </Box>
  );
}

function ZoomModal({ opened, onClose, artwork }: { opened: boolean; onClose: () => void; artwork: Artwork }) {
  const [mode, setMode] = useState<'fit' | 'full'>('fit');
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      fullScreen
      title={
        <SegmentedControl
          size="xs"
          value={mode}
          onChange={(v) => setMode(v as 'fit' | 'full')}
          data={[
            { value: 'fit', label: 'Fit to screen' },
            { value: 'full', label: 'Actual size' },
          ]}
        />
      }
      styles={{ body: { height: 'calc(100% - 60px)', padding: 0 } }}
    >
      <Box h="100%" style={{ overflow: 'auto', display: 'flex', alignItems: mode === 'fit' ? 'center' : 'flex-start', justifyContent: mode === 'fit' ? 'center' : 'flex-start' }}>
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          onClick={() => setMode(mode === 'fit' ? 'full' : 'fit')}
          style={
            mode === 'fit'
              ? { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', cursor: 'zoom-in' }
              : { maxWidth: 'none', cursor: 'zoom-out' }
          }
        />
      </Box>
    </Modal>
  );
}
