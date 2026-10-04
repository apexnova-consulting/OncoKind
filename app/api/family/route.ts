import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';

async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  if (!isFeatureEnabled('feature_oncokind_family')) {
    return NextResponse.json({ error: 'Feature disabled' }, { status: 404 });
  }
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user.id)
    .maybeSingle();
  if (!family) return NextResponse.json({ family: null, members: [] });

  const { data: members } = await supabase
    .from('family_members')
    .select('id, relationship, lineage, living_status, cancer_type, diagnosis_age, approx_age, genetic_testing_status, hidden, claimed_by')
    .eq('family_id', family.id);

  return NextResponse.json({ family, members: members ?? [] });
}

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('feature_oncokind_family')) {
    return NextResponse.json({ error: 'Feature disabled' }, { status: 404 });
  }
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json().catch(() => ({}));

  let { data: family } = await supabase
    .from('families')
    .select('id')
    .eq('owner_user_id', user.id)
    .maybeSingle();
  if (!family) {
    const created = await supabase
      .from('families')
      .insert({ owner_user_id: user.id, report_id: body.reportId ?? null })
      .select('id')
      .single();
    family = created.data;
  }
  if (!family) return NextResponse.json({ error: 'Could not create family' }, { status: 500 });

  const note = body.genetic_testing_note ? toSupabaseBytea(encryptJson({ note: body.genetic_testing_note })) : null;
  const health = toSupabaseBytea(
    encryptJson({
      cancer_type: body.cancer_type ?? 'I do not know',
      diagnosis_age: body.diagnosis_age ?? 'I do not know',
    })
  );

  const { data: member, error } = await supabase
    .from('family_members')
    .insert({
      family_id: family.id,
      created_by: user.id,
      relationship: body.relationship ?? 'I do not know',
      lineage: body.lineage ?? 'I do not know',
      living_status: body.living_status ?? 'I do not know',
      cancer_type: body.cancer_type ?? 'I do not know',
      diagnosis_age: body.diagnosis_age ?? 'I do not know',
      birth_year: body.birth_year ?? 'I do not know',
      approx_age: body.approx_age ?? 'I do not know',
      age_at_death: body.age_at_death ?? 'I do not know',
      genetic_testing_status: body.genetic_testing_status ?? 'unknown',
      genetic_testing_note_encrypted: note,
      sex_assigned_at_birth: body.sex_assigned_at_birth ?? null,
      gender_identity: body.gender_identity ?? null,
      health_details_encrypted: health,
    })
    .select('id')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await supabase.from('audit_log').insert({
    family_id: family.id,
    actor_user_id: user.id,
    action: 'member_created',
    metadata: { member_id: member.id },
  });
  return NextResponse.json({ member });
}

export async function DELETE(request: NextRequest) {
  if (!isFeatureEnabled('feature_oncokind_family')) {
    return NextResponse.json({ error: 'Feature disabled' }, { status: 404 });
  }
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { memberId } = await request.json();
  const { error } = await supabase.from('family_members').delete().eq('id', memberId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
