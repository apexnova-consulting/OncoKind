import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const metadata: Metadata = {
  title: 'OncoKind Prior Auth | Authorization & Appeal Engine',
  description:
    'AI-powered prior authorization, step therapy exception, and continued stay defense for care facilities.',
  robots: { index: false, follow: false },
};

export default async function PriorAuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/prior-auth');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, full_name, email, is_admin')
    .eq('id', user.id)
    .single();

  const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin =
    Boolean(profile?.is_admin) ||
    profile?.subscription_tier === 'enterprise' ||
    (email ? allowedEmails.includes(email) : false);

  const allowedTiers = ['professional', 'enterprise'];
  const hasAccess =
    isAdmin ||
    (profile?.subscription_tier != null && allowedTiers.includes(profile.subscription_tier));
  if (!hasAccess) {
    redirect('/dashboard/billing?upgrade=prior-auth');
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Standalone workspace header — intentionally separate from SiteHeader */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#1C2B2D] px-6 py-4 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-300">
            <span className="font-display text-lg font-semibold text-[#E8C37A]">OncoKind</span>
            {' | '}
            <span>Prior Auth Engine</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-xs text-slate-400 sm:inline">{profile?.email}</span>
          <a
            href="/dashboard"
            className="text-xs text-[#6B8F71] transition-colors hover:text-white"
          >
            ← Back to Dashboard
          </a>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
