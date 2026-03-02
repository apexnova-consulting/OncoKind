import { Heart, Ban, MessageCircle, DollarSign } from 'lucide-react';

export const metadata = {
  title: 'Mission | OncoKind',
  description: 'Technology with kindness at its core — making cancer information understandable and actionable.',
};

export default function MissionPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Technology with Kindness at Its Core
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          OncoKind exists to make complex cancer information understandable and
          actionable — without fear.
        </p>

        <div className="mt-12 space-y-12">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              The Empathy Filter Philosophy
            </h2>
            <p className="mt-3 text-slate-600">
              Before any AI summary reaches you, it passes through our Empathy
              Filter. We remove survival statistics, deterministic language,
              and fear-based messaging. What remains is calm, empowering
              guidance designed to help you prepare for real conversations with
              your care team. We believe information should support you — not
              overwhelm you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Why We Never Display Survival Statistics
            </h2>
            <p className="mt-3 text-slate-600">
              Statistics can be misleading and emotionally devastating when
              taken out of context. Every patient is different. We focus on
              what you can do: prepare questions, understand your biomarkers,
              explore relevant trials, and have informed conversations. We
              leave prognosis discussions where they belong — with your
              oncologist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Designed to Support Doctor Conversations
            </h2>
            <p className="mt-3 text-slate-600">
              Our Doctor Prep Sheets and conversation starters are built to
              help you make the most of limited appointment time. We suggest
              questions to ask, clarify terms you might have heard, and point
              to resources — so you feel prepared, not overwhelmed, when you
              sit down with your oncologist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Commitment to Cancer Research
            </h2>
            <p className="mt-3 text-slate-600">
              We are committed to donating a percentage of future profits to
              cancer research organizations. As OncoKind grows, so does our
              ability to give back to the community we serve.
            </p>
          </section>
        </div>

        {/* Visual principles */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {[
            { icon: Heart, title: 'Empathy first', desc: 'Every output is crafted to support, not scare.' },
            { icon: Ban, title: 'No survival stats', desc: 'We focus on preparation, not prognosis.' },
            { icon: MessageCircle, title: 'Doctor-ready', desc: 'Designed to enhance, not replace, your conversations.' },
            { icon: DollarSign, title: 'Giving back', desc: 'A percentage of profits to cancer research.' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-500">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
