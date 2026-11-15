'use client';

import { ActionIcon, Box, Group, Text, Tooltip } from '@mantine/core';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useFavourites } from '@/lib/favourites';
import type { Artwork } from '@/types/artwork';

export function artworkHref(a: Pick<Artwork, 'source' | 'sourceId'>): string {
  return `/artwork/${a.source}/${encodeURIComponent(a.sourceId)}`;
}

export function FavouriteButton({ artwork, size = 'md' }: { artwork: Artwork; size?: 'sm' | 'md' | 'lg' }) {
  const { isFavourite, toggle } = useFavourites();
  const fav = isFavourite(artwork.key);
  const label = fav ? 'Remove from favourites' : 'Save to favourites';
  return (
    <Tooltip label={label}>
      <ActionIcon
        variant={fav ? 'filled' : 'default'}
        radius="xl"
        size={size}
        aria-label={label}
        aria-pressed={fav}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle(artwork);
        }}
      >
        {fav ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
      </ActionIcon>
    </Tooltip>
  );
}

export function ArtworkCard({ artwork, width }: { artwork: Artwork; width?: number }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null; // Museums occasionally withdraw images; hide rather than show a hole.
  return (
    <Box pos="relative" w={width}>
      <Link href={artworkHref(artwork)} className="artwork-card" prefetch={false}>
        <img
          src={artwork.thumbUrl}
          alt={`${artwork.title}${artwork.artist ? ` by ${artwork.artist}` : ''}`}
          loading="lazy"
          decoding="async"
          onError={() => setBroken(true)}
          style={width ? { height: 220, objectFit: 'cover' } : undefined}
        />
        <Box p="sm">
          <Text fw={500} size="sm" lineClamp={2} ff="var(--font-serif), Georgia, serif">
            {artwork.title}
          </Text>
          <Text size="xs" className="muted" lineClamp={1}>
            {[artwork.artist, artwork.dateText].filter(Boolean).join(' · ') || artwork.place || ' '}
          </Text>
          <Group justify="space-between" mt={4} gap={4} wrap="nowrap">
            <Text size="xs" className="muted" lineClamp={1}>
              {artwork.credit.split(' — ')[0]}
            </Text>
          </Group>
        </Box>
      </Link>
      <Box pos="absolute" top={8} right={8}>
        <FavouriteButton artwork={artwork} size="md" />
      </Box>
    </Box>
  );
}
