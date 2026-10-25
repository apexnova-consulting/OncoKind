import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { getProfile } from '@/lib/auth';

export default async function OpsLayout({ children }: { children: ReactNode }) {
  if (!isFeatureEnabled('concierge_ops_console')) redirect('/dashboard');
  const { isAdmin } = await getProfile();
  if (!isAdmin) redirect('/dashboard');
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
