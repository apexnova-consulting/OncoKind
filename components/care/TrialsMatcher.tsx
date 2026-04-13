'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Tier = 'free' | 'pro' | 'professional';

type Trial = {
  id?: string;
  title?: string;
  status?: string;
  phase?: string;
  sponsor?: string;
  trialType?: string;
  eligibilitySnippet?: string;
  locationText?: string;
  distanceLabel?: string;
  url?: string;
};

type TrialsResponse = {
  tier: Tier;
  radiusApplied: number;
  visibleCount: number;
  total: number;
  studies: Trial[];
};

type Props = {
  defaultCancerType?: string;
  defaultStage?: string;
  defaultBiomarkers?: string[];
};

export function TrialsMatcher({
  defaultCancerType = '',
  defaultStage = '',
  defaultBiomarkers = [],
}: Props) {
  const [cancerType, setCancerType] = useState(defaultCancerType);
  const [stage, setStage] = useState(defaultStage);
  const [biomarkers, setBiomarkers] = useState(defaultBiomarkers.join(', '));
  const [zip, setZip] = useState('');
  const [radius, setRadius] = useState(50);
  const [phase, setPhase] = useState('all');
  const [trialType, setTrialType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrialsResponse | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const visibleTrials = useMemo(() => {
    if (!data) return [];
    return data.studies.slice(0, data.visibleCount);
  }, [data]);

  async function fetchTrials() {
    setLoading(true);
    setError(null);
    setSavedMsg(null);
    try {
      const params = new URLSearchParams({
        cancerType: cancerType || 'oncology',
        stage,
        biomarkers,
        zip,
        radius: String(radius),
        phase,
        trialType,
      });
      const res = await fetch(`/api/trials?${params.toString()}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Unable to fetch trials right now.');
        setData(null);
        return;
      }
      setData(json);
    } catch {
      setError('Unable to fetch trials right now.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function askDoctorAboutTrial(trial: Trial) {
    const question = `Can you tell me if I might be eligible for ${trial.title ?? 'this trial'}?`;
    const key = 'oncokind_prep_extra_questions';
    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem(key) ?? '[]') as string[];
      } catch {
        return [];
      }
    })();
    const merged = Array.from(new Set([...existing, question]));
    localStorage.setItem(key, JSON.stringify(merged));
    setSavedMsg('Added to your Doctor Prep Sheet questions.');
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-600">
        Clinical trial matching uses public study records. Trial sponsors often list studies with an NCT identifier; run
        a search below to see matches for your profile.
      </p>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-heading text-lg font-semibold text-accent">Trial matching filters</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <input value={cancerType} onChange={(e) => setCancerType(e.target.value)} placeholder="Cancer type (e.g., lung cancer)" className="h-10 rounded-md border border-slate-300 px-3" />
          <input value={stage} onChange={(e) => setStage(e.target.value)} placeholder="Stage (e.g., IIIA)" className="h-10 rounded-md border border-slate-300 px-3" />
          <input value={biomarkers} onChange={(e) => setBiomarkers(e.target.value)} placeholder="Biomarkers (e.g., PD-L1, EGFR)" className="h-10 rounded-md border border-slate-300 px-3" />
          <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="ZIP code" className="h-10 rounded-md border border-slate-300 px-3" />
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="h-10 rounded-md border border-slate-300 px-3">
            <option value={25}>25 miles</option>
            <option value={50}>50 miles</option>
            <option value={100}>100 miles</option>
            <option value={9999}>Nationwide</option>
          </select>
          <select value={phase} onChange={(e) => setPhase(e.target.value)} className="h-10 rounded-md border border-slate-300 px-3">
            <option value="all">All phases</option>
            <option value="PHASE1">Phase I</option>
            <option value="PHASE2">Phase II</option>
            <option value="PHASE3">Phase III</option>
          </select>
          <select value={trialType} onChange={(e) => setTrialType(e.target.value)} className="h-10 rounded-md border border-slate-300 px-3">
            <option value="all">All trial types</option>
            <option value="INTERVENTIONAL">Interventional</option>
            <option value="OBSERVATIONAL">Observational</option>
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={fetchTrials} disabled={loading}>{loading ? 'Matching…' : 'Find Matching Trials'}</Button>
          <Button asChild variant="outline"><Link href="/journey">Back to Journey</Link></Button>
        </div>
      </div>

      {savedMsg && <p className="text-sm text-success">{savedMsg}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Showing {visibleTrials.length} of {data.total} matches. Radius applied: {data.radiusApplied} miles.
          </p>
          <div className="grid gap-3">
            {visibleTrials.map((trial, idx) => (
              <article key={trial.id ?? idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading text-base font-semibold text-accent">{trial.title ?? 'Untitled trial'}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{trial.status ?? 'Status unavailable'}</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                  <p><span className="font-medium">Phase:</span> {trial.phase ?? 'N/A'}</p>
                  <p><span className="font-medium">Sponsor:</span> {trial.sponsor ?? 'N/A'}</p>
                  <p><span className="font-medium">Distance:</span> {trial.distanceLabel ?? 'Not available'}</p>
                  <p><span className="font-medium">Type:</span> {trial.trialType ?? 'N/A'}</p>
                </div>
                <p className="mt-3 text-sm text-slate-700">
                  <span className="font-medium">Eligibility snippet:</span> {trial.eligibilitySnippet ?? 'See trial details for full eligibility.'}
                </p>
                <p className="mt-1 text-xs text-slate-500">Location: {trial.locationText ?? 'Location unavailable'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => askDoctorAboutTrial(trial)}>
                    Ask My Doctor About This
                  </Button>
                  {trial.url && (
                    <Button asChild>
                      <a href={trial.url} target="_blank" rel="noopener noreferrer">View Trial</a>
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {data.tier === 'free' && data.total > 3 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-700">
                You are viewing 3 matches on the Free tier. Upgrade to Caregiver Pro to see more local matches.
              </p>
              <Button asChild className="mt-3">
                <Link href="/dashboard/billing">Upgrade to Caregiver Pro</Link>
              </Button>
            </div>
          )}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-700">
              Added trial questions appear automatically in your Doctor Prep Sheet.
            </p>
            <Button asChild variant="outline" className="mt-3">
              <Link href="/reports">Open Doctor Prep Sheet</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
