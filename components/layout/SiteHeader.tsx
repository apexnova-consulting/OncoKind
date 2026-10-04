import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getBrandTheme } from '@/lib/branding';
import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient';
import { getDictionaryFromCookies } from '@/lib/i18n-server';
import { isFeatureEnabled } from '@/lib/feature-flags';

export async function SiteHeader() {
  const supabase = await createServerSupabaseClient();
  const brandTheme = await getBrandTheme();
  const t = await getDictionaryFromCookies();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    ...(isFeatureEnabled('feature_first_72_hours')
      ? [{ href: '/first-72-hours', label: 'First 72' }]
      : []),
    { href: '/professional', label: 'Professionals' },
    { href: '/community', label: 'Community' },
    { href: '/learn', label: 'Resources' },
  ];

  return (
    <SiteHeaderClient
      brand={{
        displayName: brandTheme.displayName,
        logoUrl: brandTheme.logoUrl,
      }}
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
