import { ASK_CARE_TEAM } from '@/lib/after-90/config';
import { containsCrisisLanguage } from '@/lib/agents/safety';

const BANNED_COMPARE = [
  /\brecurrence\b/i,
  /\bprognosis\b/i,
  /\bsurvival\b/i,
  /\bmortality\b/i,
  /\b\d+(\.\d+)?\s*%/ ,
  /\bpercent\b/i,
  /\brisk of\b/i,
  /\blikely to\b/i,
];

export type ReportDiff = {
  newerOnly: string[];
  olderOnly: string[];
  notStated: string[];
  summary: string;
  askLine: typeof ASK_CARE_TEAM;
  crisis: boolean;
};

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter((part) => part.length > 12);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function compareSameKindReports(olderText: string, newerText: string): ReportDiff {
  const older = sentences(olderText);
  const newer = sentences(newerText);
  const olderNorm = new Set(older.map(normalize));
  const newerNorm = new Set(newer.map(normalize));

  const newerOnly = newer.filter((line) => !olderNorm.has(normalize(line))).slice(0, 12);
  const olderOnly = older.filter((line) => !newerNorm.has(normalize(line))).slice(0, 12);
  const notStated: string[] = [];
  if (!newerText.trim()) notStated.push('Newer report text is not stated.');
  if (!olderText.trim()) notStated.push('Older report text is not stated.');

  const joined = [...newerOnly, ...olderOnly].join(' ');
  const unsafe = BANNED_COMPARE.some((pattern) => pattern.test(joined));
  const safeNewer = unsafe ? newerOnly.filter((line) => !BANNED_COMPARE.some((pattern) => pattern.test(line))) : newerOnly;
  const safeOlder = unsafe ? olderOnly.filter((line) => !BANNED_COMPARE.some((pattern) => pattern.test(line))) : olderOnly;

  const summary = [
    safeNewer.length
      ? `The newer report mentions these lines that the older report did not: ${safeNewer.join(' ')}`
      : 'The newer report does not add stated lines beyond the older report.',
    safeOlder.length
      ? `The older report mentioned these lines that the newer report does not: ${safeOlder.join(' ')}`
      : 'The older report does not contain stated lines missing from the newer report.',
    ASK_CARE_TEAM,
  ].join(' ');

  return {
    newerOnly: safeNewer,
    olderOnly: safeOlder,
    notStated,
    summary,
    askLine: ASK_CARE_TEAM,
    crisis: containsCrisisLanguage(`${olderText} ${newerText}`),
  };
}

export function assertSafeCompareSummary(summary: string): string {
  if (BANNED_COMPARE.some((pattern) => pattern.test(summary))) {
    return `The two reports differ in the wording on file. ${ASK_CARE_TEAM}`;
  }
  if (!summary.includes(ASK_CARE_TEAM)) {
    return `${summary} ${ASK_CARE_TEAM}`;
  }
  return summary;
}
