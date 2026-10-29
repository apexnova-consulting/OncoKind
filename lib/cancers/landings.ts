import { isFeatureEnabled } from '@/lib/feature-flags';
import { HOMEPAGE_PITCH } from '@/lib/board-run2';

export type CancerLanding = {
  slug: string;
  name: string;
  sampleName: string;
  summary: string;
  questions: string[];
  conciergeHref: string;
  nciLabel: string;
  nciUrl: string;
  accessedOn: string;
};

export const TYPICAL_SECOND_OPINION_RECORDS = [
  'Pathology report and slides',
  'Imaging reports and discs',
  'Operative notes',
  'Treatment history',
  'Insurance card',
] as const;

export const TYPICAL_RECORDS_NOTE =
  'Typical; each center sets its own list. Confirm with the intake office before you send anything.';

export const CANCER_LANDINGS_DESCRIPTION =
  'Plain-language help for families facing vulvar cancer, rare ovarian subtypes, uterine sarcoma, and gestational trophoblastic disease.';

export const CANCER_LANDINGS: CancerLanding[] = [
  {
    slug: 'vulvar-cancer',
    name: 'Vulvar cancer',
    sampleName: 'Rosemarie N.',
    summary:
      'A fictional sample family after a vulvar cancer report. OncoKind helps you understand the report, prepare questions, and handle paperwork when you want it handled.',
    questions: [
      'What type of vulvar cancer does this report name, and what does it not name?',
      'What does the reported stage mean for the next visit, in plain language?',
      'Should we ask about HPV or p16 results, and what would those results change in the conversation?',
      'If PD-L1 or other markers are listed, what should we ask they mean for the plan?',
      'Who on the care team should we ask about imaging, surgery, radiation, or medical oncology next?',
      'What records does a new center usually need if we seek a second opinion?',
      'Which symptoms or changes should we call the clinic about before the next appointment?',
      'Are there clinical trials we should ask about, and who helps us check eligibility?',
    ],
    conciergeHref: '/concierge',
    nciLabel: 'National Cancer Institute, vulvar cancer',
    nciUrl: 'https://www.cancer.gov/types/vulvar',
    accessedOn: 'October 29, 2026',
  },
  {
    slug: 'rare-ovarian',
    name: 'Rare ovarian subtypes',
    sampleName: 'Elena P.',
    summary:
      'A fictional sample family after a rare ovarian subtype report. These pages prepare questions. They do not recommend a treatment path.',
    questions: [
      'What exact subtype does this report name, and how is it different from more common ovarian cancers?',
      'Has a gynecologic oncologist reviewed this pathology, or should we ask for that review?',
      'What biomarker or genetic tests, if any, should we ask whether they were done or still pending?',
      'How should we ask the team to explain what this subtype means for surgery versus medical treatment?',
      'What would a second-opinion packet usually include for a rare ovarian subtype?',
      'If records are delayed, who follows up with pathology and imaging, and how do we track it?',
      'Should we ask whether a tumor board or specialty center review is appropriate?',
      'What questions help us understand fertility, menopause, or long-term follow-up if those topics apply?',
    ],
    conciergeHref: '/concierge',
    nciLabel: 'National Cancer Institute, ovarian cancer',
    nciUrl: 'https://www.cancer.gov/types/ovarian',
    accessedOn: 'October 29, 2026',
  },
  {
    slug: 'uterine-sarcoma',
    name: 'Uterine sarcoma',
    sampleName: 'Camille R.',
    summary:
      'A fictional sample family after a uterine sarcoma report. Use OncoKind to see the next step and, if you want, let Concierge collect records.',
    questions: [
      'Which uterine sarcoma subtype does this report name, and how sure is that diagnosis?',
      'Should we ask whether a sarcoma-experienced pathologist has reviewed the slides?',
      'What imaging has been done, and what should we ask is still needed before a treatment plan is discussed?',
      'How do we ask the team to explain surgery, radiation, or medicine options without asking them to pick for us?',
      'What records and slides does a sarcoma or gynecologic oncology center usually request?',
      'How do we keep a timeline of appointments, pathology addenda, and results?',
      'What side effects or warning signs should we ask the clinic about after the visit?',
      'Are there trials for this subtype we should ask the team to look up with us?',
    ],
    conciergeHref: '/concierge',
    nciLabel: 'National Cancer Institute, uterine sarcoma',
    nciUrl: 'https://www.cancer.gov/types/uterine/patient/uterine-sarcoma-treatment-pdq',
    accessedOn: 'October 29, 2026',
  },
  {
    slug: 'gestational-trophoblastic-disease',
    name: 'Gestational trophoblastic disease',
    sampleName: 'Priya S.',
    summary:
      'A fictional sample family after a gestational trophoblastic disease report. OncoKind is educational preparation, not medical advice.',
    questions: [
      'Which form of gestational trophoblastic disease does this report name?',
      'What follow-up lab (such as hCG) should we ask the care team to explain, including how often it is checked?',
      'Who on the team coordinates monitoring, and what should we ask about missed or delayed results?',
      'If we change centers, what records and lab history does the new team usually need?',
      'What questions help us understand whether further treatment is being discussed, without asking OncoKind to decide?',
      'How should we ask about pregnancy timing, contraception, or future fertility if those topics apply?',
      'What symptoms should we call the clinic about between visits?',
      'Where do we start if we want someone to gather records and submit an intake packet for us?',
    ],
    conciergeHref: '/concierge',
    nciLabel: 'National Cancer Institute, gestational trophoblastic disease',
    nciUrl: 'https://www.cancer.gov/types/gestational-trophoblastic',
    accessedOn: 'October 29, 2026',
  },
];

export function cancerLandingBySlug(slug: string): CancerLanding | undefined {
  return CANCER_LANDINGS.find((item) => item.slug === slug);
}

export function isRareWomensFramingOn(): boolean {
  return isFeatureEnabled('rare_womens_cancers_framing');
}

export const RARE_WOMENS_HERO_LINE =
  "Built first for families facing rare women's cancers, and useful for every diagnosis.";

export const CANCER_LANDINGS_PITCH = HOMEPAGE_PITCH;
