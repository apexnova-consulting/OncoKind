export const NSGC_DIRECTORY_URL = 'https://findageneticcounselor.nsgc.org/';

export const FAMILY_INSIGHTS_META = {
  version: '1.0.0',
  source: 'OncoKind Family conversation guidance (education only)',
  clinicalReviewer: 'Pending named clinical reviewer',
  reviewDate: '2026-10-04',
  citations: [
    'National Cancer Institute. Genetics of Cancer. cancer.gov',
    'National Society of Genetic Counselors. Find a Genetic Counselor. findageneticcounselor.nsgc.org',
  ],
} as const;

const ASK_DOCTOR = 'Ask your doctor or a genetic counselor whether a genetics visit is useful. OncoKind does not estimate risk.';

export const FAMILY_RULES: Record<string, string> = {
  breast: `Some breast cancers can run in families. ${ASK_DOCTOR}`,
  ovarian: `Ovarian cancer in relatives is a reason to ask about genetics. ${ASK_DOCTOR}`,
  colorectal: `Colorectal cancer in relatives is a reason to share family history with the care team. ${ASK_DOCTOR}`,
  endometrial: `Endometrial cancer in relatives can matter for family history discussions. ${ASK_DOCTOR}`,
  prostate: `Prostate cancer in relatives can be part of a family history conversation. ${ASK_DOCTOR}`,
  pancreatic: `Pancreatic cancer in relatives is often discussed in genetics visits. ${ASK_DOCTOR}`,
  fallback: `Family history can inform questions for the care team. ${ASK_DOCTOR}`,
};

export const FAMILY_STARTERS = {
  sibling:
    'I have been gathering our family health history so we can ask the doctor better questions. This is not a prediction. Would you be willing to add what you know, or tell me if you would rather keep it private?',
  adultChild:
    'I started an OncoKind Family tree so we have one place for relative health notes. You can hide or delete your own information at any time. Use it to prepare questions for the doctor.',
};

export function insightForCancerType(cancerType?: string | null): string {
  const value = (cancerType ?? '').toLowerCase();
  if (value.includes('breast')) return FAMILY_RULES.breast;
  if (value.includes('ovarian')) return FAMILY_RULES.ovarian;
  if (value.includes('colon') || value.includes('colorectal')) return FAMILY_RULES.colorectal;
  if (value.includes('endometri')) return FAMILY_RULES.endometrial;
  if (value.includes('prostate')) return FAMILY_RULES.prostate;
  if (value.includes('pancrea')) return FAMILY_RULES.pancreatic;
  return FAMILY_RULES.fallback;
}

export function collectFamilyCopy(): string {
  return [...Object.values(FAMILY_RULES), FAMILY_STARTERS.sibling, FAMILY_STARTERS.adultChild].join('\n');
}
