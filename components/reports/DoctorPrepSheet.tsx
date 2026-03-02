'use client';

import { Button } from '@/components/ui/button';

type Props = {
  isPro: boolean;
  reportSummary?: string;
  reportQuestions?: string[];
  reportFindings?: string[];
};

export function DoctorPrepSheet({ isPro, reportSummary, reportQuestions, reportFindings }: Props) {
  if (!isPro) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="font-medium text-slate-800">Download Doctor Prep Sheet</p>
        <p className="text-sm text-slate-600 mt-1">
          Upgrade to Pro to download a one-page prep sheet for your oncologist visit.
        </p>
        <Button className="mt-3" asChild>
          <a href="/dashboard/billing">Upgrade to Pro</a>
        </Button>
      </div>
    );
  }

  function download() {
    const content = [
      '# Doctor visit prep (TrialBridge)',
      '',
      '## Summary',
      reportSummary ?? '',
      '',
      '## Key points to discuss',
      ...(reportFindings ?? []).map((f) => `- ${f}`),
      '',
      '## Questions to ask',
      ...(reportQuestions ?? []).map((q) => `- ${q}`),
    ].join('\n');
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'doctor-prep-sheet.md';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="font-medium text-slate-800">Doctor Prep Sheet</p>
      <p className="text-sm text-slate-600 mt-1">
        One-page summary and questions for your appointment.
      </p>
      <Button className="mt-3" onClick={download}>
        Download
      </Button>
    </div>
  );
}
