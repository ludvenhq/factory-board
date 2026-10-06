import type { MetadataRoute } from 'next';
import { SITE_URL, VIEWS } from '@/lib/about';

// A static export has no request to be dynamic for; the file is written once, at build.
export const dynamic = 'force-static';

/** The five views. Every one opens on the demo base, so each is a real page to a crawler. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...Object.keys(VIEWS)].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.6,
  }));
}
