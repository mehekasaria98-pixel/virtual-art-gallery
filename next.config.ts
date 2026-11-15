import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Museum images are already served from fast CDNs / IIIF servers. Skipping
  // Vercel's image optimiser keeps us well inside the free (Hobby) quota.
  images: { unoptimized: true },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks', '@tabler/icons-react'],
  },
};

export default nextConfig;
