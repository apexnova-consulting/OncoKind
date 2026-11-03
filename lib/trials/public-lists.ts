import { TRIAL_TERMS, type TrialLandingKey } from '@/lib/trials/trial-terms';

export type PublicTrial = {
  nctId: string;
  title: string;
  phase: string;
  status: string;
  sponsor: string;
  usSiteCount: number;
  url: string;
  lastUpdated: string;
  matchedOn: string;
  section: 'primary' | 'broader';
};

type FetchResult = {
  trials: PublicTrial[];
  refreshedOn: string;
  ok: boolean;
};

function protocolSection(study: Record<string, unknown>) {
  return (study.protocolSection as Record<string, unknown> | undefined) ?? {};
}

function parseStudy(study: Record<string, unknown>, matchedOn: string, section: 'primary' | 'broader'): PublicTrial | null {
  const protocol = protocolSection(study);
  const id = protocol.identificationModule as Record<string, unknown> | undefined;
  const status = protocol.statusModule as Record<string, unknown> | undefined;
  const design = protocol.designModule as Record<string, unknown> | undefined;
  const sponsor = protocol.sponsorCollaboratorsModule as Record<string, unknown> | undefined;
  const contacts = protocol.contactsLocationsModule as Record<string, unknown> | undefined;
  const nctId = String(id?.nctId ?? '');
  if (!nctId) return null;
  const locations = Array.isArray(contacts?.locations) ? (contacts?.locations as Array<Record<string, unknown>>) : [];
  const usSiteCount = locations.filter((loc) => String(loc.country ?? '').toLowerCase() === 'united states').length;
  const lead = sponsor?.leadSponsor as Record<string, unknown> | undefined;
  const phases = Array.isArray(design?.phases) ? (design?.phases as string[]).join(', ') : 'Not stated';
  return {
    nctId,
    title: String(id?.officialTitle || id?.briefTitle || 'Untitled study'),
    phase: phases,
    status: String(status?.overallStatus ?? 'RECRUITING'),
    sponsor: String(lead?.name ?? 'Not stated'),
    usSiteCount,
    url: `https://clinicaltrials.gov/study/${nctId}`,
    lastUpdated: String(
      (status?.lastUpdatePostDateStruct as { date?: string } | undefined)?.date ??
        status?.statusVerifiedDate ??
        ''
    ),
    matchedOn,
    section,
  };
}

async function fetchTerm(term: string, section: 'primary' | 'broader'): Promise<PublicTrial[]> {
  const url = new URL('https://clinicaltrials.gov/api/v2/studies');
  url.searchParams.set('query.cond', term);
  url.searchParams.set('query.locn', 'United States');
  url.searchParams.set('filter.overallStatus', 'RECRUITING');
  url.searchParams.set('countTotal', 'true');
  url.searchParams.set('pageSize', '50');
  const response = await fetch(url.toString(), {
    next: { revalidate: 86400 },
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`trials ${response.status}`);
  const json = (await response.json()) as { studies?: Record<string, unknown>[] };
  return (json.studies ?? [])
    .map((study) => parseStudy(study, term.replaceAll('"', ''), section))
    .filter((row): row is PublicTrial => Boolean(row));
}

export async function fetchPublicTrials(key: TrialLandingKey): Promise<FetchResult> {
  const config = TRIAL_TERMS[key];
  const refreshedOn = new Date().toISOString().slice(0, 10);
  try {
    const batches = await Promise.all([
      ...config.primary.map((term) => fetchTerm(term, 'primary')),
      ...config.broader.map((term) => fetchTerm(term, 'broader')),
    ]);
    const seen = new Set<string>();
    const trials: PublicTrial[] = [];
    for (const batch of batches) {
      for (const trial of batch) {
        if (seen.has(trial.nctId)) continue;
        seen.add(trial.nctId);
        trials.push(trial);
      }
    }
    trials.sort((a, b) => {
      if (a.section !== b.section) return a.section === 'primary' ? -1 : 1;
      return a.title.localeCompare(b.title);
    });
    return { trials, refreshedOn, ok: true };
  } catch {
    return { trials: [], refreshedOn, ok: false };
  }
}
