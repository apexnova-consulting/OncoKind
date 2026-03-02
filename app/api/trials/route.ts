import { NextRequest, NextResponse } from 'next/server';

/** ClinicalTrials.gov API v2 — fetch top N studies by query. */
const CTG_BASE = 'https://clinicaltrials.gov/api/v2';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? 'oncology';
  const pageSize = Math.min(Number(searchParams.get('pageSize')) || 3, 10);

  try {
    const url = `${CTG_BASE}/studies?query=${encodeURIComponent(query)}&pageSize=${pageSize}&format=json`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const fallback = await fetch(
        `https://clinicaltrials.gov/api/query/study_fields?expr=${encodeURIComponent(query)}&fields=NCTId,BriefTitle,OverallStatus&min_rnk=1&max_rnk=${pageSize}&fmt=json`
      ).then((r) => r.json()).catch(() => null);
      if (fallback?.StudyFieldsResponse?.StudyFields) {
        const studies = fallback.StudyFieldsResponse.StudyFields.map((s: { NCTId?: string[]; BriefTitle?: string[]; OverallStatus?: string[] }) => ({
          id: s.NCTId?.[0],
          title: s.BriefTitle?.[0],
          status: s.OverallStatus?.[0],
          url: s.NCTId?.[0] ? `https://clinicaltrials.gov/study/${s.NCTId[0]}` : undefined,
        }));
        return NextResponse.json(studies);
      }
      return NextResponse.json({ error: 'Trials service unavailable' }, { status: 502 });
    }
    const data = await res.json();
    const studies = (data.studies ?? []).slice(0, pageSize).map((s: { protocolSection?: { identificationModule?: { nctId?: string; briefTitle?: string }; statusModule?: { overallStatus?: string } } }) => ({
      id: s.protocolSection?.identificationModule?.nctId,
      title: s.protocolSection?.identificationModule?.briefTitle,
      status: s.protocolSection?.statusModule?.overallStatus,
      url: s.protocolSection?.identificationModule?.nctId
        ? `https://clinicaltrials.gov/study/${s.protocolSection.identificationModule.nctId}`
        : undefined,
    }));
    return NextResponse.json(studies);
  } catch (err) {
    console.error('trials api error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch trials' },
      { status: 500 }
    );
  }
}
