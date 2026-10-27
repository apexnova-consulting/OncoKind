import { pageMetadata } from '@/lib/seo';
import { PartnerInterestForm } from '@/components/professional/PartnerInterestForm';

export const metadata = pageMetadata({
  title: 'Partner with OncoKind',
  description: 'Foundations and employers can sponsor Concierge cases. Counts only. No PHI on the partner dashboard.',
  path: '/professional/partner',
});

export default function ProfessionalPartnerPage() {
  return <PartnerInterestForm />;
}
