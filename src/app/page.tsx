'use client';

import { Box, Button, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { CenturyShortcut, RegionShortcut, StylePills } from '@/components/home/HomeBrowse';
import { JourneyCard } from '@/components/home/JourneyCard';
import { JOURNEYS } from '@/lib/journeys';
import { STYLE_FAMILIES, STYLES } from '@/taxonomy/styles';

export default function HomePage() {
  return (
    <>
      <Box py={{ base: 48, sm: 80 }} style={{ borderBottom: '1px solid var(--gallery-border)' }}>
        <Container size="xl">
          <Stack gap="lg" maw={760}>
            <Text tt="uppercase" fw={600} size="xs" c="oxblood" style={{ letterSpacing: '0.12em' }}>
              Open-access art from museums worldwide
            </Text>
            <Title order={1}>
              Five thousand years of art, arranged by <em>when</em>, <em>where</em> and <em>how</em> it was made.
            </Title>
            <Text size="lg" className="muted">
              Wander from Egyptian reliefs to ukiyo-e prints, Mughal miniatures, Romantic seascapes and African modernism.
              Filter by region, century, decade and movement; every work links back to the museum that holds it.
            </Text>
            <Group>
              <Button component={Link} href="/explore" size="md">
                Start exploring
              </Button>
              <Button component={Link} href="#journeys" size="md" variant="default">
                Take a journey
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        <Stack gap={56}>
          <Box component="section" id="journeys" style={{ scrollMarginTop: 80 }}>
            <Title order={2} mb={4}>
              Journeys
            </Title>
            <Text className="muted" mb="lg">
              Curated starting points. Each one opens Explore with its filters set, so you can change them from there.
            </Text>
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="lg">
              {JOURNEYS.map((j) => (
                <JourneyCard key={j.id} journey={j} />
              ))}
            </SimpleGrid>
          </Box>

          <Box component="section">
            <Title order={2} mb={4}>
              Browse by region
            </Title>
            <Text className="muted" mb="lg">
              Choose a part of the world.
            </Text>
            <RegionShortcut />
          </Box>

          <Box component="section">
            <Title order={2} mb={4}>
              Browse by century
            </Title>
            <Text className="muted" mb="lg">
              Opens a timeline you can narrow to a single decade.
            </Text>
            <CenturyShortcut />
          </Box>

          <Box component="section">
            <Title order={2} mb="lg">
              Browse by style
            </Title>
            <Stack gap="lg">
              {STYLE_FAMILIES.map((f) => (
                <Box key={f.id}>
                  <Text size="xs" tt="uppercase" fw={600} className="muted" mb={8}>
                    {f.label}
                  </Text>
                  <StylePills items={STYLES.filter((s) => s.family === f.id).map((s) => ({ id: s.id, label: s.label }))} />
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
