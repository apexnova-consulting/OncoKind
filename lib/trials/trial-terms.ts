export const TRIAL_TERMS = {
  vulvar: {
    slug: 'vulvar-cancer',
    primary: ['vulvar cancer', 'vulvar neoplasms'],
    broader: [] as string[],
    broaderTitle: '',
    clinicalTrialsSearch: 'https://clinicaltrials.gov/search?cond=vulvar%20cancer&aggFilters=status:rec',
  },
  rare_ovarian: {
    slug: 'rare-ovarian',
    primary: [
      'low grade serous ovarian',
      'ovarian clear cell carcinoma',
      'mucinous ovarian',
      'granulosa cell tumor',
      'sex cord-stromal',
      'ovarian carcinosarcoma',
      '"ovarian germ cell tumor"',
      '"small cell carcinoma of the ovary"',
    ],
    broader: [] as string[],
    broaderTitle: '',
    clinicalTrialsSearch: 'https://clinicaltrials.gov/search?cond=ovarian%20cancer&aggFilters=status:rec',
  },
  uterine_sarcoma: {
    slug: 'uterine-sarcoma',
    primary: ['uterine sarcoma', 'uterine leiomyosarcoma', 'endometrial stromal sarcoma'],
    broader: ['leiomyosarcoma'],
    broaderTitle: 'Broader sarcoma trials that may include uterine leiomyosarcoma.',
    clinicalTrialsSearch: 'https://clinicaltrials.gov/search?cond=uterine%20sarcoma&aggFilters=status:rec',
  },
  gtd: {
    slug: 'gestational-trophoblastic-disease',
    primary: ['choriocarcinoma', 'gestational trophoblastic'],
    broader: [] as string[],
    broaderTitle: '',
    clinicalTrialsSearch:
      'https://clinicaltrials.gov/search?cond=gestational%20trophoblastic&aggFilters=status:rec',
  },
} as const;

export type TrialLandingKey = keyof typeof TRIAL_TERMS;

export function trialKeyForSlug(slug: string): TrialLandingKey | null {
  const found = (Object.keys(TRIAL_TERMS) as TrialLandingKey[]).find(
    (key) => TRIAL_TERMS[key].slug === slug
  );
  return found ?? null;
}
