import { PriorAuthProLanding } from '@/components/marketing/PriorAuthProLanding';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'KindAuth by OncoKind',
  absoluteTitle: 'KindAuth by OncoKind | Prior Authorization for Care Facilities',
  description:
    'KindAuth drafts prior authorization requests, step-therapy exception letters with state statute citations, and continued-stay appeals for care teams.',
  path: '/prior-auth-pro',
});

export default function PriorAuthProPage() {
  return (
    <>
      <FunnelPageView event="prior_auth_pro_view" />
      <PriorAuthProLanding />
    </>
  );
}
