import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { getResourceArticle, RESOURCE_ARTICLES } from '@/lib/resources-content';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return RESOURCE_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.metaDescription,
  };
}

export default async function ResourceArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const related = article.relatedSlugs
    .map((relatedSlug) => getResourceArticle(relatedSlug))
    .filter(Boolean)
    .slice(0, 3);

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <article className="mx-auto max-w-[var(--max-width-content)] rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
        <Link href="/resources" className="text-sm font-semibold text-[var(--color-primary-700)] hover:underline">
          ← Back to resources
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]"
            >
              {tag}
            </span>
          ))}
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
          {article.title}
        </h1>
        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary-900)] text-lg font-semibold text-white">
            O
          </div>
          <div>
            <p className="font-semibold text-[var(--color-primary-900)]">OncoKind</p>
            <p className="text-sm text-[var(--color-text-muted)]">Patient advocacy editorial team</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets?.length ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5 text-sm text-[var(--color-text-secondary)]">
          This article is for informational purposes only and is not a substitute for professional
          medical advice. Always consult your oncologist or care team.
        </div>

        <div className="mt-8 rounded-[var(--radius-lg)] bg-[var(--color-primary-900)] p-6 text-white">
          <p className="font-display text-2xl font-semibold">Ready to understand your own report?</p>
          <Button asChild className="mt-4">
            <Link href="/signup">Upload your pathology report — it&apos;s free →</Link>
          </Button>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            Related Articles
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <article
                key={item!.slug}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
                  {item!.tags[0]}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[var(--color-primary-900)]">
                  {item!.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item!.excerpt}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link href={`/resources/${item!.slug}`}>Read Article →</Link>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
