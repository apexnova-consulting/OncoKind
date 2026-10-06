import { NextRequest, NextResponse } from 'next/server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { runCompleteThePicture } from '@/lib/agents/ctp/pipeline';
import { ctpOpenQuestionsLimit } from '@/lib/agents/entitlements';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_complete_the_picture')) {
    return NextResponse.json({ error: 'Complete the Picture is not enabled.' }, { status: 404 });
  }
  const { user, profile } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const body = (await request.json()) as {
    reportText?: string;
    cancerType?: string;
    stage?: string;
    ageYears?: number;
  };
  const reportText = (body.reportText ?? '').slice(0, 80_000);
  const result = runCompleteThePicture({
    reportText,
    cancerType: body.cancerType,
    stage: body.stage,
    ageYears: body.ageYears,
    userId: user.id,
  });

  if (result.kind === 'ok') {
    const limit = ctpOpenQuestionsLimit(profile?.subscription_tier);
    if (limit !== 'all') {
      let remaining = limit;
      result.evaluations = result.evaluations.map((item) => {
        if (item.status === 'found') return item;
        if (remaining > 0) {
          remaining -= 1;
          return item;
        }
        return { ...item, ask_whether_recommended: 'Upgrade to Caregiver Pro to see the rest of the question list.' };
      });
    }
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.from('agent_runs').insert({
        user_id: user.id,
        agent_kind: 'complete_the_picture',
        state: result.needsConfirmation.length ? 'awaiting_user' : 'completed',
        idempotency_key: result.idempotencyKey,
        result_encrypted: toSupabaseBytea(encryptJson({ summary: result.summary, evaluationCount: result.evaluations.length })),
      });
    } catch {
      // Persistence is best effort until the migration is applied.
    }
  }

  return NextResponse.json(result);
}
