import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = typeof body.action === 'string' ? body.action : '';
  const factorId = typeof body.factorId === 'string' ? body.factorId : null;

  const updates =
    action === 'enabled'
      ? {
          mfa_enabled: true,
          mfa_factor_id: factorId,
          mfa_enrolled_at: new Date().toISOString(),
        }
      : action === 'disabled'
        ? {
            mfa_enabled: false,
            mfa_factor_id: null,
            mfa_enrolled_at: null,
          }
        : null;

  if (!updates) {
    return NextResponse.json({ error: 'Invalid MFA action' }, { status: 400 });
  }

  const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
  if (error) {
    return NextResponse.json({ error: 'Failed to update MFA state' }, { status: 500 });
  }

  const serviceRole = createServiceRoleSupabaseClient();
  await serviceRole.from('ai_audit_log').insert({
    user_id: user.id,
    event_type: action === 'enabled' ? 'mfa_enrolled' : 'mfa_disabled',
    model_id: 'supabase-mfa',
    entity_type: 'profile',
    entity_id: user.id,
    details: {
      factorId,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function PUT(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const factorId = typeof body.factorId === 'string' ? body.factorId : null;

  const serviceRole = createServiceRoleSupabaseClient();
  await serviceRole.from('ai_audit_log').insert({
    user_id: user.id,
    event_type: 'mfa_verified',
    model_id: 'supabase-mfa',
    entity_type: 'profile',
    entity_id: user.id,
    details: {
      factorId,
    },
  });

  return NextResponse.json({ ok: true });
}
