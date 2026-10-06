import type { Metadata } from 'next';
import VoiceBetaPage from './VoiceBetaClient';
import { SITE_ORIGIN } from '@/lib/pricing-config';

export const metadata: Metadata = {
  title: 'Call for me beta',
  description: 'Request invite-only access to OncoKind Call for me. Process questions only. No PHI on calls.',
  alternates: { canonical: `${SITE_ORIGIN}/voice-beta` },
};

export default function Page() {
  return <VoiceBetaPage />;
}
