import { createServerSupabaseClient } from '@/lib/supabase-server';
import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient';
import { getDictionaryFromCookies } from '@/lib/i18n-server';

export async function SiteHeader() {
  const supabase = await createServerSupabaseClient();
  const t = await getDictionaryFromCookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navLinks = [
    { href: '/#how-it-works', label: t['nav.howItWorks'] },
    { href: '/signup', label: t['nav.caregiverTools'] },
  ];

  return (
    <SiteHeaderClient
      navLinks={navLinks}
      signedIn={!!user}
      labels={{
        login: t['nav.login'],
        signup: t['nav.signup'],
        journey: t['nav.goToJourney'],
      }}
    />
  );
}
