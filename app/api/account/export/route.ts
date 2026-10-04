import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isFeatureEnabled } from '@/lib/feature-flags';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload: Record<string, unknown> = { userId: user.id, exportedAt: new Date().toISOString() };

  if (isFeatureEnabled('feature_oncokind_family')) {
    const { data: families } = await supabase.from('families').select('*').eq('owner_user_id', user.id);
    const familyIds = (families ?? []).map((row) => row.id);
    const { data: members } = familyIds.length
      ? await supabase.from('family_members').select('*').in('family_id', familyIds)
      : { data: [] };
    payload.families = families ?? [];
    payload.family_members = members ?? [];
  }

  return NextResponse.json(payload);
}
