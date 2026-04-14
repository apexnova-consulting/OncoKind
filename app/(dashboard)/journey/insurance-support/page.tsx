import { redirect } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { getProfile } from '@/lib/auth';
import { InsuranceSupportWorkbench } from '@/components/insurance/InsuranceSupportWorkbench';

export default async function InsuranceSupportPage() {
  const { user, hasAdvocateAccess } = await getProfile();
  if (!user) return null;
  if (!hasAdvocateAccess) {
    redirect('/pricing?plan=advocate');
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" aria-hidden />
            <h1 className="text-2xl font-semibold text-slate-900">Insurance Support</h1>
          </div>
          <p className="mt-4 text-slate-600">
            Decode denial letters, draft a Letter of Medical Necessity, and follow a structured appeal checklist using
            your oncology report context.
          </p>
        </div>

        <InsuranceSupportWorkbench hasAdvocateAccess={hasAdvocateAccess} />
      </div>
    </div>
  );
}
