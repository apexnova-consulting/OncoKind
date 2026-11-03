import { GTD_EMPTY_STATE, TRIAL_DISCLAIMER } from '@/lib/ok01';
import { TRIAL_TERMS, type TrialLandingKey } from '@/lib/trials/trial-terms';
import type { PublicTrial } from '@/lib/trials/public-lists';

export function PublicTrialList({
  landingKey,
  trials,
  refreshedOn,
  ok,
}: {
  landingKey: TrialLandingKey;
  trials: PublicTrial[];
  refreshedOn: string;
  ok: boolean;
}) {
  const config = TRIAL_TERMS[landingKey];
  const primary = trials.filter((trial) => trial.section === 'primary');
  const broader = trials.filter((trial) => trial.section === 'broader');

  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="font-semibold">Recruiting US trials</h2>
      <p className="mt-2 text-sm text-slate-600">{TRIAL_DISCLAIMER}</p>
      {!ok ? (
        <p className="mt-4 text-sm text-slate-600">
          Trial listings could not be refreshed right now. Search ClinicalTrials.gov for this diagnosis, and ask the care team.
        </p>
      ) : null}
      {ok && trials.length === 0 ? (
        <p className="mt-4 text-sm text-slate-700">
          {landingKey === 'gtd' ? GTD_EMPTY_STATE : 'No recruiting US trials matched these terms right now.'}{' '}
          <a className="font-semibold text-[#0F6E56]" href={config.clinicalTrialsSearch} target="_blank" rel="noreferrer">
            Search ClinicalTrials.gov
          </a>
        </p>
      ) : null}
      {primary.map((trial) => (
        <TrialCard key={trial.nctId} trial={trial} />
      ))}
      {broader.length ? (
        <>
          <h3 className="mt-6 font-semibold">{config.broaderTitle}</h3>
          {broader.map((trial) => (
            <TrialCard key={trial.nctId} trial={trial} />
          ))}
        </>
      ) : null}
      <p className="mt-4 text-xs text-slate-500">Data from ClinicalTrials.gov, refreshed {refreshedOn}.</p>
    </section>
  );
}

function TrialCard({ trial }: { trial: PublicTrial }) {
  return (
    <article className="mt-4 rounded-xl border border-[#e6eeec] p-4">
      <h3 className="font-semibold text-[#1e2d2b]">{trial.title}</h3>
      <p className="mt-1 text-xs text-slate-500">
        {trial.nctId} · {trial.phase} · {trial.status} · {trial.sponsor} · {trial.usSiteCount} US sites
      </p>
      <p className="mt-1 text-xs text-slate-500">Matched on: {trial.matchedOn}</p>
      {trial.lastUpdated ? <p className="mt-1 text-xs text-slate-500">Last updated {trial.lastUpdated}</p> : null}
      <a className="mt-2 inline-block text-sm font-semibold text-[#0F6E56]" href={trial.url} target="_blank" rel="noreferrer">
        View on ClinicalTrials.gov
      </a>
    </article>
  );
}
