import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = { title: 'Favourites', description: 'Artworks you have saved in this browser.' };

export default function FavouritesLayout({ children }: { children: ReactNode }) {
  return children;
}
