import type { Metadata } from 'next';
import { FeatureDetailPage } from '@/components/marketing/FeatureDetailPage';

export const metadata: Metadata = {
  title: 'Clinical Trial Matching',
  description:
    'See how OncoKind matches clinical trials using diagnosis details, biomarkers, stage, and location so families know what to ask next.',
};

export default function ClinicalTrialMatchingFeaturePage() {
  return (
    <FeatureDetailPage
      headline="Find Trials You May Qualify For — Automatically"
      intro="Clinical trial search is one of the hardest parts of cancer research for families. The listings are dense, the eligibility language is technical, and it is not always obvious which details from the report actually matter. OncoKind narrows that search by organizing the inputs that usually shape fit first: biomarkers, stage, diagnosis, and location."
      primaryCtaLabel="See Your Matches →"
      primaryCtaHref="/signup"
      example={{
        eyebrow: 'Sample trial card',
        title: 'Margaret T. — sample NSCLC match',
        body: 'In the demo flow, Margaret T. sees a sample immunotherapy trial card that explains why PD-L1 expression, disease stage, and biomarker exclusions matter together. Instead of just showing a trial name, the result gives plain-language context she can bring into her first oncology appointment.',
        bullets: [
          'Why the trial may fit the profile',
          'Current study status',
          'Phase and sponsor information',
          'A ready-made question to bring to the oncologist',
        ],
      }}
      sections={[
        {
          title: 'How matching works',
          paragraphs: [
            'OncoKind starts with the details that usually filter the trial pool fastest: cancer type, stage, biomarker profile, and geography. Those inputs are used to pull public study records and organize them into a shorter list that is easier to review. The purpose is not to promise eligibility. It is to help families identify which studies are worth asking about next.',
            'This matters because trial research is rarely just about finding a keyword match. A treatment might sound relevant but depend on a biomarker the report does not show. Another study may be nearby but open only to patients at a different treatment stage. Good matching reduces noise and gives families a more realistic starting point.',
          ],
        },
        {
          title: 'What you see in the result',
          paragraphs: [
            'Each match is presented with the practical details caregivers tend to care about first: title, status, phase, sponsor, and location. OncoKind also highlights the plain-language reason the trial may be relevant. That context helps you move from “I found a study” to “I understand why this might matter for our case.”',
            'A useful trial result should also make the next step easier. That is why the workflow lets you add a trial-based question directly to your Doctor Prep Sheet. Instead of taking a screenshot and hoping you remember it later, you can carry the exact question into the appointment.',
          ],
        },
        {
          title: 'Why this helps in real appointments',
          paragraphs: [
            'Families often discover trials too late because the topic never makes it into the room. A shorter, clearer match list helps you raise the subject earlier. Even if a specific trial is not the right fit, it often opens the more important discussion: whether a clinical trial should be part of the plan at all, whether more biomarker testing is needed, or whether another center should review the case.',
            'OncoKind keeps the boundaries clear. Trial status can change, sites can close, and eligibility decisions belong with the treating team and the trial sponsor. The value here is clarity and preparation, not false certainty.',
          ],
        },
      ]}
    />
  );
}
