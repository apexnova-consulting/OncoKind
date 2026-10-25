import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Access Agent',
  description: 'Find out what getting to a trial or specialist may really cost, and where to look for help.',
  path: '/features/access-agent',
  imageAlt: 'OncoKind Access Agent',
});

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
          title: 'Programs we show',
          paragraphs: [
            'Each program card shows when it was last checked and a plain disclaimer. Matches never promise funds. Families submit applications themselves.',
          ],
        },
        {
          title: 'Copay help',
          paragraphs: [
            'For copay assistance, we link out to FundFinder rather than building a second copay tracker. Our own assistance work stays on travel, lodging, and caregiver costs.',
          ],
        },
      ]}
    />
  );
}
