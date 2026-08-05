'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Copy,
  Printer,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DrugTrial {
  drug_name: string;
  reason_discontinued: string;
  was_ineffective: boolean;
  caused_adverse_reaction: boolean;
  contraindicated: boolean;
}

export interface CaseData {
  id: string;
  case_type: 'prior_auth' | 'step_therapy' | 'continued_stay';
  status: string;
  patient_identifier: string | null;
  facility_name: string | null;
  payer_name: string | null;
  medication_name: string | null;
  diagnosis_code: string | null;
  diagnosis_description: string | null;
  prescribing_physician: string | null;
  ai_generated_document: string | null;
  ai_denial_analysis: string | null;
  state_law_citation: string | null;
  created_at: string;
  prior_auth_drug_trials?: DrugTrial[];
}

const CASE_TYPE_LABELS: Record<CaseData['case_type'], string> = {
  prior_auth:    'Prior Authorization Request',
  step_therapy:  'Step Therapy Exception Letter',
  continued_stay: 'Continued Stay / Medical Necessity Letter',
};

const STATUS_FLOW = [
  { value: 'draft',     label: 'Draft' },
  { value: 'ready',     label: 'Ready' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'approved',  label: 'Approved' },
  { value: 'denied',    label: 'Denied' },
  { value: 'appealing', label: 'On Appeal' },
];

export function CaseWorkspace({ caseData }: { caseData: CaseData }) {
  const router = useRouter();
  const [documentText, setDocumentText] = useState(caseData.ai_generated_document ?? '');
  const [status, setStatus] = useState(caseData.status);
  const [statusSaved, setStatusSaved] = useState(false);
  const [denialText, setDenialText] = useState('');
  const [denialError, setDenialError] = useState('');
  const [denialAnalysis, setDenialAnalysis] = useState(caseData.ai_denial_analysis ?? '');
  const [analyzing, setAnalyzing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [showOutcomeModal, setShowOutcomeModal] = useState<'approved' | 'denied' | null>(null);

  async function updateStatus(newStatus: string, notes?: string) {
    setUpdatingStatus(true);
    try {
      await fetch(`/api/prior-auth/cases/${caseData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          outcome_date: new Date().toISOString(),
          outcome_notes: notes ?? outcomeNotes ?? null,
        }),
      });
      setStatus(newStatus);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 3000);
    } finally {
      setUpdatingStatus(false);
      setShowOutcomeModal(null);
    }
  }

  async function analyzeDenial() {
    if (denialText.trim().length < 20) {
      setDenialError('Please enter at least 20 characters of denial letter text.');
      setDenialText('');
      return;
    }
    setDenialError('');
    setAnalyzing(true);
    try {
      const res = await fetch('/api/prior-auth/analyze-denial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ denial_text: denialText, case_id: caseData.id }),
      });
      const data = await res.json();
      setDenialAnalysis(data.analysis);
    } finally {
      setAnalyzing(false);
    }
  }

  function copyDocument() {
    navigator.clipboard.writeText(documentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function printDocument() {
    // Signal to Playwright (and any test harness) that print was triggered
    if (typeof window !== 'undefined') {
      (window as unknown as Record<string, unknown>)['__printCalled'] = true;
    }
    window.print();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/prior-auth')}
            className="mb-3 flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#1C2B2D]"
          >
            <ArrowLeft className="h-4 w-4" />
            All Cases
          </button>
          <h1 className="font-display text-xl font-semibold text-[#1C2B2D]">
            {CASE_TYPE_LABELS[caseData.case_type]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {caseData.patient_identifier ? `${caseData.patient_identifier} · ` : ''}
            {caseData.facility_name ?? ''} · {caseData.payer_name ?? 'Payer not set'}
          </p>
        </div>

        {/* Status selector */}
        <div className="flex shrink-0 items-center gap-2">
          {statusSaved && (
            <span className="text-xs text-[#6B8F71]">Updated</span>
          )}
          <label htmlFor="pa-case-status" className="sr-only">Status</label>
          <select
            id="pa-case-status"
            aria-label="Status"
            value={status}
            onChange={(e) => {
              const next = e.target.value;
              if (next === 'approved' || next === 'denied') {
                setShowOutcomeModal(next as 'approved' | 'denied');
              } else {
                updateStatus(next);
              }
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B8F71]"
            disabled={updatingStatus}
          >
            {STATUS_FLOW.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main document panel ── */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-medium text-[#1C2B2D]">Generated Document</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyDocument}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:text-[#1C2B2D]"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <CheckCircle className="h-3.5 w-3.5 text-[#6B8F71]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={printDocument}
                  className="flex items-center gap-1 rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:text-[#1C2B2D]"
                  title="Print / Save PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print / PDF
                </button>
              </div>
            </div>

            <div className="p-4">
              <textarea
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                className="h-[480px] w-full resize-none bg-transparent font-mono text-sm leading-relaxed text-[#1C2B2D] focus:outline-none"
                placeholder="Generated document will appear here..."
              />
              {!documentText && (
                <div className="mt-2 flex items-center gap-2 text-slate-400">
                  <FileText className="h-4 w-4 opacity-40" />
                  <span className="text-xs">No document generated yet.</span>
                  <button
                    onClick={() => router.push(`/prior-auth/new/form?type=${caseData.case_type}`)}
                    className="text-xs font-medium text-[#6B8F71] hover:text-[#1C2B2D]"
                  >
                    Regenerate →
                  </button>
                </div>
              )}
            </div>

            {documentText && (
              <div className="border-t border-slate-100 bg-amber-50 px-4 py-3">
                <p className="text-xs text-amber-700">
                  Review all content and replace any{' '}
                  <strong>[bracketed placeholders]</strong> before submission. Have the prescribing
                  physician sign the attestation section.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Case details */}
          <Card className="border border-slate-200 p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#1C2B2D]">Case Details</h3>
            <div className="space-y-2">
              {(
                [
                  ['Medication', caseData.medication_name],
                  ['Diagnosis',  `${caseData.diagnosis_code ?? ''} ${caseData.diagnosis_description ?? ''}`.trim()],
                  ['Physician',  caseData.prescribing_physician],
                  ['Created',    new Date(caseData.created_at).toLocaleDateString()],
                ] as [string, string | null | undefined][]
              )
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="text-xs font-medium text-[#1C2B2D]">{value}</div>
                  </div>
                ))}
            </div>
          </Card>

          {/* State law (step therapy only) */}
          {caseData.state_law_citation && (
            <Card className="border border-[#6B8F71]/20 bg-[#6B8F71]/5 p-4">
              <h3 className="mb-2 text-xs font-semibold text-[#6B8F71]">State Law Applied</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                {caseData.state_law_citation}
              </p>
            </Card>
          )}

          {/* Denial analyzer */}
          <Card className="border border-slate-200 p-4">
            <h3 className="mb-1 text-sm font-semibold text-[#1C2B2D]">Analyze a Denial Letter</h3>
            <p className="mb-3 text-xs text-slate-500">
              Paste denial text to get a plain-English breakdown and appeal strategy.
            </p>
            {denialAnalysis ? (
              <div>
                <div className="mb-2 whitespace-pre-line rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
                  {denialAnalysis}
                </div>
                <button
                  onClick={() => { setDenialAnalysis(''); setDenialText(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear / Analyze another
                </button>
              </div>
            ) : (
              <>
                <label htmlFor="pa-denial-text" className="sr-only">Denial Letter Text</label>
                <textarea
                  id="pa-denial-text"
                  aria-label="Denial Letter Text"
                  value={denialText}
                  onChange={(e) => { setDenialText(e.target.value); setDenialError(''); }}
                  className="h-24 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B8F71]"
                  placeholder="Paste denial letter text here..."
                />
                {denialError && (
                  <p className="mt-1 text-xs text-red-500">{denialError}</p>
                )}
                <Button
                  onClick={analyzeDenial}
                  disabled={analyzing}
                  className="mt-2 h-8 w-full bg-[#1C2B2D] text-xs text-white hover:bg-[#2d4042]"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Analyzing&hellip;
                    </>
                  ) : (
                    'Analyze Denial'
                  )}
                </Button>
              </>
            )}
          </Card>

          {/* Drug trial history (step therapy) */}
          {caseData.prior_auth_drug_trials && caseData.prior_auth_drug_trials.length > 0 && (
            <Card className="border border-slate-200 p-4">
              <h3 className="mb-2 text-xs font-semibold text-[#1C2B2D]">Drug Trial History</h3>
              <div className="space-y-2">
                {caseData.prior_auth_drug_trials.map((trial, i) => (
                  <div key={i} className="rounded-lg bg-slate-50 p-2 text-xs">
                    <div className="font-medium text-[#1C2B2D]">{trial.drug_name}</div>
                    <div className="text-slate-500">{trial.reason_discontinued}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {trial.was_ineffective && (
                        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-600">
                          Ineffective
                        </span>
                      )}
                      {trial.caused_adverse_reaction && (
                        <span className="rounded bg-red-50 px-1.5 py-0.5 text-red-500">
                          Adverse reaction
                        </span>
                      )}
                      {trial.contraindicated && (
                        <span className="rounded bg-purple-50 px-1.5 py-0.5 text-purple-600">
                          Contraindicated
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Outcome modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div role="dialog" aria-modal="true" aria-label={`Mark as ${showOutcomeModal}`} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              {showOutcomeModal === 'approved' ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500" />
              )}
              <h3 className="font-semibold text-[#1C2B2D]">
                Mark as {showOutcomeModal === 'approved' ? 'Approved' : 'Denied'}
              </h3>
            </div>
            <label htmlFor="pa-outcome-notes" className="sr-only">Notes</label>
            <textarea
              id="pa-outcome-notes"
              aria-label="Notes"
              value={outcomeNotes}
              onChange={(e) => setOutcomeNotes(e.target.value)}
              className="mb-4 h-20 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B8F71]"
              placeholder="Optional notes (approval date, denial reason, appeal plan)..."
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowOutcomeModal(null)}
                className="flex-1 bg-slate-100 text-sm text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={() => updateStatus(showOutcomeModal, outcomeNotes)}
                disabled={updatingStatus}
                className={`flex-1 text-sm text-white ${
                  showOutcomeModal === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {updatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {showOutcomeModal === 'approved' ? (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    ) : (
                      <AlertCircle className="mr-1 h-4 w-4" />
                    )}
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
