import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'Doctor Prep Sheet',
  description:
    'Learn how the OncoKind Doctor Prep Sheet turns a report into a practical appointment guide with plain-language summaries and focused questions.',
};

export default function DoctorPrepSheetFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Walk Into Every Appointment Prepared"
      intro="The Doctor Prep Sheet turns an overwhelming pathology report into a one-page guide you can actually use in the room. It organizes the diagnosis, highlights the biomarker findings that matter most, and gives you a focused list of questions so you can spend your visit getting answers instead of trying to decode jargon on the fly."
      primaryCtaLabel="Generate Your Prep Sheet Free →"
      primaryCtaHref="/signup"
      example={{
        eyebrow: 'Sample output',
        title: 'Margaret T. — fictional case from the interactive demo',
        body: 'For Margaret T., a caregiver reviewing a Stage IIIA non-small cell lung cancer report, the prep sheet translates the diagnosis into plain English, explains why the PD-L1 score matters, and surfaces questions about immunotherapy, additional biomarkers, and trial options before the first oncology visit.',
        bullets: [
          'Plain-English summary of the diagnosis and stage',
          'Top biomarkers explained in caregiver-friendly language',
          'Questions to ask during the appointment',
          'Space for notes, instructions, and next steps during the visit',
        ],
      }}
      sections={[
        {
          title: 'What it contains',
          paragraphs: [
            'A good appointment guide is not a transcript of the report. It is a filter. The Doctor Prep Sheet pulls out the details that tend to change the conversation with the oncology team: diagnosis, stage, key biomarkers, major findings, and the questions those findings naturally raise. Instead of forcing a caregiver to decide what matters in real time, it gives structure before the visit starts.',
            'That means you walk in with a short list of clear priorities. You know which terms to ask about, which decisions may be coming, and which topics should not get lost if the appointment starts moving quickly. The result is more confidence, fewer missed questions, and a better record of what to follow up on afterward.',
          ],
          bullets: [
            'Diagnosis summary',
            'Key findings and biomarker notes',
            'Suggested oncologist questions',
            'Notes area for next steps and instructions',
          ],
        },
        {
          title: 'How it is generated',
          paragraphs: [
            'After you upload a pathology report, OncoKind extracts the medically relevant structure and turns it into a caregiver-friendly summary. The prep sheet is built from those findings, not from a generic template alone. That lets it reflect the actual report details while still staying readable and organized.',
            'The goal is not to replace the oncologist. The goal is to help you arrive ready for the conversation. When families understand the diagnosis more clearly ahead of time, they can use the visit for decision-making, clarification, and advocacy instead of spending the whole appointment trying to catch up.',
          ],
        },
        {
          title: 'Why caregivers use it',
          paragraphs: [
            'Cancer appointments often move faster than families expect. New terms, treatment options, and timelines can all show up at once. The Doctor Prep Sheet gives caregivers a practical way to stay grounded when the discussion gets dense. It helps you ask the right question at the right time, and it gives you a place to write down the answer while it is happening.',
            'That is especially valuable for first appointments, second opinions, and visits where treatment decisions may change. Even one page of structure can make the difference between leaving unsure what happened and leaving with a clearer sense of what comes next.',
          ],
        },
      ]}
    />
  );
}
