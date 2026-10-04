import { FamilyClaimClient } from '@/components/family/FamilyClaimClient';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default function FamilyClaimPage() {
  if (!isFeatureEnabled('feature_oncokind_family')) redirect('/');
  return (
    <Suspense fallback={null}>
      <FamilyClaimClient />
    </Suspense>
  );
}
