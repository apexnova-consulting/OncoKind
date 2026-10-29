import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { VAULT_CONSENT_TEXT } from '@/lib/after-90/vault';
import { VaultConsentForm } from '@/components/after-90/VaultConsentForm';

export default async function VaultConsentPage() {
  if (!isAfter90FlagOn('recordsVault')) redirect('/dashboard');
  const { user } = await getProfile();
  if (!user) redirect('/login?redirect=/dashboard/vault-consent');
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Records vault consent</h1>
      <p className="mt-4 text-slate-600">{VAULT_CONSENT_TEXT}</p>
      <VaultConsentForm consentText={VAULT_CONSENT_TEXT} />
    </main>
  );
}
