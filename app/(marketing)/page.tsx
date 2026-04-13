import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { MarketingHome } from '@/components/marketing/MarketingHome';

export const metadata: Metadata = {
  title: 'OncoKind — Clarity for Families Navigating Cancer',
  description:
    'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
  openGraph: {
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description:
      'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
    url: 'https://www.oncokind.com',
    type: 'website',
  },
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <MarketingHome signedIn={!!user} />;
}
