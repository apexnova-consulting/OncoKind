import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getBrandTheme } from '@/lib/branding';
import { SiteHeaderClient } from '@/components/layout/SiteHeaderClient';
import { getDictionaryFromCookies } from '@/lib/i18n-server';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { PUBLIC_NAV_LINKS } from '@/lib/public-nav';

export async function SiteHeader() {
  const supabase = await createServerSupabaseClient();
  const brandTheme = await getBrandTheme();
  const t = await getDictionaryFromCookies();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  const navLinks = PUBLIC_NAV_LINKS.filter(
    (link) => link.href !== '/concierge' || isFeatureEnabled('concierge_public_pages')
  );

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
