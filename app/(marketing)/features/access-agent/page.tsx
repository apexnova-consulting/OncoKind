import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';
import { SITE_ORIGIN } from '@/lib/pricing-config';

export const metadata: Metadata = {
  title: 'Access Agent',
  description: 'Find out what getting to a trial or specialist may really cost, and where to look for help.',
  alternates: { canonical: `${SITE_ORIGIN}/features/access-agent` },
  openGraph: {
    title: 'Access Agent',
    description: 'Cost ranges, verified assistance programs, and application tracking. Estimate only, not financial advice.',
    url: `${SITE_ORIGIN}/features/access-agent`,
    images: [{ url: `${SITE_ORIGIN}/og-home.png`, width: 1200, height: 630, alt: 'OncoKind Access Agent' }],
  },
};

export default function AccessAgentFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Plan how to get there."
      intro="Once a trial, second opinion, or distant specialist is a real option, Access Agent estimates the practical burden and matches assistance programs. Families submit applications themselves."
      primaryCtaLabel="Get Started Free"
      primaryCtaHref="/signup"
      secondaryCtaLabel="See all features"
      secondaryCtaHref="/features"
      example={{
        eyebrow: 'What you see',
        title: 'A range, not a promise',
        body: 'Travel, lodging, meals, caregiver travel, and optional lost work days stay visible. Program cards show last verified dates and never promise funds.',
        bullets: [
          'Estimate only, not financial advice',
          'Deterministic likely, maybe, or not eligible bands',
          'Writes into the Live Financial Aid Tracker when that plan is on',
          'No sponsor influence, referral fees, or ads',
        ],
      }}
      sections={[
        {
          title: 'Where it starts',
          paragraphs: [
            'Use Plan how to get there on a trial card, in Second Opinion Mode, from First 72 Hours money and work tasks, or open it under Tools.',
          ],
        },
        {
          title: 'Programs we own as an asset',
          paragraphs: [
            'The assistance catalog is versioned and re-verified on a 90-day cadence. Seed records ship as unverified until the content team completes review.',
          ],
        },
        {
          title: 'Call for me',
          paragraphs: [
            'Invite-only beta on Advocate Plan and Professional. Process questions only. No patient name, date of birth, or diagnosis is spoken. Production calling stays off until counsel approves a vendor.',
          ],
        },
      ]}
    />
  );
}
