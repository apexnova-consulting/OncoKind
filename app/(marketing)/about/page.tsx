import { Heart, Shield, Eye, Scale } from 'lucide-react';
import { PATH_B_PRIVACY_LANGUAGE } from '@/lib/disclosures';

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
                  desc: PATH_B_PRIVACY_LANGUAGE,
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
          <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-[var(--color-primary-900)] shadow-[var(--shadow-lg)]">
              <video
                className="h-full w-full object-cover"
                src="https://res.cloudinary.com/dlfgwspxw/video/upload/q_auto/f_auto/v1778522170/OncoKind_Marketing_2_lhufi5.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
            </div>
            <div className="min-w-0">
              <div className="mt-8 space-y-4 leading-[var(--leading-relaxed)] text-[var(--color-surface-200)]">
                <p>Cancer has been part of my life for as long as I can remember.</p>
                <p>I lost my grandmother at 9. My grandfather at 15. My dad had a kidney removed at 16. At 28, I lost my cousin one month after his diagnosis.</p>
                <p>And today, my mom is fighting Stage 4 metastatic cancer.</p>
                <p>
                  When she was diagnosed, I became her caregiver. I sat in appointments I didn&apos;t
                  understand, went home and searched terms I couldn&apos;t pronounce, and felt completely
                  alone in trying to help her.
                </p>
                <p>
                  This disease has taken so much from my family. It won&apos;t take clarity from yours.
                </p>
                <p>
                  I built OncoKind so no family has to navigate this without understanding what
                  they&apos;re facing.
                </p>
                <p className="font-medium text-[var(--color-accent-400)]">— Mike Nielson, Founder</p>
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

      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--max-width-wide)] rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Partner Spotlights
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            Future nonprofit and community partners
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--color-text-secondary)]">
            As OncoKind builds relationships with advocacy organizations, caregiver communities, and
            trusted nonprofit partners, approved logos and resource links will appear here.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['Caregiver resource partners', 'Patient advocacy organizations', 'Navigation partners', 'Community collaborations'].map((label) => (
              <div
                key={label}
                className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-100)] px-5 py-8 text-center text-sm font-medium text-[var(--color-text-secondary)]"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
