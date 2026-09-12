import type { Metadata } from 'next';
import { PriorAuthProLanding } from '@/components/marketing/PriorAuthProLanding';

export const metadata: Metadata = {
  title: 'OncoKind Prior Auth | AI Prior Authorization Engine for Care Facilities',
  description:
    'AI-powered prior authorization, step therapy exception letters, and continued stay defense for skilled nursing facilities, group homes, and rehab centers. Generate submission-ready letters in under 2 minutes.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'OncoKind Prior Auth — AI Prior Authorization for Care Facilities',
    description:
      'Stop losing 3 hours per auth. Generate complete prior auth requests, step therapy exception letters, and continued stay defenses in minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind Prior Auth — AI Prior Authorization for Care Facilities',
    description:
      'Stop losing 3 hours per auth. Generate complete prior auth requests, step therapy exception letters, and continued stay defenses in minutes.',
  },
};

export default function PriorAuthProPage() {
  return <PriorAuthProLanding />;
}
