import { Heart, Ban, MessageCircle, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Mission | OncoKind',
  description: 'Technology with kindness at its core — making cancer information understandable and actionable.',
};

const heroPrinciples = [
  { icon: Heart, title: 'Empathy first', desc: 'Every output is crafted to support, not scare.' },
  { icon: Ban, title: 'No survival stats', desc: 'We focus on preparation, not prognosis.' },
  { icon: MessageCircle, title: 'Doctor-ready', desc: 'Designed to enhance, not replace, your conversations.' },
  { icon: DollarSign, title: 'Giving back', desc: 'A percentage of profits to cancer research.' },
];

export default function MissionPage() {
  return (
    <main className="bg-[var(--color-bg-page)]">
      <section className="grid overflow-hidden lg:min-h-[420px] lg:grid-cols-2">
        <div className="flex flex-col justify-center bg-[var(--color-bg-dark)] px-6 py-16 text-[var(--color-text-inverse)] sm:px-12 lg:py-24">
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Technology with Kindness at Its Core
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-surface-300)]">
            OncoKind exists to make complex cancer information understandable and actionable — without fear.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2">
          {heroPrinciples.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 bg-[var(--color-surface-100)] p-8"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-white text-[var(--color-sage-500)] shadow-[var(--shadow-sm)]">
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="font-sans text-lg font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-[var(--max-width-content)] px-4 py-16 sm:py-24">
        <div className="space-y-14">
          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">
              The Empathy Filter Philosophy
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              Before any AI summary reaches you, it passes through our Empathy Filter. We remove survival
              statistics, deterministic language, and fear-based messaging. What remains is calm, empowering
              guidance designed to help you prepare for real conversations with your care team. We believe
              information should support you — not overwhelm you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">
              Why We Never Display Survival Statistics
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              Statistics can be misleading and emotionally devastating when taken out of context. Every
              patient is different. We focus on what you can do: prepare questions, understand your biomarkers,
              explore relevant trials, and have informed conversations. We leave prognosis discussions where
              they belong — with your oncologist.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">
              Designed to Support Doctor Conversations
            </h2>
            <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
              Our Doctor Prep Sheets and conversation starters are built to help you make the most of limited
              appointment time. We suggest questions to ask, clarify terms you might have heard, and point to
              resources — so you feel prepared, not overwhelmed, when you sit down with your oncologist.
            </p>
          </section>
        </div>

        <section className="mt-20 rounded-[var(--radius-xl)] border border-[var(--color-accent-500)]/40 bg-gradient-to-br from-[var(--color-surface-200)] to-white p-8 shadow-[var(--shadow-lg)] sm:p-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-400)]/25 text-[var(--color-accent-600)]">
              <DollarSign className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                Commitment to Cancer Research
              </h2>
              <p className="mt-4 leading-relaxed text-[var(--color-text-secondary)]">
                We are committed to donating a percentage of future profits to cancer research organizations.
                As OncoKind grows, so does our ability to give back to the community we serve.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
