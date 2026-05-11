import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'Insurance Denial Defense',
  description:
    'Understand how OncoKind helps caregivers decode denials, organize an appeal, and prepare for escalation when cancer treatment coverage is delayed.',
};

export default function InsuranceDenialDefenseFeaturePage() {
  return (
    <FeatureDetailPage
      headline="A Denial Is Not the Final Word"
      intro="Insurance denials can stop care momentum at exactly the wrong moment. OncoKind helps families move from panic to structure by decoding the denial, outlining the appeal path, and generating a clean starting draft for the next conversation with the care team."
      primaryCtaLabel="Start Your Appeal →"
      primaryCtaHref="/signup"
      secondaryCtaLabel="Using OncoKind for your clients? Book a Professional demo →"
      secondaryCtaHref="https://calendly.com/oncokind-support"
      sections={[
        {
          title: 'What OncoKind generates',
          paragraphs: [
            'The insurance support workflow is designed to help you organize the appeal, not just react emotionally to the denial letter. Once a denial document is uploaded, OncoKind extracts the key reason code, explains it in plain language, and turns that information into a more practical case file.',
            'From there, the product helps generate the building blocks families usually need next: an appeal letter framework, guidance for a physician-led peer-to-peer review, and a checklist of escalation steps so the process does not stall after the first phone call.',
          ],
          bullets: [
            'Appeal letter framework',
            'Plain-English denial explanation',
            'Peer-to-peer review guidance',
            'Escalation checklist and next steps',
          ],
        },
        {
          title: 'Why structure matters',
          paragraphs: [
            'A denial letter often arrives when a family is already overwhelmed. The problem is not only the denial itself. It is the sudden need to understand deadlines, gather records, coordinate with the oncology office, and keep documentation straight under pressure. A structured workflow lowers the chance that something important gets lost.',
            'That is why OncoKind focuses on clarity first. Families need to know what the insurer is actually saying, what the medical team may need to send, and how to keep the appeal moving. Even when the final appeal requires a physician signature or outside legal review, better organization can save days of confusion.',
          ],
        },
        {
          title: 'Where the boundaries stay clear',
          paragraphs: [
            'OncoKind does not act as your attorney, your insurer, or your clinical team. Appeals rules vary by state, plan type, and employer arrangement, and final medical necessity decisions still belong with the treating physician and the plan reviewer. The workflow is designed to support the process, not replace licensed medical or legal judgment.',
            'That makes it especially useful for caregivers and patient advocates who need a faster way to get the denial into a workable format before they escalate. It helps you prepare for the next step with more confidence and less wasted motion.',
          ],
        },
      ]}
    />
  );
}
