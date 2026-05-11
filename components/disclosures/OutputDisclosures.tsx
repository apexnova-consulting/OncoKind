import { MEDICAL_DISCLAIMER_TEXT } from '@/lib/disclosures';
import { cn } from '@/lib/utils';

export function OutputSources({
  title = 'Sources',
  items,
  className,
}: {
  title?: string;
  items: string[];
  className?: string;
}) {
  return (
    <section className={cn('rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-4', className)}>
      <p className="text-sm font-semibold text-[var(--color-primary-900)]">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="pt-0.5 text-[var(--color-accent-600)]">
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MedicalDisclaimer({
  text = MEDICAL_DISCLAIMER_TEXT,
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-sm leading-relaxed text-[var(--color-text-muted)]',
        className
      )}
    >
      {text}
    </p>
  );
}
