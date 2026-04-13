import type { FinancialAidFundRecord, FinancialAidStatus } from '@/lib/advocacy/financial-aid/types';

const ONCOLOGY_KEYWORDS = [
  'cancer',
  'oncology',
  'tumor',
  'tumour',
  'carcinoma',
  'sarcoma',
  'lymphoma',
  'leukemia',
  'myeloma',
  'melanoma',
  'glioblastoma',
  'neoplasm',
  'metastatic',
  'nsclc',
];

export function slugFromUrl(url: string) {
  const pathname = new URL(url).pathname.replace(/\/+$/, '');
  return pathname.split('/').filter(Boolean).pop() ?? pathname;
}

export function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

export function isOncologyFundTitle(value: string) {
  const normalized = value.toLowerCase();
  return ONCOLOGY_KEYWORDS.some((term) => normalized.includes(term));
}

export function dedupeFunds(funds: FinancialAidFundRecord[]) {
  const seen = new Set<string>();
  return funds.filter((fund) => {
    const key = `${fund.sourceSlug}:${fund.externalKey}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function statusFromText(value: string): FinancialAidStatus {
  const normalized = value.toLowerCase();
  if (
    normalized.includes('waitlist') ||
    normalized.includes('re-enrollment') ||
    normalized.includes('not yet accepting applications') ||
    normalized.includes('identified and approved')
  ) {
    return 'waitlist';
  }
  if (
    normalized.includes('accepting phone applications only') ||
    normalized.includes('program status: open') ||
    normalized.includes('status open') ||
    normalized.includes(' now accepting grant applications') ||
    normalized.includes('apply online') ||
    normalized.includes('currently open')
  ) {
    return 'open';
  }
  return 'closed';
}

export function extractSection(
  text: string,
  startLabels: string[],
  endLabels: string[]
) {
  const normalized = text;
  const lower = normalized.toLowerCase();
  let startIndex = -1;

  for (const label of startLabels) {
    const idx = lower.indexOf(label.toLowerCase());
    if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
      startIndex = idx;
    }
  }

  if (startIndex === -1) return '';

  let endIndex = normalized.length;
  for (const label of endLabels) {
    const idx = lower.indexOf(label.toLowerCase(), startIndex + 1);
    if (idx !== -1 && idx < endIndex) {
      endIndex = idx;
    }
  }

  return normalizeWhitespace(normalized.slice(startIndex, endIndex));
}

export function buildDiagnosisFocus(title: string, bodyText: string) {
  const combined = `${title} ${bodyText}`;
  const codeMatches = combined.match(/\b[A-Z]\d{2}(?:\.\d+)?(?:-[A-Z]\d{2}(?:\.\d+)?)?\b/g) ?? [];

  const phrases = [
    title,
    ...Array.from(
      new Set(
        (combined.match(
          /\b(?:stage\s+[ivx0-9a-z]+(?:\s+[a-z]+)*|non-small cell lung cancer|small cell lung cancer|lung cancer|breast cancer|prostate cancer|head & neck cancer|head and neck cancer|testicular cancer|melanoma|myeloma|lymphoma|leukemia|renal cell carcinoma|esophageal cancer|ovarian cancer|pancreatic cancer)\b/gi
        ) ?? []).map((item) => normalizeWhitespace(item))
      )
    ),
    ...codeMatches,
  ].filter(Boolean);

  return Array.from(new Set(phrases)).slice(0, 12);
}
