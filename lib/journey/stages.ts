import { HOMEPAGE_PITCH } from '@/lib/board-run2';

export const JOURNEY_POSITIONING = HOMEPAGE_PITCH;

export const JOURNEY_STAGES = [
  {
    id: 'understand',
    name: 'Understand',
    summary: 'See what the report says, what it does not say, and the first 72 hours.',
    href: '/features',
  },
  {
    id: 'prepare',
    name: 'Prepare',
    summary: 'Questions before the visit, a check-in after, and a living timeline.',
    href: '/features/doctor-prep-sheet',
  },
  {
    id: 'fight',
    name: 'Fight',
    summary: 'Decode a denial, estimate travel, and find assistance programs.',
    href: '/features/insurance-denial-defense',
  },
  {
    id: 'plan',
    name: 'Plan ahead',
    summary: 'Trials, family history, second opinions, or Concierge when you want it handled.',
    href: '/concierge',
  },
] as const;

export const JOURNEY_STAGE_HEADLINE = 'Four stages. One next step.';
