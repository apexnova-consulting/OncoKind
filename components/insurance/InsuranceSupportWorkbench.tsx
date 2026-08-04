'use client';

import { useRef, useState } from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer, OutputSources } from '@/components/disclosures/OutputDisclosures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getInsuranceAppealSources, MEDICAL_DISCLAIMER_TEXT } from '@/lib/disclosures';

type DecodedResponse = {
  caseId: string;
  denialReasonCode: string;
  insuranceName: string;
  memberServicesPhone: string;
  appealDeadlineText: string;
  plainEnglishBullets: string[];
};

type AppealResponse = DecodedResponse & {
  letterOfMedicalNecessity: string;
  nextStepChecklist: string[];
  physicianSignatureLine: string;
};

function printableHtml(result: AppealResponse) {
  const sources = getInsuranceAppealSources().map((item) => `<li>${item}</li>`).join('');
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>OncoKind Appeal Packet</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; line-height: 1.5; }
    h1, h2 { margin-bottom: 8px; }
    .muted { color: #64748b; }
    .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-top: 12px; background: #fff; }
    ul { padding-left: 20px; }
    @page { margin: 32px 32px 80px 32px; }
    pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
    .sources { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-top: 16px; background: #f8fafc; }
    .footer { position: fixed; left: 32px; right: 32px; bottom: 20px; font-size: 12px; color: #475569; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h1>Draft Appeal Packet</h1>
  <p class="muted">Insurance: ${result.insuranceName} | Denial: ${result.denialReasonCode}</p>
  <div class="box"><pre>${result.letterOfMedicalNecessity}</pre></div>
  <h2>Next-Step Checklist</h2>
  <ul>${result.nextStepChecklist.map((item) => `<li>${item}</li>`).join('')}</ul>
  <p style="margin-top: 24px;">${result.physicianSignatureLine}</p>
  <div class="sources">
    <h2 style="margin-top:0;">Sources</h2>
    <ul>${sources}</ul>
  </div>
  <div class="footer">${MEDICAL_DISCLAIMER_TEXT}</div>
</body>
</html>`;
}

export function InsuranceSupportWorkbench({
  hasAdvocateAccess,
}: {
  hasAdvocateAccess: boolean;
}) {
  const [denialText, setDenialText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<DecodedResponse | null>(null);
  const [appeal, setAppeal] = useState<AppealResponse | null>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!denialText.trim()) {
      setError('Please paste your denial letter text.');
      return;
    }
    setError(null);
    setAppeal(null);
    setAnalyzing(true);
    try {
      const res = await fetch('/api/insurance/decode-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: denialText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to analyze denial letter.');
        return;
      }
      setDecoded(data as DecodedResponse);
    } catch {
      setError('Failed to analyze denial letter.');
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleGenerateAppeal() {
    setError(null);
    setGenerating(true);
    try {
      const res = await fetch('/api/insurance/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: decoded?.caseId ?? null, denialText }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to generate appeal packet.');
        return;
      }
      setAppeal(data as AppealResponse);
    } catch {
      setError('Failed to generate appeal packet.');
    } finally {
      setGenerating(false);
    }
  }

  function downloadAppeal() {
    if (!appeal) return;
    const html = printableHtml(appeal);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = downloadRef.current;
    if (!a) return;
    a.href = url;
    a.download = 'appeal-packet.pdf';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Paste denial text and analyze */}
      <Card>
        <CardHeader>
          <CardTitle>Denial Letter Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-4">
            <p className="text-sm text-slate-600">
              Paste your Explanation of Benefits (EOB) or denial letter text below. We decode the
              denial code, explain it in plain English, and prepare the case for appeal generation.
            </p>
            <label htmlFor="denial-letter-text" className="block text-sm font-medium text-slate-700">
              Denial Letter / Paste Text
            </label>
            <textarea
              id="denial-letter-text"
              aria-label="Denial Letter / Paste Text"
              value={denialText}
              onChange={(e) => {
                setDenialText(e.target.value);
                setError(null);
              }}
              rows={6}
              placeholder="Paste your denial letter text here…"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={analyzing}>
              {analyzing ? 'Analyzing…' : 'Analyze Denial'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Analysis results */}
      {decoded && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Denial Reason</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.denialReasonCode}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insurance Plan</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.insuranceName}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member Services</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.memberServicesPhone}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Appeal Basis / Deadline</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.appealDeadlineText}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Plain English Explanation</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {decoded.plainEnglishBullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Generate Appeal Packet — always visible */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Appeal Packet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            Generate a structured appeal packet including a letter of medical necessity, checklist,
            and physician signature block.
          </p>
          {!appeal ? (
            <Button onClick={handleGenerateAppeal} disabled={generating}>
              <ShieldCheck className="mr-2 h-4 w-4" aria-hidden />
              {generating ? 'Generating…' : 'Generate Appeal Packet'}
            </Button>
          ) : (
            <>
              <p className="text-sm font-medium text-emerald-700">Appeal packet ready — review below and download.</p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Letter of Medical Necessity</p>
                <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {appeal.letterOfMedicalNecessity}
                </pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Next-Step Checklist</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {appeal.nextStepChecklist.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-700">
                <p className="font-medium">Physician signature placeholder</p>
                <p className="mt-2">{appeal.physicianSignatureLine}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={downloadAppeal}>
                  <FileText className="mr-2 h-4 w-4" aria-hidden />
                  Download Appeal Packet
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAppeal(null);
                    handleGenerateAppeal();
                  }}
                  disabled={generating}
                >
                  Regenerate
                </Button>
              </div>
              <OutputSources items={getInsuranceAppealSources()} />
              <MedicalDisclaimer />
            </>
          )}
        </CardContent>
      </Card>

      {/* Hidden anchor used for programmatic download */}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
      <a ref={downloadRef} className="hidden" aria-hidden />
    </div>
  );
}
