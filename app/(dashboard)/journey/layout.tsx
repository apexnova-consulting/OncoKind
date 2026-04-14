import { createServerSupabaseClient } from '@/lib/supabase-server';
import { ProgressStrip } from '@/components/care/ProgressStrip';
import { JourneySidebar } from '@/components/care/JourneySidebar';

export default async function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { count } = user
    ? (await supabase.from('patient_reports').select('*', { count: 'exact', head: true }).eq('user_id', user.id))
    : { count: 0 };
  const hasReport = (count ?? 0) > 0;
  const { data: profile } = user
    ? await supabase.from('profiles').select('subscription_tier').eq('id', user.id).maybeSingle()
    : { data: null };
  const hasAdvocateAccess =
    profile?.subscription_tier === 'advocate' || profile?.subscription_tier === 'enterprise';

  const currentStage = hasReport ? 'treatment-planning' : 'diagnosis';
  const completedStages: ('diagnosis' | 'treatment-planning' | 'active-treatment' | 'monitoring')[] = hasReport ? ['diagnosis'] : [];

  return (
    <div className="flex min-h-screen flex-col">
      <ProgressStrip currentStage={currentStage} completedStages={completedStages} />
      <div className="flex flex-1">
        <JourneySidebar hasAdvocateAccess={hasAdvocateAccess} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
