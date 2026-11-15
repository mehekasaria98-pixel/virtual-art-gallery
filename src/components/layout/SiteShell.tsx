'use client';

import {
  ActionIcon,
  Anchor,
  Box,
  Burger,
  Container,
  Drawer,
  Group,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const NAV = [
  { href: '/explore', label: 'Explore' },
  { href: '/#journeys', label: 'Journeys' },
  { href: '/favourites', label: 'Favourites' },
  { href: '/help', label: 'Guide' },
];

function ThemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const next = computed === 'dark' ? 'light' : 'dark';
  return (
    <Tooltip label={`Switch to ${next} mode`}>
      <ActionIcon variant="subtle" color="gray" size="lg" aria-label={`Switch to ${next} mode`} onClick={() => setColorScheme(next)}>
        {computed === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();
  const isActive = (href: string) => href !== '/#journeys' && pathname.startsWith(href);

  return (
    <>
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'color-mix(in srgb, var(--mantine-color-body) 88%, transparent)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--gallery-border)',
        }}
      >
        <Container size="xl" h={60}>
          <Group h="100%" justify="space-between" wrap="nowrap">
            <Anchor component={Link} href="/" underline="never" c="inherit" aria-label="Atlas of Art, home">
              <Text ff="var(--font-serif), Georgia, serif" fz={22} fw={500} style={{ letterSpacing: '-0.01em' }}>
                Atlas <Text span inherit c="oxblood" fs="italic">of</Text> Art
              </Text>
            </Anchor>
            <Group gap="lg" visibleFrom="sm" component="nav" aria-label="Main">
              {NAV.map((n) => (
                <Anchor
                  key={n.href}
                  component={Link}
                  href={n.href}
                  underline="never"
                  c={isActive(n.href) ? 'oxblood' : 'inherit'}
                  fw={isActive(n.href) ? 600 : 400}
                  aria-current={isActive(n.href) ? 'page' : undefined}
                >
                  {n.label}
                </Anchor>
              ))}
              <ThemeToggle />
            </Group>
            <Group gap="xs" hiddenFrom="sm">
              <ThemeToggle />
              <Burger opened={opened} onClick={toggle} aria-label="Open menu" size="sm" />
            </Group>
          </Group>
        </Container>
      </Box>

      <Drawer opened={opened} onClose={close} position="right" size="xs" title="Menu" hiddenFrom="sm">
        <Stack gap="md" component="nav" aria-label="Mobile">
          {NAV.map((n) => (
            <UnstyledButton key={n.href} component={Link} href={n.href} onClick={close} fz="lg">
              {n.label}
            </UnstyledButton>
          ))}
        </Stack>
      </Drawer>

      <Box component="main" mih="calc(100vh - 160px)">
        {children}
      </Box>

      <Box component="footer" mt="xl" py="lg" style={{ borderTop: '1px solid var(--gallery-border)' }}>
        <Container size="xl">
          <Text size="sm" className="muted">
            Images and data from the open-access programmes of the Art Institute of Chicago, The Metropolitan Museum of
            Art, the Cleveland Museum of Art, the Victoria and Albert Museum, Wikidata/Wikimedia Commons and, when
            enabled, Harvard Art Museums, Europeana and the Smithsonian. Each artwork links back to its source and
            licence.
          </Text>
        </Container>
      </Box>
    </>
  );
}
