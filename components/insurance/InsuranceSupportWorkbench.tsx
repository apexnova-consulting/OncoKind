'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FileText, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>OncoKind Appeal Letter</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; line-height: 1.5; }
    h1, h2 { margin-bottom: 8px; }
    .muted { color: #64748b; }
    .box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-top: 12px; background: #fff; }
    ul { padding-left: 20px; }
    pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <h1>Draft Appeal Letter</h1>
  <p class="muted">Insurance: ${result.insuranceName} | Denial: ${result.denialReasonCode}</p>
  <div class="box"><pre>${result.letterOfMedicalNecessity}</pre></div>
  <h2>Next-Step Checklist</h2>
  <ul>${result.nextStepChecklist.map((item) => `<li>${item}</li>`).join('')}</ul>
  <p style="margin-top: 24px;">${result.physicianSignatureLine}</p>
</body>
</html>`;
}

export function InsuranceSupportWorkbench({
  hasAdvocateAccess,
}: {
  hasAdvocateAccess: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decoded, setDecoded] = useState<DecodedResponse | null>(null);
  const [appeal, setAppeal] = useState<AppealResponse | null>(null);

  const advocateRedirect = useMemo(() => '/pricing?plan=advocate', []);

  async function handleDecode(e: React.FormEvent) {
    e.preventDefault();
    if (!file || file.type !== 'application/pdf') {
      setError('Please choose a PDF Explanation of Benefits letter.');
      return;
    }

    setError(null);
    setAppeal(null);
    setDecoding(true);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const res = await fetch('/api/insurance/decode', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Failed to decode denial letter.');
        return;
      }
      setDecoded(data as DecodedResponse);
    } catch {
      setError('Failed to decode denial letter.');
    } finally {
      setDecoding(false);
    }
  }

  async function handleGenerateAppeal() {
    if (!decoded) return;
    if (!hasAdvocateAccess) {
      window.location.href = advocateRedirect;
      return;
    }

    setError(null);
    setGenerating(true);

    try {
      const res = await fetch('/api/insurance/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId: decoded.caseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.redirectTo) {
          window.location.href = data.redirectTo;
          return;
        }
        setError(data.error || 'Failed to generate appeal letter.');
        return;
      }
      setAppeal(data as AppealResponse);
    } catch {
      setError('Failed to generate appeal letter.');
    } finally {
      setGenerating(false);
    }
  }

  function exportAppeal() {
    if (!appeal) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.open();
    w.document.write(printableHtml(appeal));
    w.document.close();
    w.focus();
    w.print();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Denial Decoder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleDecode} className="space-y-4">
            <p className="text-sm text-slate-600">
              Upload an Explanation of Benefits (EOB) PDF. We extract the denial code, explain it in plain English,
              and prepare the case for appeal generation without retaining the raw PDF.
            </p>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError(null);
              }}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={decoding}>
              {decoding ? 'Decoding denial…' : 'Decode denial letter'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {decoded && (
        <Card>
          <CardHeader>
            <CardTitle>Decoded denial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Denial reason code</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.denialReasonCode}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Insurance plan</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.insuranceName}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member services</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.memberServicesPhone}</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Appeal deadline</p>
                <p className="mt-1 font-medium text-slate-900">{decoded.appealDeadlineText}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Plain English explanation</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {decoded.plainEnglishBullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleGenerateAppeal} disabled={generating}>
                <ShieldCheck className="mr-2 h-4 w-4" aria-hidden />
                {generating ? 'Generating appeal…' : 'Generate Appeal Letter'}
              </Button>
              {!hasAdvocateAccess && (
                <Button asChild variant="outline">
                  <Link href={advocateRedirect}>Upgrade to Advocate Plan ($49/mo)</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {appeal && (
        <Card>
          <CardHeader>
            <CardTitle>Draft appeal package</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Letter of Medical Necessity</p>
              <pre className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                {appeal.letterOfMedicalNecessity}
              </pre>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Next-step checklist</p>
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
              <Button onClick={exportAppeal}>
                <FileText className="mr-2 h-4 w-4" aria-hidden />
                Export / Print PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
