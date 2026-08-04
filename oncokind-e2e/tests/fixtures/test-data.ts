/**
 * Central source of truth for test data used across the suite.
 *
 * Rewritten July 2026 against the LIVE site (www.oncokind.com) rather than
 * the original June QA guide — a lot changed (pricing, signup fields, the
 * waitlist closing, a new /features/* section). See ../SITE_REVIEW_FINDINGS.md
 * for the full diff and the bugs found along the way.
 */
import path from 'path';

export type Role = 'free' | 'pro' | 'advocate' | 'professional' | 'admin';

export interface TestUser {
  role: Role;
  email: string;
  password: string;
  storageState: string;
}

const authDir = path.join(__dirname, '..', '..', 'playwright', '.auth');

function requireEnv(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

// Step 1 of the original QA guide — the 5 seeded test accounts. Tier names
// and login mechanics are unchanged live; only the public marketing surface
// and signup form changed.
export const users: Record<Role, TestUser> = {
  free: {
    role: 'free',
    email: requireEnv('QA_FREE_EMAIL', 'qa-free@oncokind.com'),
    password: requireEnv('QA_FREE_PASSWORD', 'QAtest2026!'),
    storageState: path.join(authDir, 'free.json'),
  },
  pro: {
    role: 'pro',
    email: requireEnv('QA_PRO_EMAIL', 'qa-pro@oncokind.com'),
    password: requireEnv('QA_PRO_PASSWORD', 'QAtest2026!'),
    storageState: path.join(authDir, 'pro.json'),
  },
  advocate: {
    role: 'advocate',
    email: requireEnv('QA_ADVOCATE_EMAIL', 'qa-advocate@oncokind.com'),
    password: requireEnv('QA_ADVOCATE_PASSWORD', 'QAtest2026!'),
    storageState: path.join(authDir, 'advocate.json'),
  },
  professional: {
    role: 'professional',
    email: requireEnv('QA_PROFESSIONAL_EMAIL', 'qa-professional@oncokind.com'),
    password: requireEnv('QA_PROFESSIONAL_PASSWORD', 'QAtest2026!'),
    storageState: path.join(authDir, 'professional.json'),
  },
  admin: {
    role: 'admin',
    email: requireEnv('QA_ADMIN_EMAIL', 'qa-admin@oncokind.com'),
    password: requireEnv('QA_ADMIN_PASSWORD', 'QAtest2026!'),
    storageState: path.join(authDir, 'admin.json'),
  },
};

export const nonProfessionalRoles: Role[] = ['free', 'pro', 'advocate'];

// ── Routes ────────────────────────────────────────────────────────────────
// Confirmed live Aug 2026. /about, /resources, and /community now share the
// same public template as the rest of the marketing site (Finding #1 fixed).
export const routes = {
  home: '/',
  about: '/about',
  pricing: '/pricing',
  forProfessionals: '/professional',
  priorAuthPro: '/prior-auth-pro', // robots.txt blocks this — see finding #3
  learn: '/learn', // "Resources" nav target
  resources: '/resources', // DIFFERENT content than /learn, not a redirect/alias
  community: '/community',
  trust: '/trust',
  privacy: '/privacy',
  terms: '/terms',
  security: '/security', // orphaned — not linked from the footer
  support: '/support',
  waitlist: '/waitlist', // closed/retired — no longer a signup form
  mission: '/mission',
  signup: '/signup',
  login: '/login',
  // Successful login/signup lands on /journey (Aug 2026); /dashboard remains
  // reachable from the authenticated app nav ("Home").
  postLogin: '/journey',
  dashboard: '/dashboard',
  dashboardBilling: '/dashboard/billing',
  dashboardSecurity: '/dashboard/security',
  quietRoom: '/quiet-room',
  journey: '/journey',
  journeySecondOpinion: '/journey/second-opinion',
  journeyTrials: '/journey/trials',
  journeyTimeline: '/journey/timeline',
  journeyInsuranceSupport: '/journey/insurance-support',
  journeyFinancialHelp: '/journey/financial-help',
  journeyGoalsOfCare: '/journey/goals-of-care',
  priorAuthHub: '/prior-auth',
  adminOrganizations: '/admin/organizations',
  adminCommunity: '/admin/community',
  // /features/* sub-pages linked from the homepage feature grid + footer
  featureDoctorPrepSheet: '/features/doctor-prep-sheet',
  featureClinicalTrialMatching: '/features/clinical-trial-matching',
  featureInsuranceDenialDefense: '/features/insurance-denial-defense',
  featureEmpathyFilter: '/features/empathy-filter', // confirmed 404 live — finding #2
} as const;

// Main nav labels (home, pricing, professional, about, resources, community,
// learn, trust, privacy, terms, support, security, mission, signup, login,
// waitlist). "Prior Auth Engine" is no longer in the public nav anywhere —
// including /professional — as of Aug 2026.
export const newTemplateNavLabels = [
  'How It Works',
  'Features',
  'Pricing',
  'For Professionals',
  'Community',
  'Resources',
  'Log In',
  'Get Started Free',
] as const;

// Site footer column labels (rendered as <p>, not headings).
export const newTemplateFooterColumnLabels = [
  'Product',
  'Platform',
  'Company',
  'For Professionals',
  'Legal',
] as const;

export const newTemplateFooterColumnCount = newTemplateFooterColumnLabels.length;

// Section 1 homepage feature grid — 10 cards as of Aug 2026 (Goals of Care
// Prep Sheet added; was 9 in July).
export const homepageFeatureCards = [
  { name: 'Doctor Prep Sheet', href: routes.featureDoctorPrepSheet },
  { name: 'Clinical Trial Matching', href: routes.featureClinicalTrialMatching },
  { name: 'Insurance Denial Defense', href: routes.featureInsuranceDenialDefense },
  { name: 'The Empathy Filter', href: routes.featureEmpathyFilter }, // 404s live
  { name: 'Second Opinion Mode', href: routes.journeySecondOpinion },
  { name: 'Financial Help', href: routes.journeyFinancialHelp },
  { name: 'Care Timeline', href: routes.journeyTimeline },
  { name: 'Community Access', href: routes.community },
  { name: 'Prior Authorization Engine', href: routes.priorAuthPro },
  { name: 'Goals of Care Prep Sheet', href: routes.journeyGoalsOfCare },
] as const;

// Pricing (confirmed live). Advocate deliberately has no `plan` param below —
// that's the live behavior (finding #5), not a typo. The test asserts the
// INTENDED param and will fail until fixed.
export const pricingTiers = {
  free: { name: 'Free', price: '$0', cta: 'Get Started Free', href: routes.signup },
  pro: { name: 'Caregiver Pro', price: '$39', cta: 'Start Caregiver Pro', href: '/signup?plan=pro' },
  advocate: {
    name: 'Advocate Plan',
    price: '$49',
    cta: 'Start Advocate Plan',
    href: '/signup?plan=advocate', // intended — live site currently omits the param
    badge: 'Most Popular',
  },
  professional: {
    name: 'Professional',
    price: '$999',
    cta: 'Book a Demo',
    href: 'https://calendly.com/oncokind-support',
  },
} as const;

// Pricing page's feature-comparison table. Counted directly from the live
// table July 2026 — recount if the page changes, this is a brittle number by
// nature.
export const pricingComparisonRowCount = 18;

// Pricing page FAQ (5 questions, confirmed live). Site uses straight
// apostrophes — curly quotes will not match getByText.
export const pricingFaqQuestions = [
  "Is my loved one's medical report stored on OncoKind's servers?",
  'Is OncoKind giving medical advice?',
  'What cancers does OncoKind support?',
  'Can I cancel anytime?',
  'Is there a discount for financial hardship?',
] as const;

// Homepage FAQ — a SEPARATE 5-question FAQ from the pricing page's FAQ.
export const homepageFaqQuestions = [
  'Is this medical advice? Can I trust what OncoKind tells me?',
  "What happens to my loved one's medical records after I upload them?",
  "I'm not very tech-savvy. Is this hard to use?",
  'My oncologist is very thorough. Do I really need this?',
  "What does 'free' actually include?",
] as const;

// Signup form — now 3 fields (Full name added since the June guide).
export const signupFormFields = ['Full name', 'Email', 'Password'] as const;

export function newSignupUser() {
  return {
    fullName: 'QA Playwright Test',
    email: `qa-signup-${Date.now()}@oncokind.com`,
    password: 'StrongPass!2026',
  };
}

// Section 6 sample data — Prior Authorization Request wizard (unchanged;
// this surface lives behind auth and wasn't part of the public-site diff).
export const priorAuthCase = {
  patientRef: 'Room 14B',
  facilityName: 'Test Regional Medical Center',
  state: 'PA',
  physician: 'Dr. Sarah Chen',
  payer: 'Aetna',
  plan: 'Aetna Choice POS II',
  memberIdLast4: '4821',
  medication: 'Keytruda 200mg',
  icd10: 'C34.10',
  diagnosis: 'Lung Cancer',
};

export const stepTherapyCase = {
  triedMedications: ['Carboplatin', 'Pemetrexed'],
  expectedStatute: 'Pennsylvania Act 2018-146',
};

export const continuedStayCase = {
  admissionDate: '2026-07-01',
  functionalStatus: 'Patient remains dependent for all ADLs, unable to ambulate without maximal assist.',
  dischargeBarriers: 'No safe discharge destination identified; home has stairs, patient non-weight-bearing.',
  expectedLanguageFragment: 'meets criteria for skilled care',
};

export const sampleDenialLetterText = `
Dear Patient, your request for Keytruda (pembrolizumab) has been denied.
Reason: Step therapy not completed. Denial Code: CO-50. Please contact
Member Services to discuss appeal options within 30 days of this notice.
`.trim();

export const stripeTestCard = {
  number: requireEnv('STRIPE_TEST_CARD_NUMBER', '4242424242424242'),
  expiry: requireEnv('STRIPE_TEST_CARD_EXPIRY', '12/34'),
  cvc: requireEnv('STRIPE_TEST_CARD_CVC', '123'),
};
