'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatCentsRange, type CostEstimate } from '@/lib/agents/access/estimate';
import type { ProgramMatch } from '@/lib/agents/access/match';
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/lib/agents/access/match';
import { EDUCATIONAL_DISCLAIMER } from '@/lib/agents/safety';

export function AccessAgentExperience() {
  const [homeZip, setHomeZip] = useState('');
  const [destinationZip, setDestinationZip] = useState('');
  const [destinationLabel, setDestinationLabel] = useState('');
  const [cancerType, setCancerType] = useState('');
  const [visits, setVisits] = useState('6');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [matches, setMatches] = useState<ProgramMatch[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>({});

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/agents/access/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeZip,
          destinationZip,
          destinationLabel,
          cancerType,
          visits: Number(visits) || 'not_sure',
          incomeBand: 'not_sure',
        }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Unable to run Access Agent.');
      if (json.kind === 'crisis') {
        setError(json.message);
        return;
      }
      setEstimate(json.estimate);
      setMatches(json.matches);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Home ZIP
          <input
            value={homeZip}
            onChange={(event) => setHomeZip(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
            inputMode="numeric"
            autoComplete="postal-code"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Destination ZIP
          <input
            value={destinationZip}
            onChange={(event) => setDestinationZip(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
            inputMode="numeric"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Trial site or center name
          <input
            value={destinationLabel}
            onChange={(event) => setDestinationLabel(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
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
        <label className="block text-sm font-medium text-slate-700">
          Expected visits
          <input
            value={visits}
            onChange={(event) => setVisits(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm"
          />
        </label>
      </div>
      <p className="text-xs text-slate-500">
        Income band is optional and used only to check eligibility. It is not sent to analytics. Every question can be skipped.
      </p>
      <Button onClick={run} disabled={busy}>
        {busy ? 'Estimating…' : 'See cost range and programs'}
      </Button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {estimate ? (
        <section className="rounded-2xl border bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">Cost of participation</p>
          <h2 className="mt-2 font-display text-3xl">{formatCentsRange(estimate.lowCents, estimate.highCents)}</h2>
          <p className="mt-2 text-sm text-slate-600">
            About {estimate.miles} miles one way, {estimate.hours} hours of driving. {estimate.disclaimer}
          </p>
          <ul className="mt-4 space-y-1 text-sm text-slate-700">
            {estimate.assumptions.map((item) => (
              <li key={item.id}>
                {item.label}: {item.id === 'visits' || item.id === 'miles' ? item.amount : `$${Math.round(item.amount / 100)}`}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {matches.map((match) => (
        <article key={match.program.program_id} className="rounded-2xl border bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{match.program.name}</h3>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{match.band.replaceAll('_', ' ')}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{match.program.organization}</p>
          <p className="mt-2 text-xs text-slate-500">Last verified {match.program.last_verified_on}. Status: {match.program.status}.</p>
          <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
            {match.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">{match.program.disclaimer}</p>
          <p className="mt-2 text-sm">Documents: {match.program.application.documents_needed.join(', ')}</p>
          <a className="mt-2 inline-block text-sm font-semibold text-[#0F6E56]" href={match.program.application.url} target="_blank" rel="noreferrer">
            Open program site
          </a>
          <label className="mt-3 block text-xs">
            Application tracker
            <select
              className="ml-2 rounded-lg border px-2 py-1"
              value={statuses[match.program.program_id] ?? 'Not started'}
              onChange={(event) =>
                setStatuses((current) => ({ ...current, [match.program.program_id]: event.target.value as ApplicationStatus }))
              }
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </article>
      ))}
      <p className="text-xs text-slate-500">{EDUCATIONAL_DISCLAIMER}</p>
    </div>
  );
}
