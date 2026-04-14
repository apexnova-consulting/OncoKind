import { withSnapshotReader } from '@/lib/advocacy/financial-aid/browser';
import {
  buildDiagnosisFocus,
  dedupeFunds,
  extractSection,
  isOncologyFundTitle,
  normalizeWhitespace,
  slugFromUrl,
  statusFromText,
} from '@/lib/advocacy/financial-aid/helpers';
import type { FinancialAidFundRecord, FinancialAidProvider } from '@/lib/advocacy/financial-aid/types';

const PAF_LIST_URL = 'https://copays.org/funds/';
const HEALTHWELL_LIST_URL = 'https://www.healthwellfoundation.org/disease-funds/';
const CANCERCARE_LIST_URL = 'https://www.cancercare.org/copayfoundation';

const PAF_FALLBACK_URLS = [
  'https://copays.org/funds/non-small-cell-lung-cancers/',
  'https://copays.org/funds/small-cell-lung-cancer/',
  'https://copays.org/funds/metastaic-breast-cancer/',
  'https://copays.org/funds/breast-cancer/',
  'https://copays.org/funds/prostate-cancer/',
  'https://copays.org/funds/head-neck-cancer/',
  'https://copays.org/funds/testicular-cancer/',
  'https://copays.org/funds/neoplasm-related-pain/',
];

const CANCERCARE_FALLBACK_URLS = [
  'https://www.cancercare.org/co_payment_fundings/non-small-cell-lung-cancer',
  'https://www.cancercare.org/co_payment_fundings/small-cell-lung-cancer',
  'https://www.cancercare.org/co_payment_fundings/breast-cancer',
  'https://www.cancercare.org/co_payment_fundings/renal-cell-cancer',
  'https://www.cancercare.org/co_payment_fundings/esophageal-cancer',
];

async function mapSequential<T, R>(
  items: T[],
  fn: (item: T) => Promise<R | null>
): Promise<R[]> {
  const results: R[] = [];
  for (const item of items) {
    const value = await fn(item);
    if (value) results.push(value);
  }
  return results;
}

async function discoverLinks({
  listUrl,
  hrefIncludes,
  fallbackUrls,
  getSnapshot,
}: {
  listUrl: string;
  hrefIncludes: string;
  fallbackUrls: string[];
  getSnapshot: (url: string) => Promise<{ links: Array<{ href: string; text: string }> }>;
}) {
  try {
    const snapshot = await getSnapshot(listUrl);
    const discovered = snapshot.links
      .filter((link) => link.href.includes(hrefIncludes) && isOncologyFundTitle(link.text))
      .map((link) => link.href);

    return Array.from(new Set([...discovered, ...fallbackUrls]));
  } catch {
    return fallbackUrls;
  }
}

function titleFromSnapshot(snapshotTitle: string, text: string) {
  const firstHeadingMatch = text.match(/(?:^|\s)([A-Z][A-Za-z0-9&/()' -]{6,120})(?:\s+Status|\s+Program Status)/);
  if (firstHeadingMatch) {
    return normalizeWhitespace(firstHeadingMatch[1]);
  }

  return normalizeWhitespace(
    snapshotTitle
      .replace(/\s*-\s*HealthWell Foundation.*$/i, '')
      .replace(/\s*[–-]\s*Co-Pay Relief.*$/i, '')
      .replace(/\s*\|\s*Co-Payment Assistance Fund.*$/i, '')
      .replace(/\s*-\s*Patient Advocate Foundation.*$/i, '')
  );
}

function buildFundRecord(
  sourceSlug: FinancialAidFundRecord['sourceSlug'],
  url: string,
  title: string,
  statusText: string,
  eligibilityText: string,
  bodyText: string
): FinancialAidFundRecord {
  return {
    sourceSlug,
    externalKey: slugFromUrl(url),
    fundName: title,
    currentStatus: statusFromText(statusText || bodyText),
    eligibilityCriteria: normalizeWhitespace(eligibilityText || bodyText.slice(0, 800)),
    deepLink: url,
    diagnosisFocus: buildDiagnosisFocus(title, `${eligibilityText} ${bodyText}`),
  };
}

async function scrapePafFunds() {
  return withSnapshotReader(async (getSnapshot) => {
    const urls = await discoverLinks({
      listUrl: PAF_LIST_URL,
      hrefIncludes: '/funds/',
      fallbackUrls: PAF_FALLBACK_URLS,
      getSnapshot,
    });

    return mapSequential(urls, async (url) => {
      try {
        const snapshot = await getSnapshot(url);
        const title = titleFromSnapshot(snapshot.title, snapshot.text);
        if (!isOncologyFundTitle(title)) return null;

        const statusText = extractSection(snapshot.text, ['Status', 'Co-Pay Relief Program Fund Notices'], [
          'Fund Type',
          'Maximum Award Level',
          'Eligibility Requirements',
          'About ',
        ]);
        const eligibilityText = extractSection(snapshot.text, ['Eligibility Requirements', 'Eligible Diagnosis Codes'], [
          'About ',
          'Resources',
          'Disease & Education Resources',
        ]);

        return buildFundRecord('paf', url, title, statusText, eligibilityText, snapshot.text);
      } catch {
        return null;
      }
    });
  });
}

async function scrapeHealthwellFunds() {
  return withSnapshotReader(async (getSnapshot) => {
    const urls = await discoverLinks({
      listUrl: HEALTHWELL_LIST_URL,
      hrefIncludes: '/fund/',
      fallbackUrls: [
        'https://www.healthwellfoundation.org/fund/non-small-cell-lung-cancer/',
        'https://www.healthwellfoundation.org/fund/non-small-cell-lung-cancer-medicare-access/',
        'https://www.healthwellfoundation.org/fund/small-cell-lung-cancer-medicare-access/',
      ],
      getSnapshot,
    });

    return mapSequential(urls, async (url) => {
      try {
        const snapshot = await getSnapshot(url);
        const title = titleFromSnapshot(snapshot.title, snapshot.text);
        if (!isOncologyFundTitle(title)) return null;

        const statusText = extractSection(snapshot.text, ['Status'], [
          'Assistance Type',
          'Maximum Award Level',
          'Fund Alerts',
        ]);
        const eligibilityText = extractSection(snapshot.text, ['Do I Qualify?', 'Household Income Limit'], [
          'About ',
          'Additional Educational Resources',
        ]);

        return buildFundRecord('healthwell', url, title, statusText, eligibilityText, snapshot.text);
      } catch {
        return null;
      }
    });
  });
}

async function scrapeCancerCareFunds() {
  return withSnapshotReader(async (getSnapshot) => {
    const urls = await discoverLinks({
      listUrl: CANCERCARE_LIST_URL,
      hrefIncludes: '/co_payment_fundings/',
      fallbackUrls: CANCERCARE_FALLBACK_URLS,
      getSnapshot,
    });

    return mapSequential(urls, async (url) => {
      try {
        const snapshot = await getSnapshot(url);
        const title = titleFromSnapshot(snapshot.title, snapshot.text);
        if (!isOncologyFundTitle(title)) return null;

        const statusText = extractSection(snapshot.text, ['Program Status:', 'Status'], [
          'Eligibility Criteria',
          'Grant Amount',
          'Initial Grant Amount',
        ]);
        const eligibilityText = extractSection(snapshot.text, ['Eligibility Criteria'], [
          'Retroactive policy',
          'Initial Grant Amount',
          'Additional Services',
        ]);

        return buildFundRecord('cancercare', url, title, statusText, eligibilityText, snapshot.text);
      } catch {
        return null;
      }
    });
  });
}

export const liveFinancialAidProvider: FinancialAidProvider = {
  name: 'playwright-oncology-funding-scraper',
  async fetchFunds() {
    const scrapers = [scrapePafFunds, scrapeHealthwellFunds, scrapeCancerCareFunds];
    const results: FinancialAidFundRecord[][] = [];
    const errors: Error[] = [];

    for (const scrape of scrapers) {
      try {
        results.push(await scrape());
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error('Unknown scraper error'));
      }
    }

    const funds = results.flatMap((result) => result);

    if (funds.length === 0) {
      throw new Error(
        errors.length > 0
          ? `No financial aid funds could be scraped from any provider: ${errors
              .map((error) => error.message)
              .join(' | ')}`
          : 'No financial aid funds could be scraped from any provider'
      );
    }

    return dedupeFunds(funds);
  },
};
