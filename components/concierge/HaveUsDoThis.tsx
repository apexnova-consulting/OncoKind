'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { haveUsDoThisLabel } from '@/lib/ok01';
import { track } from '@/lib/analytics';

export function HaveUsDoThis({ source }: { source: 'first_72' | 'complete_the_picture' | 'second_opinion' }) {
  if (!isFeatureEnabled('have_us_do_this')) return null;
  const href = `/concierge/start?source=${source}`;
  return (
    <Button asChild>
      <Link
        href={href}
        onClick={() => track('have_us_do_this_click', { source })}
      >
        {haveUsDoThisLabel()}
      </Link>
    </Button>
  );
}
