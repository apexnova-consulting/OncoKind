import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'First 72 Hours',
  description:
    'A calm, sequenced checklist for the first days after a cancer diagnosis. Core tasks are free on every OncoKind plan.',
};

export default function First72HoursFeaturePage() {
  return (
    <FeatureDetailPage
      headline="The first days after diagnosis, sequenced."
      intro="The First 72 Hours checklist is a calm plan for gathering records, preparing questions, and knowing what to do next. There is no countdown clock. Core tasks are free on every plan."
      primaryCtaLabel="Open the checklist"
      primaryCtaHref="/first-72-hours"
      secondaryCtaLabel="See all features"
      secondaryCtaHref="/features"
      example={{
        eyebrow: 'What you get',
        title: 'A sequenced plan instead of a blank search bar',
        body: 'Families often spend the first days bouncing between portals, printouts, and tabs. The checklist keeps the next right task visible: records to collect, questions to write down, and people to loop in.',
        bullets: [
          'Core checklist on Free',
          'Calendar, reminders, and PDF export on Caregiver Pro',
          'Written for caregivers, not clinicians',
          'No survival statistics or countdown language',
        ],
      }}
      sections={[
        {
          title: 'Why it exists',
          paragraphs: [
            'The hours after a diagnosis are noisy. Portals, paperwork, and well-meaning advice all arrive at once. A sequenced checklist helps you make progress without pretending this is an emergency timer.',
            'OncoKind keeps the tone practical. Collect the report. Write down questions. Bring a second person if you can. Those are the moves that help the first oncology visit go better.',
          ],
        },
        {
          title: 'How it works with the rest of OncoKind',
          paragraphs: [
            'When you upload a pathology report, the Cancer Profile and Doctor Prep Sheet give you language and questions. The First 72 Hours checklist tells you when to use them.',
            'That pairing is the point. Information without a sequence is still overwhelming. A sequence without the report is still guesswork.',
          ],
        },
        {
          title: 'What stays free',
          paragraphs: [
            'The core checklist is included on every plan. Caregiver Pro adds sync, reminders, and PDF export so you can print the list or share it with another family member.',
            'OncoKind is an educational preparation tool. It does not replace your oncology team, and it does not tell you what treatment to choose.',
          ],
        },
      ]}
    />
  );
}
