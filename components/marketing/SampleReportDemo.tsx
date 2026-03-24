'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CancerProfileSummaryCard } from '@/components/care/CancerProfileSummaryCard';

function buildSamplePrepSheet(): string {
  return [
    'OncoKind - Doctor Prep Sheet',
    '',
    'Sample Report - For Demonstration Purposes Only',
    '',
    'Cancer Profile',
    'Type: Non-Small Cell Lung Cancer',
    'Stage: Stage IIIA',
    'Key Biomarkers: PD-L1 60%, EGFR Negative',
    '',
    'Suggested Questions for Your Oncologist',
    '1) Based on this profile, what treatment options should we discuss first?',
    '2) Could immunotherapy be relevant in my case?',
    '3) Are there clinical trials nearby that might be appropriate?',
    '4) What should we prioritize in the next 2-4 weeks?',
    '',
    'Disclaimer: OncoKind provides informational guidance only and is not a substitute for professional medical advice.',
  ].join('\n');
}

export function SampleReportDemo() {
  const [open, setOpen] = useState(false);
  const [showPrepPreview, setShowPrepPreview] = useState(false);
  const samplePrepSheet = useMemo(() => buildSamplePrepSheet(), []);

  function downloadPrepSheet() {
    const blob = new Blob([samplePrepSheet], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oncokind-sample-doctor-prep-sheet.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-accent">Try a Sample Report</h3>
          <p className="mt-1 text-slate-600">
            Explore a fictional case to see how OncoKind translates complex reports into clear next steps.
          </p>
        </div>
        <Button type="button" size="lg" onClick={() => setOpen((v) => !v)} className="h-11">
          <Sparkles className="mr-2 h-4 w-4" />
          {open ? 'Hide sample demo' : 'Try a Sample Report'}
        </Button>
      </div>

      {open && (
        <div className="mt-6 space-y-4 rounded-xl border border-sky-200 bg-sky-50/40 p-4">
          <p className="text-sm font-medium text-primary">
            Sample Report - For Demonstration Purposes Only
          </p>
          <CancerProfileSummaryCard
            type="Non-Small Cell Lung Cancer"
            stage="Stage IIIA"
            biomarkers={['PD-L1: 60%', 'EGFR: Negative']}
            recommendedNextSteps={[
              'Meet with your oncologist this week',
              'Ask whether immunotherapy is appropriate',
              'Review nearby clinical trial options',
              'Prepare a doctor question list before the visit',
            ]}
            showCta={false}
          />

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setShowPrepPreview((v) => !v)}>
              <FileText className="mr-2 h-4 w-4" />
              Generate Doctor Prep Sheet
            </Button>
            <Button asChild type="button">
              <Link href="/signup">Upload your real report to get started</Link>
            </Button>
          </div>

          {showPrepPreview && (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <h4 className="font-heading text-base font-semibold text-accent">Prep Sheet Preview</h4>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {samplePrepSheet}
              </pre>
              <div className="mt-3">
                <Button type="button" size="sm" onClick={downloadPrepSheet}>
                  Download Prep Sheet
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
