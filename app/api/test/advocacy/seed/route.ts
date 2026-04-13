import { NextRequest, NextResponse } from 'next/server';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';
import { keywordFallbackMatcher } from '@/lib/advocacy/financial-aid/matcher';
import { mockFinancialAidProvider } from '@/lib/advocacy/financial-aid/mock-provider';
import { syncFinancialAidFunds } from '@/lib/advocacy/financial-aid/service';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

function ensureEnabled() {
  return process.env.ENABLE_E2E_TEST_ROUTES === '1';
}

export async function POST(request: NextRequest) {
  if (!ensureEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const subscriptionTier =
    typeof body.subscriptionTier === 'string' ? body.subscriptionTier : 'free';
  const seedFinancialHelp = body.seedFinancialHelp === true;
  const clearInsuranceCases = body.clearInsuranceCases !== false;

  const serviceRole = createServiceRoleSupabaseClient();

  await serviceRole.from('user_financial_aid_matches').delete().eq('user_id', user.id);
  await serviceRole.from('patient_reports').delete().eq('user_id', user.id);
  if (clearInsuranceCases) {
    await serviceRole.from('insurance_navigation_cases').delete().eq('user_id', user.id);
  }

  await serviceRole
    .from('profiles')
    .update({
      subscription_tier: subscriptionTier,
      subscription_status: subscriptionTier === 'free' ? 'free' : 'pro',
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (seedFinancialHelp) {
    const biomarkersBuf = encryptJson({
      names: ['EGFR'],
      statuses: ['positive'],
      tnm_stage: 'Stage IV',
      histology: 'non-small cell lung cancer',
      cancer_type_inferred: 'lung cancer',
    });

    const trialsBuf = encryptJson({ matched_trials: [] });

    await serviceRole.from('patient_reports').insert({
      user_id: user.id,
      biomarkers_json_encrypted: toSupabaseBytea(biomarkersBuf),
      matched_trials_json_encrypted: toSupabaseBytea(trialsBuf),
      confidence_score: 0.98,
    });

    const previousMode = process.env.FINANCIAL_AID_SCRAPER_MODE;
    process.env.FINANCIAL_AID_SCRAPER_MODE = 'mock';
    try {
      await syncFinancialAidFunds({
        provider: mockFinancialAidProvider,
        matcher: keywordFallbackMatcher,
      });
    } finally {
      process.env.FINANCIAL_AID_SCRAPER_MODE = previousMode;
    }
  }

  return NextResponse.json({
    ok: true,
    subscriptionTier,
    seededFinancialHelp: seedFinancialHelp,
  });
}
