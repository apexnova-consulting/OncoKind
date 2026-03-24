import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const CTG_BASE = 'https://clinicaltrials.gov/api/v2';

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

function resolveTier(subscriptionStatus?: string | null, subscriptionTier?: string | null): Tier {
  if (subscriptionTier === 'enterprise') return 'professional';
  if (subscriptionStatus === 'pro') return 'pro';
  return 'free';
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cancerType = searchParams.get('cancerType') ?? '';
  const stage = searchParams.get('stage') ?? '';
  const biomarkers = searchParams.get('biomarkers') ?? '';
  const phase = searchParams.get('phase') ?? 'all';
  const trialType = searchParams.get('trialType') ?? 'all';
  const zip = searchParams.get('zip') ?? '';
  const requestedRadius = Number(searchParams.get('radius') ?? 50);
  const pageSize = Math.min(Number(searchParams.get('pageSize') ?? 20), 50);

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let tier: Tier = 'free';
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_tier')
        .eq('id', user.id)
        .single();
      tier = resolveTier(profile?.subscription_status, profile?.subscription_tier);
    }

    const radius =
      tier === 'free' ? requestedRadius :
      tier === 'pro' ? Math.min(requestedRadius, 50) :
      requestedRadius;

    const queryTerms = [cancerType, stage, biomarkers].filter(Boolean).join(' ');
    const query = queryTerms || 'oncology';

    const params = new URLSearchParams();
    params.set('query.term', query);
    params.set('pageSize', String(pageSize));
    params.set('format', 'json');
    if (zip) params.set('query.locn', zip);
    if (phase !== 'all') params.set('query.intr', phase);
    if (trialType !== 'all') params.set('query.cond', trialType);

    const url = `${CTG_BASE}/studies?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Trials service unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const studies = (data.studies ?? []) as Array<{
      protocolSection?: {
        identificationModule?: { nctId?: string; briefTitle?: string; organization?: { fullName?: string } };
        statusModule?: { overallStatus?: string };
        designModule?: { phases?: string[]; studyType?: string };
        contactsLocationsModule?: { locations?: Array<{ city?: string; state?: string; zip?: string; country?: string }> };
        eligibilityModule?: { eligibilityCriteria?: string };
      };
    }>;

    const normalized: Trial[] = studies.map((s) => {
      const nct = s.protocolSection?.identificationModule?.nctId;
      const location = s.protocolSection?.contactsLocationsModule?.locations?.[0];
      const locationText = [location?.city, location?.state, location?.country].filter(Boolean).join(', ');
      const eligibility = s.protocolSection?.eligibilityModule?.eligibilityCriteria ?? '';
      return {
        id: nct,
        title: s.protocolSection?.identificationModule?.briefTitle,
        status: s.protocolSection?.statusModule?.overallStatus,
        phase: s.protocolSection?.designModule?.phases?.join(', ') || 'N/A',
        sponsor: s.protocolSection?.identificationModule?.organization?.fullName || 'N/A',
        trialType: s.protocolSection?.designModule?.studyType || 'N/A',
        eligibilitySnippet: eligibility ? eligibility.slice(0, 220) + (eligibility.length > 220 ? '…' : '') : 'Eligibility details available on trial page.',
        locationText: locationText || 'Location details available on trial page.',
        distanceLabel: zip ? `Within ${radius} miles of ${zip}` : 'Distance based on selected region',
        url: nct ? `https://clinicaltrials.gov/study/${nct}` : undefined,
      };
    });

    const visibleCount = tier === 'free' ? 3 : normalized.length;
    return NextResponse.json({
      tier,
      radiusApplied: radius,
      visibleCount,
      total: normalized.length,
      studies: normalized,
    });
  } catch (err) {
    console.error('trials api error:', err);
    return NextResponse.json({ error: 'Failed to fetch trials' }, { status: 500 });
  }
}
