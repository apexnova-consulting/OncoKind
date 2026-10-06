'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { runCompleteThePicture } from '@/lib/agents/ctp/pipeline';
import { BRING_CHECKLIST, coverageQuestionScript, recordsRequestLetter } from '@/lib/agents/ctp/letters';
import { CTP_FICTIONAL_SAMPLES } from '@/lib/agents/ctp/samples';
import { QUESTION_STATUSES, type QuestionStatus } from '@/lib/agents/ctp/evaluate';
import { REDACTION_USER_NOTE, EDUCATIONAL_DISCLAIMER } from '@/lib/agents/safety';

export function CompleteThePictureExperience({
  persist = false,
  initialText = '',
  showSamples = false,
  paidTools = false,
}: {
  persist?: boolean;
  initialText?: string;
  showSamples?: boolean;
  paidTools?: boolean;
}) {
  const [reportText, setReportText] = useState(initialText);
  const [cancerType, setCancerType] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof runCompleteThePicture> | null>(null);
  const [statuses, setStatuses] = useState<Record<string, QuestionStatus>>({});
  const [letterName, setLetterName] = useState('');
  const [facility, setFacility] = useState('');
  const [problem, setProblem] = useState(false);

  const letter = useMemo(
    () =>
      recordsRequestLetter({
        caregiverName: letterName,
        patientRelationship: 'family caregiver',
        facilityName: facility,
        today: new Date().toLocaleDateString('en-US'),
      }),
    [letterName, facility]
  );

  async function run() {
    setBusy(true);
    setError(null);
    try {
      if (persist) {
        const response = await fetch('/api/agents/ctp/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportText, cancerType }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || 'Unable to run Complete the Picture.');
        setResult(json);
      } else {
        setResult(runCompleteThePicture({ reportText, cancerType }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <p className="rounded-xl bg-[#E1F5EE] px-4 py-3 text-sm text-[#085041]">{REDACTION_USER_NOTE}</p>
      {showSamples ? (
        <div className="flex flex-wrap gap-2">
          {CTP_FICTIONAL_SAMPLES.map((sample) => (
            <Button
              key={sample.id}
              type="button"
              variant="outline"
              onClick={() => {
                setReportText(sample.reportText);
                setCancerType(sample.cancerType);
              }}
            >
              {sample.label}
            </Button>
          ))}
        </div>
      ) : null}
      <label className="block text-sm font-medium text-slate-700">
        Report text
        <textarea
          value={reportText}
          onChange={(event) => setReportText(event.target.value)}
          rows={10}
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
          placeholder="Paste the report text. Photos can be transcribed first."
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Cancer type (optional)
        <input
          value={cancerType}
          onChange={(event) => setCancerType(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
        />
      </label>
      <Button onClick={run} disabled={busy || reportText.trim().length < 20}>
        {busy ? 'Checking…' : 'Check for gaps'}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      {result?.kind === 'crisis' || result?.kind === 'pediatric' ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">{result.message}</div>
      ) : null}

      {result?.kind === 'ok' ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#cdd8d5] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">Pieces found and open questions</p>
            <h2 className="mt-2 font-display text-3xl text-[#1e2d2b]">{result.summary.headline}</h2>
            {result.summary.calmEmptyState ? <p className="mt-3 text-slate-600">{result.summary.calmEmptyState}</p> : null}
            {result.needsConfirmation.length > 0 ? (
              <p className="mt-3 text-sm text-slate-600">
                Please confirm: {result.needsConfirmation.join(', ')}. Low-confidence fields wait for you before they should be treated as final.
              </p>
            ) : null}
          </div>

          <section className="space-y-3">
            <h3 className="font-semibold text-[#1e2d2b]">Questions for your care team</h3>
            {result.evaluations.map((item) => (
              <article key={item.rule_id} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-semibold">{item.item}</h4>
                  <span
                    className={
                      item.status === 'found'
                        ? 'rounded-full bg-[#E1F5EE] px-2 py-0.5 text-xs text-[#085041]'
                        : 'rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-900'
                    }
                  >
                    {item.status === 'found' ? 'Found in upload' : item.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{item.ask_whether_recommended}</p>
                <p className="mt-2 text-sm text-slate-500">{item.why_it_can_matter}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {item.citation.title}. Last reviewed {item.citation.date}. {item.citation.source}
                </p>
                {paidTools || !persist ? (
                <label className="mt-3 block text-xs font-medium text-slate-600">
                  Tracker
                  <select
                    className="ml-2 rounded-lg border border-slate-200 px-2 py-1"
                    value={statuses[item.rule_id] ?? 'Not asked'}
                    onChange={(event) =>
                      setStatuses((current) => ({ ...current, [item.rule_id]: event.target.value as QuestionStatus }))
                    }
                  >
                    {QUESTION_STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>
                ) : null}
              </article>
            ))}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold">What to bring and request</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {BRING_CHECKLIST.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-slate-600">{coverageQuestionScript()}</p>
          </section>

          {paidTools || !persist ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="font-semibold">Records request letter</h3>
            <p className="mt-1 text-sm text-slate-500">v1 does not send this. You print, sign, and send it.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                value={letterName}
                onChange={(event) => setLetterName(event.target.value)}
                placeholder="Your name"
                className="rounded-xl border border-slate-200 p-3 text-sm"
              />
              <input
                value={facility}
                onChange={(event) => setFacility(event.target.value)}
                placeholder="Facility name"
                className="rounded-xl border border-slate-200 p-3 text-sm"
              />
            </div>
            <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm text-slate-700">{letter}</pre>
          </section>
          ) : (
            <p className="rounded-2xl border border-[#cdd8d5] bg-white p-5 text-sm text-slate-600">
              Caregiver Pro unlocks the full question tracker and printable records letter.{' '}
              <Link href="/pricing" className="font-semibold text-[#0F6E56]">
                See plans
              </Link>
            </p>
          )}

          <p className="text-xs text-slate-500">{EDUCATIONAL_DISCLAIMER}</p>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setProblem(true)}>
              Report a problem with this result
            </Button>
            <Button asChild variant="outline">
              <Link href="/features/oncokind-family">Ask about genetic counseling in Family</Link>
            </Button>
          </div>
          {problem ? (
            <ProblemForm surface="complete_the_picture" />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ProblemForm({ surface }: { surface: string }) {
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  return (
    <form
      className="rounded-xl border border-slate-200 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        await fetch('/api/agents/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, details, surface: 'problem', useCase: surface }),
        });
        setDone(true);
      }}
    >
      <p className="text-sm font-medium">Tell us what looked wrong. Do not include medical details you do not want in email.</p>
      <input
        required
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        className="mt-2 w-full rounded-lg border p-2 text-sm"
      />
      <textarea
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        className="mt-2 w-full rounded-lg border p-2 text-sm"
        rows={3}
      />
      <Button className="mt-2" type="submit">
        Send
      </Button>
      {done ? <p className="mt-2 text-sm text-emerald-700">Received. Thank you.</p> : null}
    </form>
  );
}
