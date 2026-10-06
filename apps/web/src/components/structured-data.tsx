import { REPO_URL, SITE_DESCRIPTION, SITE_URL, studioUrl } from '@/lib/about';

/**
 * What the page is, for search engines: a free web app for Satisfactory, made by the studio.
 * A data block, never executed, so the Content-Security-Policy has nothing to say about it.
 */
export function StructuredData() {
  const studio = studioUrl();
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Factory Board',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'A current browser with WebGL',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    license: 'https://opensource.org/licenses/MIT',
    sameAs: [REPO_URL],
    publisher: { '@type': 'Organization', name: 'Ludven', ...(studio ? { url: studio } : {}) },
  };
  return (
    <script
      type="application/ld+json"
      // JSON cannot close the script tag once every < is escaped.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
