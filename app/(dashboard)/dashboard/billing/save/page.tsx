import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { SaveFlowForm } from '@/components/billing/SaveFlowForm';
import { saveScreen1 } from '@/lib/after-90/save-flow';

export default async function SaveFlowPage() {
  if (!isAfter90FlagOn('saveFlow')) redirect('/dashboard/billing');
  const { user, profile, isPro, hasKeepAccess } = await getProfile();
  if (!user) redirect('/login?redirect=/dashboard/billing/save');
  if (!isPro && !hasKeepAccess) redirect('/dashboard/billing');
  const screen = saveScreen1({ currentPlan: profile?.subscription_tier ?? 'pro' });
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Cancel or pause</h1>
      <p className="mt-3 text-slate-600">Cancel stays on this first screen. Confirm is one more click.</p>
      <SaveFlowForm
        pauseMonths={[...screen.pauseMonths]}
        showSwitchKeep={screen.showSwitchKeep}
        switchKeepLabel={screen.switchKeepLabel}
        cancelLabel={screen.cancelLabel}
      />
    </main>
  );
}
