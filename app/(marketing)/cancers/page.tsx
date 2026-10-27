import Link from 'next/link';
import { CANCER_LANDINGS, CANCER_LANDINGS_PITCH } from '@/lib/cancers/landings';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Rare women cancers',
  description: CANCER_LANDINGS_PITCH,
  path: '/cancers',
});

export default function CancersIndexPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-[var(--color-primary-900)]">
          Diagnosis pages for families
        </h1>
        <p className="mt-4 text-lg text-[var(--color-text-secondary)]">{CANCER_LANDINGS_PITCH}</p>
        <ul className="mt-10 space-y-4">
          {CANCER_LANDINGS.map((landing) => (
            <li key={landing.slug}>
              <Link
                href={`/cancers/${landing.slug}`}
                className="block rounded-2xl border border-[var(--color-border)] bg-white p-6 hover:border-[#0F6E56]"
              >
                <p className="font-semibold text-[var(--color-primary-900)]">{landing.name}</p>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{landing.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
