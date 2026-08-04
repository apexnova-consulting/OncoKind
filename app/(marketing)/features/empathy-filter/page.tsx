import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'The Empathy Filter',
  description:
    'OncoKind\'s Empathy Filter transforms clinical language into compassionate, plain-English communication — helping caregivers and patients understand difficult information without losing the facts.',
};

export default function EmpathyFilterFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Hear the Facts. Feel Heard."
      intro="Medical reports are written for clinicians. The Empathy Filter translates that clinical language into plain English that doesn't strip out the truth — it just removes the unnecessary coldness. So you understand exactly what's happening, without feeling alone in the room when you read it."
      primaryCtaLabel="Try the Empathy Filter Free →"
      primaryCtaHref="/signup"
      example={{
        eyebrow: 'Sample output',
        title: 'Margaret T. — fictional case from the interactive demo',
        body: "A pathology report that stated \"poorly differentiated adenocarcinoma with lymphovascular invasion\" became: \"The cancer cells look quite different from normal lung cells, which means it's more aggressive. It has begun to spread into nearby blood and lymph vessels — which is why acting quickly matters.\" The facts are preserved. The meaning is accessible.",
        bullets: [
          'Clinical terms explained in plain, honest language',
          'Emotional tone calibrated — informative, not alarming',
          'No information removed or sugar-coated',
          'Gives caregivers language to use when talking to family',
        ],
      }}
      sections={[
        {
          title: 'Why language matters in a cancer diagnosis',
          paragraphs: [
            'The moment a family receives a diagnosis, the clinical language in the room can feel like a wall. Terms like "lymphovascular invasion," "poorly differentiated," or "metastatic burden" are precise medical descriptions — but to a caregiver hearing them for the first time, they land without context or compassion.',
            'The Empathy Filter does not remove that information. It adds a layer of accessible translation so the facts can actually be understood and processed — not just heard and feared.',
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
            'Upload or paste a section of a medical report. The Empathy Filter reads the clinical language and produces a plain-English version that retains every important fact — diagnosis, stage, findings, implications — but replaces the jargon with language a non-clinician can absorb.',
            'You can copy the translated version, share it with family, or use it as a starting point for conversations with the care team. Every output includes a note reminding you it is informational, not medical advice.',
          ],
        },
      ]}
    />
  );
}
