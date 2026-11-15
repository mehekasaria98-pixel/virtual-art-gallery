'use client';

import { Anchor, Box, Container, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';

export function HelpLayout({ toc, children }: { toc: Array<{ slug: string; title: string }>; children: ReactNode }) {
  return (
    <Container size="xl" py="lg">
      <Box style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
        <Box component="nav" aria-label="Guide contents" visibleFrom="md" w={240} style={{ flex: '0 0 240px', position: 'sticky', top: 84 }}>
          <Text size="xs" tt="uppercase" fw={600} className="muted" mb="xs">
            User guide
          </Text>
          <Stack gap={6}>
            {toc.map((t) => (
              <Anchor key={t.slug} href={`#${t.slug}`} size="sm" c="inherit">
                {t.title}
              </Anchor>
            ))}
          </Stack>
        </Box>
        <Box className="prose" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Container>
  );
}
