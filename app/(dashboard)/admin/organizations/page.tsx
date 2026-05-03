import { requireAdmin } from '@/lib/admin';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { OrganizationsAdminPanel } from '@/components/admin/OrganizationsAdminPanel';

export const metadata = {
  title: 'Organization Admin',
  description: 'Create and manage white-label organizations.',
};

export default async function OrganizationsAdminPage() {
  await requireAdmin();
  const service = createServiceRoleSupabaseClient();
  const { data: organizations } = await service
    .from('organizations')
    .select('id, slug, display_name, custom_domain, is_active, hipaa_baa_signed_at')
    .order('created_at', { ascending: false });

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-6">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Admin
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            Organizations
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Internal white-label foundation. An organization cannot be activated until a HIPAA BAA
            signature date is recorded.
          </p>
        </section>
        <OrganizationsAdminPanel organizations={organizations ?? []} />
      </div>
    </main>
  );
}
