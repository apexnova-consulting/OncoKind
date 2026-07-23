import Link from 'next/link';
import Image from 'next/image';
import { Heart, Shield, Scale, Eye } from 'lucide-react';
import { PATH_B_PRIVACY_LANGUAGE } from '@/lib/disclosures';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About OncoKind — Built by a Caregiver, for Caregivers',
  description:
    'Mike Nielson built OncoKind while his mother was fighting Stage 4 cancer. She passed away on July 4, 2026. Read the story behind the platform designed to give every family the clarity they deserve.',
  openGraph: {
    title: 'About OncoKind — Built by a Caregiver, for Caregivers',
    description:
      'Mike Nielson built OncoKind while his mother was fighting Stage 4 cancer. She passed away on July 4, 2026. Read the story behind the platform designed to give every family the clarity they deserve.',
  },
};

const principles = [
  {
    icon: Heart,
    title: 'Compassion First',
    desc: 'Every word we output is designed to support, not scare. The Empathy Filter runs on every output we generate — no exceptions.',
  },
  {
    icon: Scale,
    title: 'Clinical Boundaries',
    desc: 'We respect oncologists. We prepare families to work with them, not around them. OncoKind helps you show up ready — your care team makes the decisions.',
  },
  {
    icon: Shield,
    title: 'Security by Design',
    desc: PATH_B_PRIVACY_LANGUAGE,
  },
  {
    icon: Eye,
    title: 'Radical Transparency',
    desc: 'We tell you exactly what we do, how we process your data, and how we protect it. See our full Trust Center for details.',
  },
];

const timeline = [
  {
    age: 'Age 9',
    event: 'Lost his grandmother to cancer',
    note: 'His first experience of a family losing someone to cancer — the confusion, the grief, the feeling of helplessness.',
  },
  {
    age: 'Age 15',
    event: 'Lost his grandfather to cancer',
    note: 'A second loss. Cancer was becoming a defining thread in his family\'s story.',
  },
  {
    age: 'Age 16',
    event: 'Father had a kidney removed (kidney cancer)',
    note: 'This time, cancer came for someone who survived — but the experience of navigating the medical system as a teenager left a mark.',
  },
  {
    age: 'Age 28',
    event: 'Lost his cousin, one month after diagnosis',
    note: 'More like a brother. The swiftness of the loss, and the lack of time to prepare or understand, drove home why clarity matters.',
  },
  {
    age: 'Now',
    event: 'His mother: rare Stage 4 metastatic cancer',
    note: 'While serving as his mother\'s primary caregiver, Mike realized what was missing — not just in the medical system, but in every tool ever built for it.',
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[var(--bg-base)]">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          <p className="eyebrow">Why we built OncoKind</p>
          <h1 className="relative mt-4 pb-3 font-display text-4xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
            This is not a startup story. This is a life&apos;s work.
            <span
              className="absolute bottom-0 left-0 block h-[3px] w-[60px] rounded-full bg-[var(--brand-primary)]"
              aria-hidden
            />
          </h1>
          <p className="mt-10 max-w-[40rem] text-xl leading-relaxed text-[var(--color-text-secondary)]">
            Cancer brings complexity — medical records, pathology reports, clinical trials, insurance
            denials, financial stress. OncoKind was built to bridge that gap — not from a
            boardroom, but from a waiting room.
          </p>
        </div>
      </section>

      {/* ── The Gap ──────────────────────────────────────────── */}
      <section className="bg-[var(--bg-subtle)] px-4 py-16">
        <div className="mx-auto max-w-[var(--max-width-content)] space-y-10">
          <div>
            <h2 className="font-sans text-xl font-semibold text-[var(--color-text-primary)]">
              The gap we fill
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
              Pathology reports are written for specialists. Terms like &quot;adenocarcinoma,&quot;
              &quot;T2N1M0,&quot; and biomarker statuses can feel opaque and terrifying. We translate
              that into clear language — without oversimplifying — so you can prepare for
              conversations with your oncologist and explore relevant clinical trial options with
              confidence.
            </p>
          </div>
          <div>
            <h2 className="font-sans text-xl font-semibold text-[var(--color-text-primary)]">
              Our commitment to responsible AI in healthcare
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
              We use AI to support understanding, not to replace medical judgment. Every summary
              passes our Empathy Filter: no survival statistics, no fear-based language, no
              deterministic claims. OncoKind is designed to help you prepare — your oncologist
              remains your primary guide.
            </p>
          </div>
          <div>
            <h2 className="font-sans text-xl font-semibold text-[var(--color-text-primary)]">
              Built for the family beside the patient
            </h2>
            <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
              Most tools in this space are built for patients. OncoKind is built for the person
              sitting beside them — the adult child, the spouse, the sibling who became the
              caregiver. Entirely different emotional state. Different job to be done. Different
              support needed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Principles ───────────────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-text-primary)]">
            Our Principles
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {principles.map((item) => (
              <div
                key={item.title}
                className="hover-lift-card flex gap-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--bg-subtle)] p-6 shadow-[var(--shadow-sm)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-white text-[var(--brand-primary)] shadow-[var(--shadow-sm)]">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-[var(--color-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder Story (full) ──────────────────────────────── */}
      <section
        id="founder-section"
        className="scroll-mt-20 bg-[var(--bg-deep)] px-4 py-20 text-[var(--color-text-inverse)] sm:py-28"
      >
        <div className="mx-auto max-w-[var(--max-width-wide)]">
          <h2 className="font-display text-3xl font-semibold text-white">Meet the Founder</h2>
          <p className="mt-2 text-sm text-white/50">Mike Nielson, Founder, OncoKind</p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            {/* Founder photo — swap /images/founder-photo.jpg when photo is ready */}
            <div className="mx-auto w-full max-w-[22rem] lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] border border-white/10 shadow-[var(--shadow-lg)] bg-[#162420]">
                {/* Replace src with actual photo path once supplied */}
                <Image
                  src="/images/founder-photo.jpg"
                  alt="Founder's mother"
                  fill
                  className="object-cover object-top"
                  onError={undefined}
                  unoptimized
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#9FE1CB]/80 italic">
                Dedicated to my mom, who faced her cancer with more courage than I&apos;ve ever had to.
              </p>
            </div>

            {/* Story */}
            <div className="min-w-0">
              <div className="space-y-4 leading-[1.8] text-white/80">
                <p>Cancer has been part of my life for as long as I can remember.</p>
                <p>
                  I lost my grandmother at 9. My grandfather at 15. My dad had a kidney removed at
                  16. At 28, I lost my cousin — one month after his diagnosis.
                </p>
                <p className="font-medium text-white">My mom fought Stage 4 metastatic cancer with grace and courage. She passed away on July 4, 2026.</p>
                <p>
                  When she was diagnosed, I became her caregiver. I sat in appointments I
                  didn&apos;t understand, went home and searched terms I couldn&apos;t pronounce,
                  and felt completely alone in trying to help her.
                </p>
                <p>
                  Not alone in the sense that she wasn&apos;t there. Alone in the sense that the
                  entire medical system — as good as it is in many ways — is built for the
                  specialists, not for the family beside the patient. Pathology reports written for
                  doctors. Information delivered without empathy. Families left to navigate alone.
                </p>
                <p>
                  I built OncoKind to change that. Not to replace oncologists — but to make sure
                  no family ever sits in a waiting room without understanding what they&apos;re
                  facing and what questions to ask.
                </p>
                <p>Every feature in OncoKind exists because I needed it and couldn&apos;t find it.</p>
                <p>
                  This disease has taken so much from my family. It won&apos;t take clarity from
                  yours.
                </p>
                <p className="font-semibold text-[var(--brand-gold)]">— Mike Nielson, Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="bg-[var(--bg-subtle)] px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-width-content)]">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Moments that shaped this work
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            A life spent navigating cancer as a family — before OncoKind existed.
          </p>

          <div className="relative mt-12 space-y-0">
            {/* Vertical line */}
            <div
              className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--color-border)]"
              aria-hidden
            />

            {timeline.map((item, i) => (
              <div key={item.age} className="relative flex gap-6 pb-10 last:pb-0">
                {/* Dot */}
                <div
                  className="relative mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 border-[var(--brand-primary)] bg-[var(--bg-subtle)]"
                  aria-hidden
                />
                <div className="group">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--brand-primary)]">
                      {item.age}
                    </span>
                    <h3 className="font-sans font-semibold text-[var(--color-text-primary)]">
                      {item.event}
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-text-muted)]">
                    {item.note}
                  </p>
                  {i === timeline.length - 1 && (
                    <p className="mt-3 text-sm font-medium text-[var(--brand-primary)]">
                      This is where OncoKind was born.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-[var(--max-width-content)] text-center">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-text-primary)]">
            This was built for your family, too.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Upload your first report free. Get clarity. Walk into your next appointment prepared.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/signup">Get Started Free — It&apos;s the tool I wish I&apos;d had →</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/trust">How we protect your data →</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Partners placeholder ──────────────────────────────── */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-[var(--max-width-wide)] rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--brand-primary)]">
            Partner Spotlights
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            Future nonprofit and community partners
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">
            As OncoKind builds relationships with advocacy organizations, caregiver communities, and
            trusted nonprofit partners, approved logos and resource links will appear here.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Caregiver resource partners',
              'Patient advocacy organizations',
              'Navigation partners',
              'Community collaborations',
            ].map((label) => (
              <div
                key={label}
                className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--bg-subtle)] px-5 py-8 text-center text-sm font-medium text-[var(--color-text-muted)]"
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
