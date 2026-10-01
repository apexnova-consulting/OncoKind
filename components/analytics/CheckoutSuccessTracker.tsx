'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureUtmFromLocation, identifyAnalyticsUser, track } from '@/lib/analytics';
import { createClient } from '@/lib/supabase-client';

export function CheckoutSuccessTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureUtmFromLocation();
    if (searchParams.get('checkout') !== 'success') return;
    const plan = searchParams.get('plan') === 'professional' ? 'professional' : 'care_advocacy_pro';
    track('subscription_started', { plan });
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      identifyAnalyticsUser(data.user?.id);
    });
  }, [searchParams]);

  return null;
}
