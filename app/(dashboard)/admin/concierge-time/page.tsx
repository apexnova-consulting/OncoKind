import { requireAdmin } from '@/lib/admin';
import { StaffTimeLogger } from '@/components/concierge/StaffTimeLogger';

export const metadata = {
  title: 'Concierge time log',
  description: 'Staff time entries. Families never see this page.',
};

export default async function ConciergeTimePage() {
  await requireAdmin();
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Concierge time log</h1>
      <p className="text-sm text-slate-600">Log every completed step. Families never see time entries.</p>
      <StaffTimeLogger />
    </main>
  );
}
