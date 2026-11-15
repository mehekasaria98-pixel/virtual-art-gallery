import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExploreClient } from '@/components/explore/ExploreClient';

export const metadata: Metadata = {
  title: 'Explore',
  description: 'Browse world art by region, century, decade and style.',
};

export default function ExplorePage() {
  // useSearchParams() needs a Suspense boundary for static rendering.
  return (
    <Suspense>
      <ExploreClient />
    </Suspense>
  );
}
