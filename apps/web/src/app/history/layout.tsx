import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { viewMetadata } from '@/lib/about';

// The view itself is a client component, so its title and description live here.
export const metadata: Metadata = viewMetadata('/history');

export default function HistoryLayout({ children }: { children: ReactNode }) {
  return children;
}
