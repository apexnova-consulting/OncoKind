import Link from 'next/link';
import type { Metadata } from 'next';
import { RESOURCE_ARTICLES } from '@/lib/resources-content';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Cancer Resources',
  description:
    'Plain-language guides written to help families navigate cancer care with clarity and confidence.',
};

export default function ResourcesIndexPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-8">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Cancer Resources
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            Plain-language guides for families navigating cancer care
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            Professional, evergreen articles written to help families navigate cancer care with
            clarity and confidence.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {RESOURCE_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]"
            >
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {article.excerpt}
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href={`/resources/${article.slug}`}>Read Article →</Link>
              </Button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
