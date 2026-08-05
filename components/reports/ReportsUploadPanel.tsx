'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { JourneyUploadCard } from '@/components/care/JourneyUploadCard';

export function ReportsUploadPanel({
  reportCount = 0,
  isFree = false,
}: {
  reportCount?: number;
  isFree?: boolean;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-accent">Report Upload & Cancer Profile</h2>
          <p className="mt-1 text-sm text-slate-600">
            Upload your pathology PDF to generate an AI-powered report analysis.
          </p>
        </div>
        <Button type="button" onClick={() => setOpen((v) => !v)}>
          {open ? 'Hide Upload Form' : 'Upload Medical Report'}
        </Button>
      </div>
      {open && (
        <div className="mt-4">
          <JourneyUploadCard reportCount={reportCount} isFree={isFree} />
        </div>
      )}
    </section>
  );
}
