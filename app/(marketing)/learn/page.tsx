import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { LEARN_ARTICLES } from '@/lib/learn-content';

export const metadata: Metadata = {
  title: 'Understanding Cancer — Plain-English Guides for Patients and Families',
  description:
    'Explore plain-English guides on biomarkers, staging, treatment, insurance appeals, and caregiver questions from OncoKind.',
};

export default function LearnIndexPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-8">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Resources
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            Understanding Cancer — Plain-English Guides for Patients and Families
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            These guides are written for the moment when a report, diagnosis, or treatment term
            suddenly becomes personal. Each article is designed to help patients and caregivers walk
            into the next appointment with more clarity and better questions.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {LEARN_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]"
            >
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
                  {article.category}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {article.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {article.excerpt}
              </p>
              <Button asChild variant="outline" className="mt-5">
                <Link href={`/learn/${article.slug}`}>Read Guide →</Link>
              </Button>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
