'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type TimelineEntry = {
  id: string;
  milestone_type: string;
  title: string;
  notes?: string | null;
  report_summary?: string | null;
  prep_sheet_link?: string | null;
  occurred_at: string;
  created_at: string;
  auto?: boolean;
};

type Props = {
  initialEntries: TimelineEntry[];
};

const milestoneOptions = [
  { value: 'diagnosis', label: 'Diagnosis' },
  { value: 'lab_result', label: 'Lab Results' },
  { value: 'treatment_start', label: 'Treatment Start' },
  { value: 'clinical_trial_enrollment', label: 'Clinical Trial Enrollment' },
  { value: 'follow_up_appointment', label: 'Follow-Up Appointment' },
  { value: 'new_report_uploaded', label: 'New Report Uploaded' },
  { value: 'custom', label: 'Custom' },
];

const milestoneColors: Record<string, string> = {
  diagnosis: 'bg-primary/10 text-primary',
  lab_result: 'bg-indigo-100 text-indigo-700',
  treatment_start: 'bg-emerald-100 text-emerald-700',
  clinical_trial_enrollment: 'bg-violet-100 text-violet-700',
  follow_up_appointment: 'bg-amber-100 text-amber-700',
  new_report_uploaded: 'bg-sky-100 text-sky-700',
  custom: 'bg-slate-100 text-slate-700',
};

function labelForType(type: string): string {
  const opt = milestoneOptions.find((o) => o.value === type);
  return opt?.label ?? type;
}

export function CareTimeline({ initialEntries }: Props) {
  const [entries, setEntries] = useState<TimelineEntry[]>(initialEntries);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [milestoneType, setMilestoneType] = useState('follow_up_appointment');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  const [prepSheetLink, setPrepSheetLink] = useState('/reports');
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 16));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()),
    [entries]
  );

  async function addMilestone(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch('/api/care-timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneType,
          title,
          notes,
          reportSummary,
          prepSheetLink,
          occurredAt: new Date(occurredAt).toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Failed to save timeline entry');
        return;
      }
      setEntries((prev) => [data.entry, ...prev]);
      setTitle('');
      setNotes('');
      setReportSummary('');
      setPrepSheetLink('/reports');
    } catch {
      setError('Failed to save timeline entry');
    } finally {
      setSaving(false);
    }
  }

  function exportTimeline() {
    const html = `<!doctype html>
<html>
<head><meta charset="utf-8"/><title>OncoKind Care Timeline</title>
<style>
body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; line-height: 1.5; }
h1 { margin-bottom: 6px; } .muted { color: #64748b; font-size: 14px; margin-bottom: 20px; }
.item { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 12px; }
.type { font-size: 12px; color: #0284c7; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
.title { font-size: 18px; margin: 4px 0; } .date { font-size: 13px; color: #475569; }
.notes { margin-top: 8px; } .disclaimer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 10px; color: #64748b; font-size: 12px; }
</style></head><body>
<h1>Care Timeline</h1><p class="muted">Generated ${new Date().toLocaleString()}</p>
${sorted
  .map(
    (entry) => `<div class="item">
      <div class="type">${labelForType(entry.milestone_type)}</div>
      <div class="title">${entry.title}</div>
      <div class="date">${new Date(entry.occurred_at).toLocaleString()}</div>
      ${entry.notes ? `<div class="notes"><strong>Notes:</strong> ${entry.notes}</div>` : ''}
      ${entry.report_summary ? `<div class="notes"><strong>Report summary:</strong> ${entry.report_summary}</div>` : ''}
      ${entry.prep_sheet_link ? `<div class="notes"><strong>Prep sheet:</strong> ${entry.prep_sheet_link}</div>` : ''}
    </div>`
  )
  .join('')}
<div class="disclaimer">OncoKind provides informational guidance only and is not a substitute for professional medical advice.</div>
</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-accent">Add milestone</h2>
            <p className="text-sm text-slate-600">Track meaningful moments in your care journey.</p>
          </div>
          <Button variant="outline" onClick={exportTimeline}>Export Timeline (PDF-ready)</Button>
        </div>
        <form onSubmit={addMilestone} className="mt-4 grid gap-3 md:grid-cols-2">
          <select className="h-10 rounded-md border border-slate-300 px-3" value={milestoneType} onChange={(e) => setMilestoneType(e.target.value)}>
            {milestoneOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <input className="h-10 rounded-md border border-slate-300 px-3" placeholder="Milestone title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <input className="h-10 rounded-md border border-slate-300 px-3" type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} required />
          <input className="h-10 rounded-md border border-slate-300 px-3" placeholder="Prep sheet link (optional)" value={prepSheetLink} onChange={(e) => setPrepSheetLink(e.target.value)} />
          <textarea className="min-h-[90px] rounded-md border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <textarea className="min-h-[90px] rounded-md border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Attached report summary (optional)" value={reportSummary} onChange={(e) => setReportSummary(e.target.value)} />
          <div className="md:col-span-2">
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Add Milestone'}</Button>
          </div>
        </form>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-accent">Your timeline</h2>
        <div className="mt-4 space-y-3">
          {sorted.length === 0 && (
            <p className="text-sm text-slate-600">No milestones yet. Add your first milestone above.</p>
          )}
          {sorted.map((entry) => {
            const isOpen = expanded === entry.id;
            return (
              <article key={entry.id} className="rounded-lg border border-slate-200 p-4">
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                >
                  <div>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${milestoneColors[entry.milestone_type] ?? milestoneColors.custom}`}>
                      {labelForType(entry.milestone_type)}
                    </span>
                    <h3 className="mt-2 font-medium text-accent">{entry.title}</h3>
                    <p className="text-sm text-slate-500">{new Date(entry.occurred_at).toLocaleString()}</p>
                  </div>
                  <span className="text-slate-400">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    {entry.notes && <p><span className="font-medium">Notes:</span> {entry.notes}</p>}
                    {entry.report_summary && <p><span className="font-medium">Report summary:</span> {entry.report_summary}</p>}
                    {entry.prep_sheet_link && (
                      <p>
                        <span className="font-medium">Prep sheet:</span>{' '}
                        <Link href={entry.prep_sheet_link} className="text-primary hover:underline">{entry.prep_sheet_link}</Link>
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
