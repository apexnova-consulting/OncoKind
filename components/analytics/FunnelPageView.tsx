'use client';

import { useEffect } from 'react';
import { captureUtmFromLocation, identifyAnalyticsUser, track, type FunnelEvent } from '@/lib/analytics';
import { createClient } from '@/lib/supabase-client';

export function FunnelPageView({
  event,
  extra,
}: {
  event: FunnelEvent;
  extra?: Record<string, string | number | boolean | undefined>;
}) {
  useEffect(() => {
    captureUtmFromLocation();
    track(event, extra);
    // extra is a small static payload per page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  return null;
}

export function IdentifyAnalyticsUser() {
  useEffect(() => {
    captureUtmFromLocation();
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      identifyAnalyticsUser(data.user?.id);
    });
  }, []);

  return null;
}
