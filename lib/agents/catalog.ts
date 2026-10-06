import { hasCaregiverAccess, type PlanId } from '@/lib/pricing-config';

export const AGENT_CATALOG_ROWS: Array<{
  id: string;
  name: string;
  cells: Record<'free' | 'caregiver' | 'advocate' | 'professional', string>;
  href: string;
  desc: string;
  tag: string;
}> = [
  {
    id: 'complete_the_picture',
    name: 'Complete the Picture',
    href: '/features/complete-the-picture',
    desc: 'Complete the Picture. See what your report says, what it does not mention, and the questions worth asking next.',
    tag: 'Free summary',
    cells: {
      free: 'Summary plus top 2 questions',
      caregiver: 'All questions, tracker, PDF, letters',
      advocate: 'All questions, tracker, PDF, letters',
      professional: 'Multi-patient view, branded PDFs',
    },
  },
  {
    id: 'access_agent',
    name: 'Access Agent',
    href: '/features/access-agent',
    desc: 'Access Agent. Find out what getting to a trial or specialist may really cost, and where to look for help.',
    tag: 'Free estimate',
    cells: {
      free: 'Estimate plus top 3 programs',
      caregiver: 'All matches, packet PDFs, basic tracker',
      advocate: 'Full tracker and reminders',
      professional: 'Full tracker, multi-patient',
    },
  },
  {
    id: 'voice_call_for_me',
    name: 'Call for me (beta, invite only)',
    href: '/voice-beta',
    desc: 'A scoped, user-approved phone call tool for process questions only. No patient information on calls.',
    tag: 'Invite only',
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Metered beta',
      professional: 'Metered beta',
    },
  },
];

export function agentMinPlanFor(featureId: string): PlanId | 'free' {
  if (featureId === 'voice_call_for_me') return 'advocate';
  return 'free';
}

export { hasCaregiverAccess };
