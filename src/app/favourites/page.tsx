'use client';

import { Alert, Button, Container, FileButton, Group, Stack, Text, Title } from '@mantine/core';
import { IconDownload, IconTrash, IconUpload } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { ArtworkCard } from '@/components/gallery/ArtworkCard';
import { useFavourites } from '@/lib/favourites';

export default function FavouritesPage() {
  const { favourites, clear, importJson, exportJson } = useFavourites();
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const download = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `atlas-of-art-favourites-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const upload = async (file: File | null) => {
    if (!file) return;
    try {
      const added = importJson(await file.text());
      setMessage({ kind: 'ok', text: `Imported ${added} new ${added === 1 ? 'work' : 'works'}.` });
    } catch (e) {
      setMessage({ kind: 'error', text: `Couldn't import that file: ${(e as Error).message}` });
    }
  };

  return (
    <Container size="xl" py="lg">
      <Stack gap="md">
        <Group justify="space-between" align="flex-end">
          <div>
            <Title order={1} fz={{ base: 28, sm: 36 }}>
              Favourites
            </Title>
            <Text className="muted" size="sm">
              Saved in this browser only. Export them to move to another device.
            </Text>
          </div>
          <Group gap="xs">
            <Button variant="default" leftSection={<IconDownload size={16} />} onClick={download} disabled={!favourites.length}>
              Export
            </Button>
            <FileButton onChange={upload} accept="application/json">
              {(props) => (
                <Button variant="default" leftSection={<IconUpload size={16} />} {...props}>
                  Import
                </Button>
              )}
            </FileButton>
            <Button
              variant="subtle"
              color="red"
              leftSection={<IconTrash size={16} />}
              disabled={!favourites.length}
              onClick={() => {
                if (window.confirm(`Remove all ${favourites.length} favourites from this browser?`)) clear();
              }}
            >
              Clear
            </Button>
          </Group>
        </Group>

        {message && (
          <Alert color={message.kind === 'ok' ? 'teal' : 'red'} withCloseButton onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {favourites.length === 0 ? (
          <Stack align="center" py={80} gap="xs">
            <Title order={3}>No favourites yet</Title>
            <Text className="muted" ta="center">
              Tap the heart on any artwork to keep it here.
            </Text>
            <Button component={Link} href="/explore" mt="sm">
              Explore art
            </Button>
          </Stack>
        ) : (
          <div className="masonry">
            {favourites.map((a) => (
              <ArtworkCard key={a.key} artwork={a} />
            ))}
          </div>
        )}
      </Stack>
    </Container>
  );
}
