import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { CENTER_SEEDS } from '@/content/concierge/centers/v1';

export const metadata = {
  title: 'Facility playbooks',
  description: 'Process notes only. Never patient data.',
};

export default async function PlaybooksPage() {
  await requireAdmin();
  if (!isFeatureEnabled('staff_back_office')) redirect('/admin/organizations');
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Facility playbooks</h1>
      <p className="text-sm text-slate-600">Process notes only. Never patient data.</p>
      <ul className="space-y-3">
        {CENTER_SEEDS.slice(0, 8).map((center) => (
          <li key={center.center_id} className="rounded-xl border bg-white p-4">
            <p className="font-medium">
              {center.name} ({center.city}, {center.state})
            </p>
            <p className="mt-1 text-sm text-slate-600">Required records: pathology, imaging, staging notes, insurance card.</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
