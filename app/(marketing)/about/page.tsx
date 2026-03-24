import { Heart, Shield, Eye, Scale } from 'lucide-react';

export const metadata = {
  title: 'About | OncoKind',
  description: 'Why we built OncoKind — clarity and compassion for families navigating cancer.',
};

export default function AboutPage() {
  return (
    <main className="bg-[var(--color-bg-page)]">
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          <h1 className="relative inline-block pb-3 font-display text-4xl font-semibold tracking-tight text-[var(--color-primary-900)] sm:text-5xl">
            Why We Built OncoKind
            <span
              className="absolute bottom-0 left-0 block h-[3px] w-[60px] rounded-full bg-[var(--color-accent-400)]"
              aria-hidden
            />
          </h1>
          <p className="mt-10 max-w-[40rem] text-xl leading-relaxed text-[var(--color-text-secondary)]">
            Cancer brings complexity — medical records, pathology reports, clinical trials. We saw families
            struggling to understand what their doctors were saying and which questions to ask. OncoKind was
            built to bridge that gap.
          </p>

          <div className="mt-16 space-y-12">
            <section>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                The gap we fill
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                Pathology reports are written for specialists. Terms like &quot;adenocarcinoma,&quot;
                &quot;T2N1M0,&quot; and biomarker statuses can feel opaque. We translate that into clear
                language — without oversimplifying — so you can prepare for conversations with your
                oncologist and explore relevant clinical trial options with confidence.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                Our commitment to responsible AI in healthcare
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                We use AI to support understanding, not to replace medical judgment. Every summary passes
                our Empathy Filter: no survival statistics, no fear-based language, no deterministic claims.
                OncoKind is designed to help you prepare — your oncologist remains your primary guide.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                Not a replacement for oncologists
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                OncoKind is a preparation tool. We help you understand your report and suggest questions to
                ask. We do not diagnose, treat, or advise. We believe better understanding leads to better
                conversations with your care team.
              </p>
            </section>

            <section>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                Mission-driven and scalable
              </h2>
              <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                We&apos;re building technology that serves families and professional advocates alike. Our
                architecture is designed to scale — from individual caregivers to concierge health services —
                while keeping security and compassion at the core.
              </p>
            </section>
          </div>

          <section className="mt-24">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
              Our Principles
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {[
                {
                  icon: Heart,
                  title: 'Compassion First',
                  desc: 'Every word we output is designed to support, not scare.',
                },
                {
                  icon: Scale,
                  title: 'Clinical Boundaries',
                  desc: 'We respect the role of oncologists and never overstep.',
                },
                {
                  icon: Shield,
                  title: 'Security by Design',
                  desc: 'Zero raw PHI retention. Encrypted storage. HIPAA-conscious architecture.',
                },
                {
                  icon: Eye,
                  title: 'Transparency',
                  desc: 'We explain what we do and how we protect your data.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="hover-lift-card flex gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-200)] p-6 shadow-[var(--shadow-sm)]"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-white text-[var(--color-sage-500)] shadow-[var(--shadow-sm)]">
                    <item.icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section
        id="founder-section"
        className="scroll-mt-24 bg-[var(--color-bg-dark)] px-4 py-20 text-[var(--color-text-inverse)] sm:py-28"
      >
        <div className="mx-auto max-w-[var(--max-width-wide)]">
          <h2 className="font-display text-3xl font-semibold">Meet the Founder</h2>
          <p className="mt-2 text-sm text-[var(--color-surface-400)]">Mike Nielson, Founder, OncoKind</p>
          <div className="mt-12 grid gap-12 md:grid-cols-[200px_1fr] md:gap-16">
            <div className="flex flex-col items-center md:items-start">
              <div
                className="flex h-[180px] w-[180px] shrink-0 items-center justify-center rounded-full border-4 border-[var(--color-surface-300)] bg-[var(--color-sage-500)] font-display text-3xl font-semibold text-white shadow-[var(--shadow-lg)]"
                aria-hidden
              >
                MN
              </div>
            </div>
            <div className="min-w-0">
              <blockquote className="border-l-4 border-[var(--color-accent-400)] pl-6 font-display text-2xl font-medium italic leading-snug text-[var(--color-accent-400)] sm:text-[var(--text-3xl)]">
                &ldquo;When the woman who cared for you your entire life receives a terrifying prognosis, you
                understand very quickly what is missing.&rdquo;
              </blockquote>
              <div className="mt-8 space-y-4 leading-[var(--leading-relaxed)] text-[var(--color-surface-200)]">
                <p>My name is Mike, and I built OncoKind because cancer has been part of my life for as long as I can remember.</p>
                <p>
                  I lost my grandmother to cancer when I was 9. My grandfather passed when I was 15. At 16, my
                  dad had a kidney removed due to kidney cancer. At 28, I lost my cousin — who was more like a
                  brother — just one month after his diagnosis. And now, my mom is battling a rare Stage 4
                  metastatic cancer with a prognosis that has changed everything.
                </p>
                <p>Each of these experiences prepared me in ways I didn&apos;t ask for but couldn&apos;t ignore.</p>
                <p>
                  My career started in software after graduate school, where I worked as a Sales Engineer and
                  Project Manager before moving into sales as an Account Executive. More recently, I&apos;ve
                  worked as a consultant — where I learned that the most powerful thing you can offer someone
                  isn&apos;t a product, it&apos;s a partnership.
                </p>
                <p>
                  When my mom was diagnosed, I became her primary caregiver. And in that role, all the other
                  challenges I&apos;d faced became small. When the woman who cared for you your entire life
                  receives a terrifying prognosis, you understand very quickly what is missing — not just in
                  the medical system, but in the tools built to support it. Pathology reports written for
                  specialists. Information delivered without context. Families left to navigate alone.
                </p>
                <p>
                  I built OncoKind to change that. Not to replace doctors — but to make sure no family ever
                  sits in a waiting room without understanding what they&apos;re facing and what questions to
                  ask.
                </p>
                <p>This is personal. Every feature, every word, and every design decision is made with that in mind.</p>
              </div>
              <div className="mt-12 border-t border-[var(--color-primary-700)] pt-8 text-xs leading-relaxed text-[var(--color-surface-400)]">
                <p className="font-medium uppercase tracking-[var(--tracking-widest)] text-[var(--color-surface-300)]">
                  Moments that shaped this work
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  <li>Age 9 — Grandmother</li>
                  <li>Age 15 — Grandfather</li>
                  <li>Age 16 — Father (kidney cancer)</li>
                  <li>Age 28 — Cousin</li>
                  <li>Now — Mother, Stage 4</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
