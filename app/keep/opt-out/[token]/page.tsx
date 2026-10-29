import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { KEEP_PLAN_NAME } from '@/lib/after-90/config';

export default async function KeepOptOutPage({ params }: { params: { token: string } }) {
  const supabase = createServiceRoleSupabaseClient();
  const { data } = await supabase
    .from('keep_rollover_consents')
    .select('id, ticked, opted_out_at')
    .eq('opt_out_token', params.token)
    .maybeSingle();
  if (!data) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-display text-3xl font-semibold">Link not found</h1>
        <p className="mt-4 text-slate-600">This opt-out link is invalid or already used.</p>
      </main>
    );
  }
  if (!data.opted_out_at) {
    await supabase
      .from('keep_rollover_consents')
      .update({ ticked: false, opted_out_at: new Date().toISOString() })
      .eq('id', data.id);
  }
  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">You opted out of {KEEP_PLAN_NAME}</h1>
      <p className="mt-4 text-slate-600">
        We will not start {KEEP_PLAN_NAME} billing from this Concierge rollover. You can still choose {KEEP_PLAN_NAME} later from pricing if you are eligible.
      </p>
    </main>
  );
}
