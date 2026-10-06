import { version } from '../../package.json';

/**
 * The few facts the page states about itself: where its source is, which
 * version it is, and where it is meant to be hosted. In one place so the
 * footer, the error page and the metadata cannot disagree.
 */
export const APP_VERSION: string = version;

export const REPO_URL = 'https://github.com/ludvenhq/factory-board';

/** Where Steam and Epic both keep saves, in the form Explorer's address bar takes. */
export const WHERE_SAVES_ARE = '%LOCALAPPDATA%\\FactoryGame\\Saved\\SaveGames';

/** GitHub accepts a few kilobytes of URL; the stack is trimmed to fit. */
const MAX_MESSAGE_CHARS = 2000;

/**
 * Where the hosted copy lives, for absolute URLs in metadata. Overridable at
 * build time so a fork or a staging copy does not advertise this one.
 */
export const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://factory-board.ludven.com';

/** The sentence the product is, in the words a player would search for it. */
export const SITE_TITLE = 'Factory Board: Satisfactory save analyzer and planner';
export const SITE_DESCRIPTION =
  'Drop a Satisfactory save and see which lines are slow, why, and what to fix first, plus a planner checked against your real base. Free, in your browser.';

/** Each view's own title and description, for its tab, its search result and the sitemap. */
export const VIEWS = {
  '/base': {
    title: 'Base map',
    description:
      'Every building in your Satisfactory save drawn at its real size and place, grouped into zones and coloured by uptime. Read in your browser, never uploaded.',
  },
  '/plan': {
    title: 'Planner',
    description:
      'Plan a Satisfactory production target and check it against your base: machines to build, power, belts, and what to build first.',
  },
  '/progress': {
    title: 'Progression',
    description:
      'Milestones researched and Space Elevator parts delivered, read straight out of your Satisfactory save, with what each phase still needs.',
  },
  '/history': {
    title: 'History',
    description:
      'Every autosave of a Satisfactory session kept in your browser: machines, power, uptime and the Space Elevator burn-down over time.',
  },
} as const;

export type ViewPath = keyof typeof VIEWS;

/** A view's metadata, with its own canonical address (a root canonical would point every view home). */
export function viewMetadata(path: ViewPath) {
  const { title, description } = VIEWS[path];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · Factory Board`, description, url: path },
  };
}

/**
 * The studio's site, set at build once it answers (the hosted build only). While it is unset the
 * footer names the studio without linking it, so the page never sends anyone to a dead domain.
 * Read at build by server components only: the client bundle does not carry it.
 */
export function studioUrl(): string | null {
  return process.env.FACTORY_BOARD_STUDIO_URL?.replace(/\/$/, '') || null;
}

/** Where the visit counter lives (ADR 37). Moves to the studio's own Umami with one build arg. */
export const UMAMI_HOST_DEFAULT = 'https://stats.gapchix.io';
export function umamiHost(): string {
  return process.env.FACTORY_BOARD_UMAMI_HOST?.replace(/\/$/, '') || UMAMI_HOST_DEFAULT;
}

/**
 * A prefilled bug report.
 *
 * Everything a report needs and nothing it should not: the message, the
 * version, which game build wrote the save, and the browser — never the save
 * itself, which is personal and stays on the reader's disk unless they choose
 * otherwise.
 */
export function issueUrl(details: {
  readonly title: string;
  readonly message: string;
  readonly saveBuildVersion?: number | undefined;
}): string {
  const agent = typeof navigator === 'undefined' ? 'unknown' : navigator.userAgent;
  /*
   * A stack from a deep React tree can run past what a URL may carry, and
   * the one link meant to work when everything else failed must not 414.
   * Backticks go too, so the message cannot close the fence around it.
   */
  const message = details.message.replace(/`/g, "'").slice(0, MAX_MESSAGE_CHARS);
  const body = [
    '**What happened**',
    '',
    '```',
    message,
    '```',
    '',
    `- Factory Board v${APP_VERSION}`,
    `- Game build: ${details.saveBuildVersion ?? 'no save loaded'}`,
    `- Browser: ${agent}`,
    '',
    '**What you were doing**',
    '',
    '(which view, which file — the save itself is not needed unless asked)',
  ].join('\n');
  const params = new URLSearchParams({ title: details.title, body });
  return `${REPO_URL}/issues/new?${params.toString()}`;
}
