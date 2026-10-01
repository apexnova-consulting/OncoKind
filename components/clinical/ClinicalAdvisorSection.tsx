const ADVISOR_ENABLED = process.env.NEXT_PUBLIC_CLINICAL_ADVISOR_ENABLED === 'true';

export function ClinicalAdvisorSection({
  name = 'Clinical advisor name forthcoming',
  credentials = 'Credentials and affiliation forthcoming',
  bio = 'A short bio will appear here once the clinical advisor is confirmed.',
}: {
  name?: string;
  credentials?: string;
  bio?: string;
}) {
  if (!ADVISOR_ENABLED) return null;

  return (
    <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
      <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
        Clinical Advisor
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary-900)]">
        {name}
      </h2>
      <p className="mt-2 text-sm font-medium text-[var(--color-text-muted)]">{credentials}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
        {bio}
      </p>
    </section>
  );
}
