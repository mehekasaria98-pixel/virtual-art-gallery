import '@mantine/core/styles.css';
import './globals.css';

import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core';
import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { SiteShell } from '@/components/layout/SiteShell';
import { Providers } from './providers';

const serif = Fraunces({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Atlas of Art', template: '%s · Atlas of Art' },
  description:
    'Explore open-access art from museums across the world by era, decade, style and region: from ancient Egypt to ukiyo-e, Romanticism and African modernism.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f4ef' },
    { media: '(prefers-color-scheme: dark)', color: '#141312' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA" {...mantineHtmlProps} className={`${serif.variable} ${sans.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <Providers>
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
