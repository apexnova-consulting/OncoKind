import Link from 'next/link';
import { AlertCircle, Ban, BookOpen, CheckCircle2, MessageSquare, TrendingDown } from 'lucide-react';

export const metadata = {
  title: 'Empathy Filter | OncoKind',
  description: 'How OncoKind chooses words carefully to support families with clarity and compassion.',
};

const blocks = [
  {
    icon: TrendingDown,
    title: 'Survival statistics',
    desc: 'Survival statistics and prognosis percentages (these are population averages, not predictions about your loved one)',
  },
  {
    icon: AlertCircle,
    title: 'Fear-based language',
    desc: 'Fear-based language ("aggressive," "devastating," "terminal" used without clinical necessity)',
  },
  {
    icon: Ban,
    title: 'Deterministic framing',
    desc: 'Deterministic framing ("this means..." / "you will...")',
  },
  {
    icon: BookOpen,
    title: 'Medical jargon',
    desc: 'Medical jargon used without explanation',
  },
];

const ensures = [
  {
    icon: CheckCircle2,
    title: 'Next steps',
    desc: 'Every diagnosis explanation ends with a next step, not a dead end',
  },
  {
    icon: MessageSquare,
    title: 'Biomarkers',
    desc: 'Biomarker explanations focus on what they mean for treatment options, not what they predict',
  },
  {
    icon: BookOpen,
    title: 'Preparatory tone',
    desc: 'Language is always preparatory: "here\'s what to ask your doctor" rather than "here\'s what this means for you"',
  },
];

export default function EmpathyFilterPage() {
  return (
    <main className="bg-[var(--color-bg-page)]">
      <section className="bg-[var(--color-bg-dark)] px-4 py-16 text-[var(--color-text-inverse)] sm:py-24">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            The Empathy Filter: Why We Choose Our{' '}
            <em className="font-display not-italic text-[var(--color-accent-400)]">Words Carefully</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-surface-300)]">
            When a family member is diagnosed with cancer, the words you encounter matter enormously. We
            designed the Empathy Filter - a set of principles and technical guardrails - to make sure every
            word OncoKind outputs supports you rather than frightens you.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[var(--max-width-content)] px-4 py-16 sm:py-20">
        <section>
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            What the Empathy Filter blocks
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {blocks.map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(180,83,9,0.12)] text-[var(--color-accent-600)]">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="mt-4 font-sans font-semibold text-[var(--color-primary-900)] line-through decoration-[var(--color-border)] decoration-2">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)] no-underline">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
            What the Empathy Filter ensures
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            {ensures.map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-xl)] border border-[var(--color-sage-400)]/30 bg-[rgba(95,132,116,0.08)] p-6"
              >
                <item.icon className="h-8 w-8 text-[var(--color-sage-600)]" strokeWidth={1.5} />
                <h3 className="mt-4 font-sans font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <blockquote className="mt-16 border-l-4 border-[var(--color-accent-400)] py-2 pl-8 font-display text-2xl font-medium italic leading-snug text-[var(--color-primary-700)]">
          OncoKind&apos;s Empathy Filter is not just a content policy. It is a commitment to every family who
          comes to us in one of the hardest moments of their lives.
        </blockquote>

        <section className="mt-16 rounded-[var(--radius-xl)] bg-[var(--color-surface-200)] px-6 py-12 sm:px-12">
          <div className="mx-auto max-w-[42rem] text-center">
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">
              Why this matters
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              Research consistently shows that how medical information is framed shapes how families cope,
              communicate with their care team, and make decisions. We take that seriously.
            </p>
            <p className="mt-6 leading-relaxed text-[var(--color-text-secondary)]">
              Want to learn more about why this is personal to us? Visit the{' '}
              <Link
                href="/about#founder-section"
                className="font-semibold text-[var(--color-primary-600)] underline-offset-4 hover:underline"
              >
                founder story
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
