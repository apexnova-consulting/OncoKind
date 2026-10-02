import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';

export default async function MultiPatientAdminPage() {
  const { isProfessional, isAdmin } = await getProfile();
  if (!isProfessional && !isAdmin) {
    redirect('/pricing?reason=b2b_required');
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirect=/admin/multi-patient');

  const { data: cases } = await supabase
    .from('prior_auth_cases')
    .select('id, case_type, status, patient_identifier, medication_name, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(100);

  const patients = new Map<string, number>();
  for (const row of cases ?? []) {
    const key = row.patient_identifier?.trim() || 'Unlabeled case';
    patients.set(key, (patients.get(key) ?? 0) + 1);
  }

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)]">
          KindAuth Pro
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-[var(--color-text-primary)]">
          Multi-patient batch workspace
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Professional and Enterprise can process appeals across patients. Batch intake groups
          cases by de-identified patient reference.
        </p>
      </div>

      <section className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-[var(--color-text-primary)]">Patients in workspace</h2>
        {patients.size === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">No KindAuth cases yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--color-border-subtle)]">
            {Array.from(patients.entries()).map(([patient, count]) => (
              <li key={patient} className="flex items-center justify-between py-3 text-sm">
                <span className="font-medium text-[var(--color-text-primary)]">{patient}</span>
                <span className="text-[var(--color-text-muted)]">{count} case{count === 1 ? '' : 's'}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6">
          <Button asChild>
            <Link href="/prior-auth">Open KindAuth workspace</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
