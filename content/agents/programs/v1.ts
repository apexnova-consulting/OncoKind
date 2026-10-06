export type ProgramStatus = 'active' | 'paused' | 'closed' | 'unverified';

export type AssistanceProgram = {
  program_id: string;
  name: string;
  organization: string;
  benefit_types: Array<'travel' | 'lodging' | 'meals' | 'transportation' | 'caregiver' | 'other'>;
  eligibility: {
    cancer_types: string[];
    age_range: string | null;
    residence: string | null;
    income_rule: string | null;
    requires_trial_enrollment: boolean;
    requires_physician_referral: boolean;
    other: string | null;
  };
  application: {
    method: 'online' | 'phone' | 'email' | 'form';
    url: string;
    documents_needed: string[];
    deadline_rule: string | null;
  };
  funding_status_note: string | null;
  contact: { phone: string | null; email: string | null };
  last_verified_on: string;
  verified_by: string;
  next_verification_due: string;
  status: ProgramStatus;
  disclaimer: string;
};

const DISCLAIMER =
  'OncoKind does not receive payments or referral fees from this program. Sponsor-funded assistance is out of scope. This is educational matching only. We cannot promise funds or outcomes.';

export const ASSISTANCE_PROGRAMS: AssistanceProgram[] = [
  {
    program_id: 'lazarex-travel',
    name: 'Lazarex Cancer Foundation IMPACT',
    organization: 'Lazarex Cancer Foundation',
    benefit_types: ['travel', 'lodging'],
    eligibility: {
      cancer_types: ['any'],
      age_range: null,
      residence: 'United States',
      income_rule: 'Income and diagnosis documentation may be requested.',
      requires_trial_enrollment: true,
      requires_physician_referral: false,
      other: 'Focused on clinical trial access costs.',
    },
    application: {
      method: 'online',
      url: 'https://lazarex.org/',
      documents_needed: ['diagnosis letter', 'trial enrollment letter', 'proof of income'],
      deadline_rule: 'Apply as soon as a trial location is known.',
    },
    funding_status_note: 'Funding availability changes. Confirm on the organization site.',
    contact: { phone: '925-701-7653', email: null },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
  {
    program_id: 'lls-trial-travel',
    name: 'LLS clinical trial support resources',
    organization: 'Leukemia and Lymphoma Society',
    benefit_types: ['travel', 'other'],
    eligibility: {
      cancer_types: ['leukemia', 'lymphoma', 'myeloma', 'blood'],
      age_range: null,
      residence: null,
      income_rule: null,
      requires_trial_enrollment: false,
      requires_physician_referral: false,
      other: 'Blood cancer focus.',
    },
    application: {
      method: 'phone',
      url: 'https://www.lls.org/',
      documents_needed: ['diagnosis summary'],
      deadline_rule: null,
    },
    funding_status_note: null,
    contact: { phone: '800-955-4572', email: null },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
  {
    program_id: 'nmdp-trial-travel',
    name: 'NMDP trial travel grants',
    organization: 'NMDP',
    benefit_types: ['travel'],
    eligibility: {
      cancer_types: ['blood', 'transplant'],
      age_range: null,
      residence: null,
      income_rule: null,
      requires_trial_enrollment: true,
      requires_physician_referral: true,
      other: null,
    },
    application: {
      method: 'online',
      url: 'https://www.nmdp.org/',
      documents_needed: ['trial enrollment letter', 'physician referral'],
      deadline_rule: null,
    },
    funding_status_note: null,
    contact: { phone: '888-999-6743', email: null },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
  {
    program_id: 'acs-hope-lodge',
    name: 'American Cancer Society Hope Lodge and lodging partners',
    organization: 'American Cancer Society',
    benefit_types: ['lodging', 'transportation'],
    eligibility: {
      cancer_types: ['any'],
      age_range: null,
      residence: null,
      income_rule: null,
      requires_trial_enrollment: false,
      requires_physician_referral: true,
      other: 'Lodging during treatment away from home. Availability is local.',
    },
    application: {
      method: 'phone',
      url: 'https://www.cancer.org/',
      documents_needed: ['treatment schedule', 'physician referral'],
      deadline_rule: 'Ask as soon as a treatment location is set.',
    },
    funding_status_note: 'Rooms are limited and city-specific.',
    contact: { phone: '800-227-2345', email: null },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
  {
    program_id: 'chordoma-ctap',
    name: 'Chordoma Foundation Clinical Trial Assistance Program',
    organization: 'Chordoma Foundation',
    benefit_types: ['travel', 'lodging'],
    eligibility: {
      cancer_types: ['chordoma'],
      age_range: null,
      residence: null,
      income_rule: null,
      requires_trial_enrollment: true,
      requires_physician_referral: false,
      other: 'Chordoma-specific.',
    },
    application: {
      method: 'online',
      url: 'https://www.chordoma.org/',
      documents_needed: ['diagnosis letter', 'trial enrollment letter'],
      deadline_rule: null,
    },
    funding_status_note: null,
    contact: { phone: null, email: 'info@chordoma.org' },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
  {
    program_id: 'mgb-equity',
    name: 'Mass General Cancer Care Equity Program (example hospital program)',
    organization: 'Mass General Brigham',
    benefit_types: ['transportation', 'other'],
    eligibility: {
      cancer_types: ['any'],
      age_range: null,
      residence: 'New England patients treated at the center',
      income_rule: 'Hospital financial counseling may apply.',
      requires_trial_enrollment: false,
      requires_physician_referral: true,
      other: 'Hospital program. Confirm locally. Not a national fund.',
    },
    application: {
      method: 'form',
      url: 'https://www.massgeneral.org/cancer-center',
      documents_needed: ['insurance card', 'treatment summary'],
      deadline_rule: null,
    },
    funding_status_note: 'Internal hospital process. Families should ask the social work team.',
    contact: { phone: null, email: null },
    last_verified_on: '2026-07-08',
    verified_by: 'seed_pending_content_ops',
    next_verification_due: '2026-10-06',
    status: 'unverified',
    disclaimer: DISCLAIMER,
  },
];

export function collectProgramCopy(): string {
  return ASSISTANCE_PROGRAMS.map((program) =>
    [program.name, program.eligibility.other, program.disclaimer, program.funding_status_note].filter(Boolean).join('\n')
  ).join('\n');
}
