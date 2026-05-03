'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type OrganizationRow = {
  id: string;
  slug: string;
  display_name: string;
  custom_domain: string | null;
  is_active: boolean;
  hipaa_baa_signed_at: string | null;
};

export function OrganizationsAdminPanel({ organizations }: { organizations: OrganizationRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: '',
    displayName: '',
    logoUrl: '',
    primaryColor: '#0d1b2a',
    secondaryColor: '#1b2d42',
    accentColor: '#e8a838',
    customDomain: '',
    footerDisclaimer: '',
    hipaaBaaSignedAt: '',
    isActive: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const response = await fetch('/api/admin/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Unable to create organization.');
      setSaving(false);
      return;
    }

    setForm({
      slug: '',
      displayName: '',
      logoUrl: '',
      primaryColor: '#0d1b2a',
      secondaryColor: '#1b2d42',
      accentColor: '#e8a838',
      customDomain: '',
      footerDisclaimer: '',
      hipaaBaaSignedAt: '',
      isActive: false,
    });
    setSaving(false);
    router.refresh();
  }

  async function toggleOrganization(id: string, isActive: boolean) {
    const response = await fetch('/api/admin/organizations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isActive }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Unable to update organization.');
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={createOrganization} className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
          Create organization
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Input label="Slug" value={form.slug} onChange={(slug) => setForm((prev) => ({ ...prev, slug }))} required />
          <Input
            label="Display name"
            value={form.displayName}
            onChange={(displayName) => setForm((prev) => ({ ...prev, displayName }))}
            required
          />
          <Input label="Logo URL" value={form.logoUrl} onChange={(logoUrl) => setForm((prev) => ({ ...prev, logoUrl }))} />
          <Input
            label="Custom domain"
            value={form.customDomain}
            onChange={(customDomain) => setForm((prev) => ({ ...prev, customDomain }))}
          />
          <Input
            label="Primary color"
            value={form.primaryColor}
            onChange={(primaryColor) => setForm((prev) => ({ ...prev, primaryColor }))}
          />
          <Input
            label="Secondary color"
            value={form.secondaryColor}
            onChange={(secondaryColor) => setForm((prev) => ({ ...prev, secondaryColor }))}
          />
          <Input
            label="Accent color"
            value={form.accentColor}
            onChange={(accentColor) => setForm((prev) => ({ ...prev, accentColor }))}
          />
          <Input
            label="HIPAA BAA signed at"
            type="datetime-local"
            value={form.hipaaBaaSignedAt}
            onChange={(hipaaBaaSignedAt) => setForm((prev) => ({ ...prev, hipaaBaaSignedAt }))}
          />
        </div>
        <label className="mt-4 block text-sm font-semibold text-[var(--color-primary-900)]">
          Footer disclaimer
          <textarea
            value={form.footerDisclaimer}
            onChange={(event) => setForm((prev) => ({ ...prev, footerDisclaimer: event.target.value }))}
            className="mt-1 min-h-[90px] w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
          />
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-[var(--color-primary-900)]">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
          />
          Activate immediately
        </label>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        <Button type="submit" className="mt-4" disabled={saving}>
          {saving ? 'Saving…' : 'Create organization'}
        </Button>
      </form>

      <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
          Organizations
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                <th className="px-3 py-3">Slug</th>
                <th className="px-3 py-3">Display name</th>
                <th className="px-3 py-3">Domain</th>
                <th className="px-3 py-3">BAA signed</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.id} className="border-b border-[var(--color-border-subtle)]">
                  <td className="px-3 py-4 font-medium text-[var(--color-primary-900)]">{organization.slug}</td>
                  <td className="px-3 py-4">{organization.display_name}</td>
                  <td className="px-3 py-4">{organization.custom_domain ?? 'Subdomain only'}</td>
                  <td className="px-3 py-4">{organization.hipaa_baa_signed_at ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-4">
                    <Button
                      type="button"
                      variant={organization.is_active ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleOrganization(organization.id, !organization.is_active)}
                    >
                      {organization.is_active ? 'Active' : 'Inactive'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="text-sm font-semibold text-[var(--color-primary-900)]">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
      />
    </label>
  );
}
