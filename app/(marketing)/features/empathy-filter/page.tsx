import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';
import { ROSEMARIE_SAMPLE } from '@/lib/sample-rosemarie';
import { pageMetadata } from '@/lib/seo';
import { EMPATHY_FILTER_POLICY } from '@/lib/legal/empathy';

export const metadata = pageMetadata({
  title: 'The Empathy Filter',
  description: EMPATHY_FILTER_POLICY.feature,
  path: '/features/empathy-filter',
});

export default function EmpathyFilterFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Hear the facts. Feel heard."
      intro={EMPATHY_FILTER_POLICY.feature}
      primaryCtaLabel="Try the Empathy Filter Free"
      primaryCtaHref="/signup"
      secondaryCtaLabel="See all features"
      secondaryCtaHref="/features"
      example={{
        eyebrow: 'Sample output',
        title: `${ROSEMARIE_SAMPLE.patientName}: fictional case from the interactive demo`,
        body: `A pathology report that stated "HPV-associated squamous cell carcinoma, p16-positive, PD-L1 CPS ≥10" became: "This is Stage IV vulvar squamous cell carcinoma. HPV-positive (p16+) status helps the care team understand how this cancer developed. A PD-L1 CPS of ≥10 is a finding to discuss when the team talks through immunotherapy." The facts are preserved. The meaning is accessible.`,
        bullets: [
          'Clinical terms explained in plain, honest language',
          'Emotional tone calibrated: informative, not alarming',
          'Diagnosis, stage, and biomarker facts stay. Survival statistics are never volunteered.',
          'Gives caregivers language to use when talking to family',
        ],
      }}
      sections={[
        {
          title: 'Why language matters in a cancer diagnosis',
          paragraphs: [
            'The moment a family receives a diagnosis, the clinical language in the room can feel like a wall. Terms like "lymphovascular invasion," "poorly differentiated," or "metastatic burden" are precise medical descriptions, but to a caregiver hearing them for the first time, they land without context or compassion.',
            'The Empathy Filter keeps the clinical facts. It never volunteers survival statistics. If you ask about prognosis, we point you back to your care team instead of guessing a personal number.',
          ],
          bullets: [
            'Preserves clinical accuracy',
            'Removes unnecessary jargon without simplifying prognosis',
            'Helps caregivers have informed conversations with family',
            'Supports emotional processing alongside factual understanding',
          ],
        },
        {
          title: 'How it works',
          paragraphs: [
            'Upload or paste a section of a medical report. The Empathy Filter reads the clinical language and produces a plain-English version that retains every important fact (diagnosis, stage, findings, implications) but replaces the jargon with language a non-clinician can absorb.',
            'You can copy the translated version, share it with family, or use it as a starting point for conversations with the care team. Every output includes a note reminding you it is informational, not medical advice.',
          ],
        },
      ]}
    />
  );
}
