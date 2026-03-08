'use client';

import { CancerProfileSummaryCard } from '@/components/care/CancerProfileSummaryCard';
import { Check, Clock, Square } from 'lucide-react';

/**
 * Static product interface preview for the homepage hero (right side).
 * Shows a realistic dashboard: diagnosis summary, biomarkers, next steps + progress strip.
 */
export function DashboardPreview() {
  return (
    <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-lg">
      {/* Mini progress strip */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-2">
        <div className="flex items-center justify-between gap-1 text-xs">
          <span className="flex items-center gap-1.5 text-primary">
            <Check className="h-3.5 w-3.5" /> Diagnosis
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <Clock className="h-3.5 w-3.5" /> Planning
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Square className="h-3 w-3" /> Treatment
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Square className="h-3 w-3" /> Monitoring
          </span>
        </div>
      </div>
      <div className="p-4">
        <CancerProfileSummaryCard
          type="Non-Small Cell Lung Cancer"
          stage="Stage IIIA"
          biomarkers={['PD-L1: 60%', 'EGFR: Negative']}
          recommendedNextSteps={[
            'Meet with oncologist',
            'Discuss immunotherapy',
            'Review clinical trials',
          ]}
          showCta={false}
          compact
        />
      </div>
    </div>
  );
}
