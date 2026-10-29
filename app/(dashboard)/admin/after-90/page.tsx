import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';

export default async function After90AdminPage() {
  const { isAdmin } = await getProfile();
  if (!isAdmin) redirect('/dashboard');
  const supabase = await createServerSupabaseClient();
  const { count: keepChosen } = await supabase
    .from('product_events')
    .select('id', { count: 'exact', head: true })
    .eq('event', 'keep_chosen');
  const { count: pauses } = await supabase
    .from('product_events')
    .select('id', { count: 'exact', head: true })
    .eq('event', 'pause_chosen');
  const { count: cancels } = await supabase
    .from('product_events')
    .select('id', { count: 'exact', head: true })
    .eq('event', 'cancel_completed');
  const { count: rollovers } = await supabase
    .from('keep_rollover_consents')
    .select('id', { count: 'exact', head: true })
    .eq('ticked', true);
  const { data: contracts } = isAfter90FlagOn('orgSponsorship')
    ? await supabase.from('org_sponsorship_contracts').select('seats_purchased')
    : { data: [] as Array<{ seats_purchased: number }> };
  const { count: seatsUsed } = await supabase
    .from('org_sponsored_seats')
    .select('id', { count: 'exact', head: true });
  const seatsPurchased = (contracts ?? []).reduce((sum, row) => sum + (row.seats_purchased ?? 0), 0);
  const saveRate = (cancels ?? 0) + (pauses ?? 0) === 0 && (cancels ?? 0) === 0
    ? 0
    : ((pauses ?? 0) + (keepChosen ?? 0)) / Math.max(1, (pauses ?? 0) + (keepChosen ?? 0) + (cancels ?? 0));

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">After 90 days metrics</h1>
      <p className="mt-2 text-sm text-slate-600">Counts only. No names or diagnoses.</p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>Keep chosen: {keepChosen ?? 0}</li>
        <li>Pause chosen: {pauses ?? 0}</li>
        <li>Cancel completed: {cancels ?? 0}</li>
        <li>Save rate: {Math.round(saveRate * 100)}%</li>
        <li>Rollover consents ticked: {rollovers ?? 0}</li>
        <li>Sponsored seats used / bought: {seatsUsed ?? 0} / {seatsPurchased}</li>
      </ul>
    </main>
  );
}
