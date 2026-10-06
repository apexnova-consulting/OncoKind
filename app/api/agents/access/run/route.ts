import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { estimateTravelCost } from '@/lib/agents/access/estimate';
import { matchPrograms } from '@/lib/agents/access/match';
import { accessProgramLimit } from '@/lib/agents/entitlements';
import { containsCrisisLanguage } from '@/lib/agents/safety';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_access_agent')) {
    return NextResponse.json({ error: 'Access Agent is not enabled.' }, { status: 404 });
  }
  const { user, profile } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const intake = (await request.json()) as Record<string, unknown>;
  const blob = JSON.stringify(intake);
  if (containsCrisisLanguage(blob)) {
    return NextResponse.json({
      kind: 'crisis',
      message: 'If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.',
    });
  }

  const estimate = estimateTravelCost(intake);
  const includeUnverified = process.env.FEATURE_ACCESS_INCLUDE_UNVERIFIED === '1';
  let matches = matchPrograms(intake, { includeUnverified: includeUnverified || process.env.NODE_ENV !== 'production' });
  const limit = accessProgramLimit(profile?.subscription_tier);
  if (limit !== 'all') matches = matches.slice(0, limit);

  return NextResponse.json({ kind: 'ok', estimate, matches });
}
