import { createServerSupabaseClient } from '@/lib/supabase-server';
import { MarketingHome } from '@/components/marketing/MarketingHome';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <MarketingHome signedIn={!!user} />;
}
