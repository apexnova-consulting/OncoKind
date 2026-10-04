'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isFeatureEnabled } from '@/lib/feature-flags';

export function DiagnosisRecencyPrompt() {
  const params = useSearchParams();
  const [open, setOpen] = useState(params.get('welcome') === '1' && isFeatureEnabled('feature_first_72_hours'));
  if (!open) return null;

  return (
    <div className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-5 shadow-sm">
      <p className="font-semibold text-[var(--color-text-primary)]">Was this diagnosis recent?</p>
      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
        If you are in the first days after a diagnosis, the First 72 Hours checklist can walk you through records,
        testing questions, and appointment prep. There is no countdown clock.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/first-72-hours">Open First 72 Hours</Link>
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Not now
        </Button>
      </div>
    </div>
  );
}
