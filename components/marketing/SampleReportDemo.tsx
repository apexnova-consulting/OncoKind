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
    <section
      id="sample-demo"
      className="mt-12 scroll-mt-24 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-6 shadow-[var(--shadow-md)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[var(--shadow-lg)] motion-safe:transition-all motion-safe:duration-300"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">
            Try a Sample Report
          </h2>
          <p className="mt-1 text-[var(--color-text-secondary)]">
            Explore a fictional case to see how OncoKind translates complex reports into clear next steps.
          </p>
        </div>
        <Button type="button" size="lg" onClick={() => setOpen((v) => !v)}>
          <Sparkles className="mr-2 h-4 w-4" />
          {open ? 'Hide sample demo' : 'Try a Sample Report'}
        </Button>
      </div>

      {open && (
        <div className="mt-6 space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5">
          <p className="text-sm font-semibold text-[var(--color-primary-700)]">
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
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-white p-4 shadow-[var(--shadow-sm)]">
              <h3 className="font-display text-base font-semibold text-[var(--color-primary-900)]">
                Prep Sheet Preview
              </h3>
              <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text-secondary)]">
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
