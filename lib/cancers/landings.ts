import { isFeatureEnabled } from '@/lib/feature-flags';
import { HOMEPAGE_PITCH } from '@/lib/board-run2';

export type CancerLanding = {
  slug: string;
  name: string;
  sampleName: string;
  summary: string;
  questions: string[];
  conciergeHref: string;
};

export const CANCER_LANDINGS: CancerLanding[] = [
  {
    slug: 'vulvar-cancer',
    name: 'Vulvar cancer',
    sampleName: 'Rosemarie N.',
    summary:
      'A fictional sample family after a vulvar cancer report. OncoKind helps you understand the report, prepare questions, and handle paperwork when you want it handled.',
    questions: [
      'What does this report name, and what does it not name?',
      'Who on the care team should we ask about next tests?',
      'What records does a new center usually need?',
    ],
    conciergeHref: '/concierge',
  },
  {
    slug: 'rare-ovarian',
    name: 'Rare ovarian subtypes',
    sampleName: 'Elena P.',
    summary:
      'A fictional sample family after a rare ovarian subtype report. These pages prepare questions. They do not recommend a treatment path.',
    questions: [
      'How do we ask the care team to explain this subtype in plain language?',
      'What would a second opinion packet usually include?',
      'If records are delayed, who follows up and how do we track it?',
    ],
    conciergeHref: '/concierge',
  },
  {
    slug: 'uterine-sarcoma',
    name: 'Uterine sarcoma',
    sampleName: 'Camille R.',
    summary:
      'A fictional sample family after a uterine sarcoma report. Use OncoKind to see the next step and, if you want, let Concierge collect records.',
    questions: [
      'What should we ask about the pathology details before the next visit?',
      'How do we keep a timeline of appointments and results?',
      'What paperwork does Concierge handle versus what the care team decides?',
    ],
    conciergeHref: '/concierge',
  },
  {
    slug: 'gestational-trophoblastic-disease',
    name: 'Gestational trophoblastic disease',
    sampleName: 'Priya S.',
    summary:
      'A fictional sample family after a gestational trophoblastic disease report. OncoKind is educational preparation, not medical advice.',
    questions: [
      'What questions help us understand follow-up labs the care team may discuss?',
      'How do we ask about records if we change centers?',
      'Where do we start if we want someone to handle the forms?',
    ],
    conciergeHref: '/concierge',
  },
];

export function cancerLandingBySlug(slug: string): CancerLanding | undefined {
  return CANCER_LANDINGS.find((item) => item.slug === slug);
}

export function isRareWomensFramingOn(): boolean {
  return isFeatureEnabled('rare_womens_cancers_framing');
}

export const RARE_WOMENS_HERO_LINE =
  'Built first for families facing rare women cancers, then useful for every diagnosis.';

export const CANCER_LANDINGS_PITCH = HOMEPAGE_PITCH;
