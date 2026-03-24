'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

type TimelineItem = {
  title: string;
  type: string;
  occurredAt: string;
  notes?: string | null;
};

type Props = {
  reportSummary: string;
  biomarkers: string[];
  trialTitles: string[];
  timeline: TimelineItem[];
};

export function SecondOpinionPacket({
  reportSummary,
  biomarkers,
  trialTitles,
  timeline,
}: Props) {
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [openQuestions, setOpenQuestions] = useState('');

  const parsedQuestions = useMemo(
    () =>
      openQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean),
    [openQuestions]
  );

  function exportPacket() {
    const timelineHtml = timeline
      .map(
        (t) => `
      <div class="item">
        <div class="kicker">${t.type}</div>
        <div class="title">${t.title}</div>
        <div class="muted">${new Date(t.occurredAt).toLocaleString()}</div>
        ${t.notes ? `<p>${t.notes}</p>` : ''}
      </div>
    `
      )
      .join('');

    const questionsHtml = (parsedQuestions.length ? parsedQuestions : ['What should we prioritize in the next 2-4 weeks?'])
      .map((q) => `<li>${q}</li>`)
      .join('');

    const trialsHtml = (trialTitles.length ? trialTitles : ['No trial titles saved yet. Use Clinical Trials matching to add relevant options.'])
      .map((t) => `<li>${t}</li>`)
      .join('');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>OncoKind Second Opinion Packet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; line-height: 1.5; }
    h1 { margin: 0; } h2 { margin-top: 20px; font-size: 18px; }
    .muted { color: #64748b; font-size: 13px; }
    .box { border: 1px solid #e2e8f0; border-radius: 10px; background: #f8fafc; padding: 12px; margin-top: 10px; }
    .item { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; margin-top: 8px; }
    .kicker { font-size: 11px; color: #0284c7; font-weight: 700; text-transform: uppercase; letter-spacing: .03em; }
    .title { font-size: 16px; font-weight: 600; margin-top: 3px; }
    ul { padding-left: 18px; }
    .disclaimer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Second Opinion Packet</h1>
  <p class="muted">Generated ${new Date().toLocaleString()}</p>

  <h2>Report Summary (Plain Language)</h2>
  <div class="box">${reportSummary || 'No report summary available.'}</div>

  <h2>Key Biomarkers with Explanations</h2>
  <ul>${(biomarkers.length ? biomarkers : ['No biomarkers found']).map((b) => `<li>${b} — discuss how this may shape treatment options.</li>`).join('')}</ul>

  <h2>Current Treatment Plan</h2>
  <div class="box">${treatmentPlan || 'Add your current treatment plan before export for best results.'}</div>

  <h2>Open Questions</h2>
  <ul>${questionsHtml}</ul>

  <h2>Clinical Trials Identified</h2>
  <ul>${trialsHtml}</ul>

  <h2>Care Timeline</h2>
  ${timelineHtml || '<p>No timeline milestones found yet.</p>'}

  <div class="disclaimer">Getting a second opinion is a normal, encouraged part of cancer care. This packet helps you walk into that appointment fully prepared. OncoKind provides informational guidance only and is not a substitute for professional medical advice.</div>
</body>
</html>`;

    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-accent">Second Opinion Packet Builder</h2>
        <p className="mt-1 text-slate-600">
          Getting a second opinion is a normal, encouraged part of cancer care. This packet helps you walk into that appointment fully prepared.
        </p>
        <div className="mt-4 grid gap-3">
          <label className="text-sm text-slate-700">
            Current treatment plan (user-entered or extracted)
            <textarea
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="e.g., Planned chemo + immunotherapy discussion next week..."
            />
          </label>
          <label className="text-sm text-slate-700">
            Open questions (one per line)
            <textarea
              value={openQuestions}
              onChange={(e) => setOpenQuestions(e.target.value)}
              rows={5}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              placeholder="What should we prioritize in the next 2-4 weeks?"
            />
          </label>
        </div>
        <div className="mt-4">
          <Button onClick={exportPacket}>Export Second Opinion Packet (PDF-ready)</Button>
        </div>
      </div>
    </div>
  );
}
