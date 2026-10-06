import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { viewMetadata } from '@/lib/about';

// The view itself is a client component, so its title and description live here.
export const metadata: Metadata = viewMetadata('/base');

export default function BaseLayout({ children }: { children: ReactNode }) {
  return children;
}
