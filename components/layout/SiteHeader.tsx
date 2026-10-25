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
    { href: '/features', label: 'Tools' },
    ...(isFeatureEnabled('concierge_public_pages') ? [{ href: '/concierge', label: 'Concierge' }] : []),
    { href: '/professional', label: 'For organizations' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/learn', label: 'Learn' },
    { href: '/trust', label: 'Trust' },
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
