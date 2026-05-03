import { NextRequest, NextResponse } from 'next/server';
import { getAdminContext } from '@/lib/admin';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const admin = await getAdminContext();
  if (!admin.user || !admin.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const payload = {
    slug: typeof body?.slug === 'string' ? body.slug.trim() : '',
    display_name: typeof body?.displayName === 'string' ? body.displayName.trim() : '',
    logo_url: typeof body?.logoUrl === 'string' ? body.logoUrl.trim() || null : null,
    primary_color: typeof body?.primaryColor === 'string' ? body.primaryColor.trim() || '#0d1b2a' : '#0d1b2a',
    secondary_color:
      typeof body?.secondaryColor === 'string' ? body.secondaryColor.trim() || '#1b2d42' : '#1b2d42',
    accent_color: typeof body?.accentColor === 'string' ? body.accentColor.trim() || '#e8a838' : '#e8a838',
    custom_domain: typeof body?.customDomain === 'string' ? body.customDomain.trim() || null : null,
    footer_disclaimer:
      typeof body?.footerDisclaimer === 'string' ? body.footerDisclaimer.trim() || null : null,
    hipaa_baa_signed_at:
      typeof body?.hipaaBaaSignedAt === 'string' ? body.hipaaBaaSignedAt || null : null,
    is_active: Boolean(body?.isActive),
  };

  if (!payload.slug || !payload.display_name) {
    return NextResponse.json({ error: 'Slug and display name are required.' }, { status: 400 });
  }
  if (payload.is_active && !payload.hipaa_baa_signed_at) {
    return NextResponse.json({ error: 'Record the BAA signature before activating an organization.' }, { status: 400 });
  }

  const service = createServiceRoleSupabaseClient();
  const { data, error } = await service.from('organizations').insert(payload).select('*').single();

  if (error || !data) {
    return NextResponse.json({ error: 'Unable to create organization right now.' }, { status: 500 });
  }

  return NextResponse.json({ organization: data });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminContext();
  if (!admin.user || !admin.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const id = typeof body?.id === 'string' ? body.id : '';
  const isActive = Boolean(body?.isActive);

  if (!id) {
    return NextResponse.json({ error: 'Organization id is required.' }, { status: 400 });
  }

  const service = createServiceRoleSupabaseClient();
  const { data: existing } = await service
    .from('organizations')
    .select('hipaa_baa_signed_at')
    .eq('id', id)
    .maybeSingle();

  if (!existing) {
    return NextResponse.json({ error: 'Organization not found.' }, { status: 404 });
  }

  if (isActive && !existing.hipaa_baa_signed_at) {
    return NextResponse.json({ error: 'Record the BAA signature before activating an organization.' }, { status: 400 });
  }

  const { error } = await service
    .from('organizations')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: 'Unable to update organization right now.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
