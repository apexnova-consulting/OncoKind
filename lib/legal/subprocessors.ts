import { CONCIERGE_RETENTION_DAYS } from '@/lib/legal/retention';

export type Subprocessor = {
  service: string;
  purpose: string;
  data: string;
  envKeys: string[];
};

export const SUBPROCESSORS: Subprocessor[] = [
  {
    service: 'Anthropic',
    purpose: 'Report analysis and plain-English generation',
    data: 'Report text during processing. Not used to train AI models.',
    envKeys: ['ANTHROPIC_API_KEY'],
  },
  {
    service: 'Vercel',
    purpose: 'Application hosting and server runtime',
    data: 'Encrypted application and request data needed to operate the service',
    envKeys: ['VERCEL', 'VERCEL_ENV'],
  },
  {
    service: 'Supabase',
    purpose: 'Database, authentication, and secure storage',
    data: 'Encrypted user records, generated summaries, Concierge case files, and account data',
    envKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  },
  {
    service: 'Resend',
    purpose: 'Transactional email delivery',
    data: 'Email address and account-related messaging content',
    envKeys: ['RESEND_API_KEY'],
  },
  {
    service: 'Stripe',
    purpose: 'Subscription billing, Concierge one-time payments, and payment processing',
    data: 'Payment information handled within Stripe checkout flows',
    envKeys: ['STRIPE_SECRET_KEY'],
  },
  {
    service: 'Calendly',
    purpose: 'Demo and Professional sales scheduling',
    data: 'Name, email, and scheduling details you enter on the booking page',
    envKeys: [],
  },
  {
    service: 'Google Analytics',
    purpose: 'Optional site-usage measurement after cookie consent',
    data: 'Page views and events. No report text, diagnoses, or Concierge records.',
    envKeys: ['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
  },
  {
    service: 'Statuspage (status.oncokind.com)',
    purpose: 'Public uptime and incident status',
    data: 'No customer health information',
    envKeys: [],
  },
  {
    service: 'Maps distance (optional, when configured)',
    purpose: 'Travel time and distance for Access Agent estimates',
    data: 'Origin and destination points only. No names or diagnoses.',
    envKeys: ['GOOGLE_MAPS_API_KEY', 'MAPBOX_ACCESS_TOKEN'],
  },
  {
    service: 'Call for me voice vendor',
    purpose: 'Invite-only process calls, only after a signed authorization and a human-approved script',
    data: `Call purpose, approved script, and a recording if all-party consent is given. Same ${CONCIERGE_RETENTION_DAYS}-day Concierge retention. No production vendor is live yet.`,
    envKeys: ['FEATURE_VOICE_PRODUCTION_CALLS'],
  },
  {
    service: 'Fax, print, and e-sign vendors',
    purpose: 'Records requests and authorization packets for Concierge, when those vendors are contracted',
    data: 'Only the minimum needed to send an approved request',
    envKeys: [],
  },
];

export function subprocessorsForTrustPage() {
  return SUBPROCESSORS.map(({ service, purpose, data }) => ({ service, purpose, data }));
}
