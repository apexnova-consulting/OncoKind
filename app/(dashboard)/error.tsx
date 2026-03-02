'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold text-slate-900">Something went wrong</h2>
      <p className="mt-2 text-slate-600">
        An error occurred in the dashboard. You can try again.
      </p>
      <Button className="mt-4" onClick={reset}>Try again</Button>
    </div>
  );
}
