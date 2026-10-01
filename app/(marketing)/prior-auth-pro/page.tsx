import type { Metadata } from 'next';
import { PriorAuthProLanding } from '@/components/marketing/PriorAuthProLanding';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';

export const metadata: Metadata = {
  title: 'KindAuth Pro | Prior Authorization for Care Facilities',
  description:
    'KindAuth Pro drafts prior authorization requests, step-therapy exception letters with state statute citations, and continued-stay appeals for care teams.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'KindAuth Pro — Prior Authorization for Care Facilities',
    description:
      'For care teams: draft prior authorization requests, step-therapy exception letters with state statute citations, and continued-stay appeals in minutes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KindAuth Pro — Prior Authorization for Care Facilities',
    description:
      'For care teams: draft prior authorization requests, step-therapy exception letters with state statute citations, and continued-stay appeals in minutes.',
  },
};

export default function PriorAuthProPage() {
  return (
    <>
      <FunnelPageView event="prior_auth_pro_view" />
      <PriorAuthProLanding />
    </>
  );
}
