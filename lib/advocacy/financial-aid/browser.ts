type LinkSnapshot = {
  href: string;
  text: string;
};

export type PageSnapshot = {
  url: string;
  title: string;
  text: string;
  links: LinkSnapshot[];
  mode: 'playwright' | 'fetch';
};

type PlaywrightLocator = {
  innerText(): Promise<string>;
  evaluateAll<T>(fn: (nodes: Element[]) => T): Promise<T>;
};

type PlaywrightPage = {
  goto(url: string, options: { waitUntil: 'domcontentloaded'; timeout: number }): Promise<unknown>;
  waitForTimeout(timeoutMs: number): Promise<void>;
  title(): Promise<string>;
  locator(selector: string): PlaywrightLocator;
};

type PlaywrightContext = {
  newPage(): Promise<PlaywrightPage>;
  close(): Promise<void>;
};

type PlaywrightBrowser = {
  newContext(options: { userAgent: string }): Promise<PlaywrightContext>;
  close(): Promise<void>;
};

type ChromiumRuntime = {
  args: string[];
  executablePath(): Promise<string>;
};

type PlaywrightCoreModule = {
  chromium: {
    launch(options: {
      executablePath?: string;
      args?: string[];
      headless: boolean;
    }): Promise<PlaywrightBrowser>;
  };
};

const DEFAULT_SCRAPER_USER_AGENT =
  'Mozilla/5.0 (compatible; OncoKindFundingBot/1.0; +https://www.oncokind.com)';

function getScraperUserAgent() {
  return process.env.FINANCIAL_AID_SCRAPER_USER_AGENT ?? DEFAULT_SCRAPER_USER_AGENT;
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripHtml(value: string) {
  return decodeEntities(value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function extractLinksFromHtml(html: string, baseUrl: string) {
  const links: LinkSnapshot[] = [];
  const anchorPattern = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = anchorPattern.exec(html)) !== null) {
    try {
      const href = new URL(match[2], baseUrl).toString();
      const text = stripHtml(match[3]);
      if (!href || !text) continue;
      links.push({ href, text });
    } catch {
      continue;
    }
  }

  return links;
}

async function buildFetchSnapshot(url: string): Promise<PageSnapshot> {
  const response = await fetch(url, {
    headers: {
      'user-agent': getScraperUserAgent(),
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return {
    url,
    title: titleMatch ? stripHtml(titleMatch[1]) : url,
    text: stripHtml(html),
    links: extractLinksFromHtml(html, url),
    mode: 'fetch',
  };
}

async function resolveExecutablePath() {
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_EXECUTABLE_PATH;
  }
  if (process.platform === 'linux') {
    const chromium = (await import('@sparticuz/chromium')).default;
    return chromium.executablePath();
  }
  return undefined;
}

async function withPlaywrightPage<T>(fn: (page: PlaywrightPage) => Promise<T>) {
  let browser: PlaywrightBrowser | null = null;
  let context: PlaywrightContext | null = null;

  try {
    const chromium = (await import('@sparticuz/chromium')).default as ChromiumRuntime;
    const playwrightModule = await import('playwright-core');
    const { chromium: playwrightChromium } = playwrightModule as unknown as PlaywrightCoreModule;
    const executablePath = await resolveExecutablePath();
    browser = await playwrightChromium.launch({
      executablePath,
      args: executablePath ? chromium.args : undefined,
      headless: true,
    });
    context = await browser.newContext({
      userAgent: getScraperUserAgent(),
    });
    const page = await context.newPage();
    return await fn(page);
  } finally {
    await context?.close().catch(() => undefined);
    await browser?.close().catch(() => undefined);
  }
}

async function snapshotFromPlaywrightPage(page: PlaywrightPage, url: string): Promise<PageSnapshot> {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(750);

  const [title, text, links] = await Promise.all([
    page.title(),
    page.locator('body').innerText(),
    page.locator('a[href]').evaluateAll((nodes: Element[]) =>
      nodes
        .map((node: Element) => {
          const anchor = node as HTMLAnchorElement;
          return {
            href: anchor.href,
            text: anchor.textContent?.trim() ?? '',
          };
        })
        .filter((link) => link.href && link.text)
    ),
  ]);

  return {
    url,
    title,
    text: text.replace(/\s+/g, ' ').trim(),
    links,
    mode: 'playwright',
  };
}

export async function withSnapshotReader<T>(
  fn: (getSnapshot: (url: string) => Promise<PageSnapshot>) => Promise<T>
): Promise<T> {
  try {
    return await withPlaywrightPage(async (page) => fn((url) => snapshotFromPlaywrightPage(page, url)));
  } catch {
    return fn((url) => buildFetchSnapshot(url));
  }
}

export async function getPageSnapshot(url: string): Promise<PageSnapshot> {
  return withSnapshotReader((getSnapshot) => getSnapshot(url));
}
