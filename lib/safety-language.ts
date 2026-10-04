const MORTALITY_PATTERNS: Array<{ id: string; pattern: RegExp }> = [
  { id: 'survival_rate', pattern: /\bsurvival rate\b/i },
  { id: 'five_year_survival', pattern: /\b5[\s-]*year survival\b/i },
  { id: 'median_survival', pattern: /\bmedian survival\b/i },
  { id: 'mortality', pattern: /\bmortality\b/i },
  { id: 'prognosis_percent', pattern: /\bprognosis\b.{0,40}\d+\s*%/i },
  { id: 'die_from', pattern: /\bdie from\b/i },
  { id: 'fatal', pattern: /\bfatal(?:ity)?\b/i },
  { id: 'life_expectancy', pattern: /\blife expectancy\b/i },
  { id: 'risk_score', pattern: /\brisk score\b/i },
  { id: 'screening_age', pattern: /\bscreening age[s]?\b/i },
];

export function findUnsafeClinicalLanguage(text: string): string[] {
  return MORTALITY_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(({ id }) => id);
}

export function assertSafeClinicalCopy(text: string, context: string): void {
  const hits = findUnsafeClinicalLanguage(text);
  if (hits.length > 0) {
    throw new Error(`Unsafe clinical language in ${context}: ${hits.join(', ')}`);
  }
}
