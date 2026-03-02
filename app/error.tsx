'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
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
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
        <p className="text-slate-600 max-w-md">
          We couldn’t complete your request. This can happen with slow connections or temporary service issues.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
