'use client';

import { Button, Center, Loader, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useEffect } from 'react';

interface Props {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  /** Stop auto-loading when the last page came back empty (all sources slow). */
  autoLoad: boolean;
}

/** Infinite scroll sentinel with a manual fallback button. */
export function LoadMore({ hasNextPage, isFetchingNextPage, fetchNextPage, autoLoad }: Props) {
  const { ref, entry } = useIntersection({ rootMargin: '600px' });
  useEffect(() => {
    if (autoLoad && entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [autoLoad, entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) {
    return (
      <Center py="xl">
        <Text size="sm" className="muted">
          That’s everything for these filters.
        </Text>
      </Center>
    );
  }
  return (
    <Center py="xl" ref={ref}>
      {isFetchingNextPage ? (
        <Loader size="sm" aria-label="Loading more artworks" />
      ) : (
        <Button variant="default" onClick={fetchNextPage}>
          Load more
        </Button>
      )}
    </Center>
  );
}
