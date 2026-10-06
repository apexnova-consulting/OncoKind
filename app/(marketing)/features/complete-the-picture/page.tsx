import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';
import { SITE_ORIGIN } from '@/lib/pricing-config';

export const metadata: Metadata = {
  title: 'Complete the Picture',
  description:
    'See what your report says, what it does not mention, and the questions worth asking next. Educational support, not medical advice.',
  alternates: { canonical: `${SITE_ORIGIN}/features/complete-the-picture` },
  openGraph: {
    title: 'Complete the Picture',
    description: 'Questions for your care team based on what is and is not mentioned in uploaded reports.',
    url: `${SITE_ORIGIN}/features/complete-the-picture`,
    images: [{ url: `${SITE_ORIGIN}/og-home.png`, width: 1200, height: 630, alt: 'OncoKind Complete the Picture' }],
  },
};

export default function CompleteThePictureFeaturePage() {
  return (
    <FeatureDetailPage
      headline="See the picture, then ask better questions."
      intro="Complete the Picture shows what uploaded reports mention, which commonly discussed items are not in those files, and copy-ready questions for the care team. It does not tell you which test or treatment you need."
      primaryCtaLabel="Get Started Free"
      primaryCtaHref="/signup"
      secondaryCtaLabel="See all features"
      secondaryCtaHref="/features"
      example={{
        eyebrow: 'Fictional sample',
        title: 'Lung adenocarcinoma, Stage IIIA',
        body: 'The sample report mentions PD-L1 and says a molecular panel is pending. EGFR and ALK are not mentioned in what was uploaded. The output is a short list of questions, never a score.',
        bullets: [
          'Pieces found and open questions, never a grade',
          'Copy-ready scripts in plain language',
          'Records request letter the family prints and sends',
          'Adult cancers at launch, with a pediatric handoff message',
        ],
      }}
      sections={[
        {
          title: 'How it works',
          paragraphs: [
            'We remove names and other identifying details before analysis. Extraction fills a schema. Deterministic rules then mark items as found or not mentioned in what you uploaded.',
            'Low-confidence fields wait for you. Nothing is sent outside the app unless you review and approve it.',
          ],
        },
        {
          title: 'What it will not do',
          paragraphs: [
            'It will not say you are missing a test. It will not say you need a drug. Your care team decides what is right for you.',
            'Rules are guideline-informed educational prompts pending written licensing confirmation. Clinical review is required before production flags turn on.',
          ],
        },
        {
          title: 'Where it lives',
          paragraphs: [
            'Open it from the Cancer Profile, from the First 72 Hours testing task, and from Tools. Tracker items can be added to the Care Timeline.',
          ],
        },
      ]}
    />
  );
}
