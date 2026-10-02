import { NextResponse } from 'next/server';
import { hasKindAuthPro, hasKindAuthSelfServe } from '@/lib/entitlements';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function requireKindAuthUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, organization_id, is_admin, email')
    .eq('id', user.id)
    .single();

  const allowedEmails = [
    ...(process.env.ADMIN_EMAILS ?? '').split(','),
    ...(process.env.QA_ADMIN_EMAILS ?? '').split(','),
  ]
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin =
    Boolean(profile?.is_admin) ||
    (email ? allowedEmails.includes(email) : false);

  const tier = profile?.subscription_tier ?? 'free';
  if (!isAdmin && !hasKindAuthSelfServe(tier)) {
    return {
      error: NextResponse.json(
        { error: 'Care & Advocacy Pro required', redirectTo: '/pricing?reason=kindauth' },
        { status: 403 }
      ),
    };
  }

  return {
    supabase,
    user,
    profile,
    isAdmin,
    isMultiPatient: isAdmin || hasKindAuthPro(tier),
  };
}
