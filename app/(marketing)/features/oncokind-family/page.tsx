import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'OncoKind Family',
  description:
    'Invite relatives, map family history, and prepare for genetic counseling conversations together.',
};

export default function OncoKindFamilyFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Bring the family into the same picture."
      intro="OncoKind Family lets you invite relatives, map who is in the circle, and keep genetic counseling prep in one shared place. It is built for the people sitting beside the patient, not for a clinic pedigree workflow."
      primaryCtaLabel="Get Started Free"
      primaryCtaHref="/signup"
      secondaryCtaLabel="See all features"
      secondaryCtaHref="/features"
      example={{
        eyebrow: 'What families use it for',
        title: 'A shared tree, not a medical record dump',
        body: 'Relatives can claim an invite, add what they know, and keep sensitive details hidden until someone is ready. Caregiver Pro adds a Genetic Counseling Prep Sheet PDF you can take into the appointment.',
        bullets: [
          'Tree and invites on Free',
          'Hidden rows stay private until claimed',
          'Genetic counseling PDF on Caregiver Pro',
          'Written without pressure language or fear framing',
        ],
      }}
      sections={[
        {
          title: 'Why a family tree belongs here',
          paragraphs: [
            'Cancer conversations rarely stay with one person. Siblings, adult children, and partners all need a way to stay oriented without forwarding the same email thread.',
            'OncoKind Family is a coordination layer. It helps you see who has been invited, who has claimed a seat, and what questions to bring if genetic counseling is on the table.',
          ],
        },
        {
          title: 'Privacy stays in your control',
          paragraphs: [
            'Some relatives are not ready to be visible. Hidden members stay hidden from other relatives. The person who claims an invite can choose what they share.',
            'This is not a diagnostic pedigree tool and it is not a substitute for a genetics professional. It is a calmer way to organize the people who want to help.',
          ],
        },
        {
          title: 'How it connects to the rest of the product',
          paragraphs: [
            'The Cancer Profile and Doctor Prep Sheet stay focused on the current report. Family sits beside that work so the wider circle has a place to land.',
            'If you are also using the First 72 Hours checklist, inviting one other person is often the most useful early task.',
          ],
        },
      ]}
    />
  );
}
