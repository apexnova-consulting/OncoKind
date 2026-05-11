import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer } from '@/components/disclosures/OutputDisclosures';
import { getLearnArticle, LEARN_ARTICLES } from '@/lib/learn-content';

type PageProps = {
  params: Promise<{ slug: string }>;
};

const lastReviewed = '2026-05-11';

export async function generateStaticParams() {
  return LEARN_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.metaDescription,
    authors: [{ name: 'OncoKind' }],
    alternates: {
      canonical: `/learn/${article.slug}`,
    },
  };
}

export default async function LearnArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getLearnArticle(slug);
  if (!article) notFound();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: article.title,
    description: article.metaDescription,
    url: `https://www.oncokind.com/learn/${article.slug}`,
    audience: {
      '@type': 'Patient',
    },
    medicalAudience: 'Patient',
    lastReviewed,
  };

  const faqStructuredData = article.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }
    : null;

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      {faqStructuredData ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
      ) : null}

      <article className="mx-auto max-w-[var(--max-width-content)] rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
        <Link href="/learn" className="text-sm font-semibold text-[var(--color-primary-700)] hover:underline">
          ← Back to guides
        </Link>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--color-surface-100)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
            {article.category}
          </span>
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
            <p className="text-sm text-[var(--color-text-muted)]">Author</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                {section.heading}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
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

        {article.faqs?.length ? (
          <section className="mt-10">
            <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">Common questions</h2>
            <div className="mt-4 space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5">
                  <h3 className="font-semibold text-[var(--color-primary-900)]">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5">
          <MedicalDisclaimer />
        </div>

        <div className="mt-8 rounded-[var(--radius-lg)] bg-[var(--color-primary-900)] p-6 text-white">
          <p className="font-display text-2xl font-semibold">Want to understand your own report?</p>
          <Button asChild className="mt-4">
            <Link href="/signup">Upload it free →</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
