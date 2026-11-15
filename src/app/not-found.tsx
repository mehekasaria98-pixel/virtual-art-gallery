'use client';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Container size="sm" py={80}>
      <Stack align="center" gap="sm">
        <Title order={1}>Not on the walls</Title>
        <Text className="muted" ta="center">
          That page or artwork couldn’t be found. The museum may have changed its record, or its API may be temporarily
          unavailable.
        </Text>
        <Button component={Link} href="/explore" mt="md">
          Back to Explore
        </Button>
      </Stack>
    </Container>
  );
}
