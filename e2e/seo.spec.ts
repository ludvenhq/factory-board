import { expect, test } from '@playwright/test';

/**
 * What a search engine reads: one h1 a view, its own title and canonical, the app described as
 * data, and a sitemap naming the five views. Each view opens on the demo base, so every one is a
 * real page with or without a save.
 */

const VIEWS = [
  { path: '/', title: /Satisfactory save analyzer/, h1: 'Overview' },
  { path: '/base', title: /^Base map · Factory Board$/, h1: 'Base' },
  { path: '/plan', title: /^Planner · Factory Board$/, h1: 'Production targets' },
  { path: '/progress', title: /^Progression · Factory Board$/, h1: /Progression|Research by tier/ },
  { path: '/history', title: /^History · Factory Board$/, h1: 'History' },
];

for (const view of VIEWS) {
  test(`${view.path} has one h1, its own title and its own canonical`, async ({ page }) => {
    await page.goto(view.path);
    await page.waitForSelector('body[data-drop-ready="1"]');
    await expect(page).toHaveTitle(view.title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(view.h1, { ignoreCase: true });
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(new URL(canonical ?? '').pathname).toBe(view.path);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toContain('Satisfactory');
    expect(description!.length).toBeLessThanOrEqual(160);
  });
}

test('the app is described as a free web application by the studio', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(raw ?? '{}');
  expect(data['@type']).toBe('WebApplication');
  expect(data.isAccessibleForFree).toBe(true);
  expect(data.publisher.name).toBe('Ludven');
});

test('robots.txt points at a sitemap that names the five views', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]!).pathname);
  expect(urls).toEqual(['/', '/base', '/plan', '/progress', '/history']);
});
