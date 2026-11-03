import { HOMEPAGE_PITCH } from '@/lib/board-run2';
import { STAGE_DESCRIPTIONS, STAGE_LABELS } from '@/lib/ok01';

export const JOURNEY_POSITIONING = HOMEPAGE_PITCH;

export const JOURNEY_STAGES = [
  {
    id: 'understand' as const,
    name: STAGE_LABELS.understand,
    summary: STAGE_DESCRIPTIONS.understand,
    href: '/features',
  },
  {
    id: 'prepare' as const,
    name: STAGE_LABELS.prepare,
    summary: STAGE_DESCRIPTIONS.prepare,
    href: '/features/doctor-prep-sheet',
  },
  {
    id: 'fight' as const,
    name: STAGE_LABELS.fight,
    summary: STAGE_DESCRIPTIONS.fight,
    href: '/features/insurance-denial-defense',
  },
  {
    id: 'plan' as const,
    name: STAGE_LABELS.plan,
    summary: STAGE_DESCRIPTIONS.plan,
    href: '/concierge',
  },
] as const;

export const JOURNEY_STAGE_HEADLINE = 'Four stages. One next step.';
