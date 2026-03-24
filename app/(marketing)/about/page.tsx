import { Heart, Shield, Eye, Scale } from 'lucide-react';

export const metadata = {
  title: 'About | OncoKind',
  description: 'Why we built OncoKind — clarity and compassion for families navigating cancer.',
};

export default function AboutPage() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Why We Built OncoKind
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Cancer brings complexity — medical records, pathology reports, clinical
          trials. We saw families struggling to understand what their doctors
          were saying and which questions to ask. OncoKind was built to bridge
          that gap.
        </p>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">The gap we fill</h2>
            <p className="mt-3 text-slate-600">
              Pathology reports are written for specialists. Terms like
              &quot;adenocarcinoma,&quot; &quot;T2N1M0,&quot; and biomarker
              statuses can feel opaque. We translate that into clear language —
              without oversimplifying — so you can prepare for conversations
              with your oncologist and explore relevant clinical trial options
              with confidence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Our commitment to responsible AI in healthcare
            </h2>
            <p className="mt-3 text-slate-600">
              We use AI to support understanding, not to replace medical
              judgment. Every summary passes our Empathy Filter: no survival
              statistics, no fear-based language, no deterministic claims.
              OncoKind is designed to help you prepare — your oncologist remains
              your primary guide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Not a replacement for oncologists
            </h2>
            <p className="mt-3 text-slate-600">
              OncoKind is a preparation tool. We help you understand your
              report and suggest questions to ask. We do not diagnose, treat,
              or advise. We believe better understanding leads to better
              conversations with your care team.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              Mission-driven and scalable
            </h2>
            <p className="mt-3 text-slate-600">
              We&apos;re building technology that serves families and
              professional advocates alike. Our architecture is designed to
              scale — from individual caregivers to concierge health services —
              while keeping security and compassion at the core.
            </p>
          </section>
        </div>

        {/* Our Principles */}
        <section className="mt-20">
          <h2 className="text-2xl font-semibold text-slate-900">
            Our Principles
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              { icon: Heart, title: 'Compassion First', desc: 'Every word we output is designed to support, not scare.' },
              { icon: Scale, title: 'Clinical Boundaries', desc: 'We respect the role of oncologists and never overstep.' },
              { icon: Shield, title: 'Security by Design', desc: 'Zero raw PHI retention. Encrypted storage. HIPAA-conscious architecture.' },
              { icon: Eye, title: 'Transparency', desc: 'We explain what we do and how we protect your data.' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl bg-slate-50 p-6"
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
        </section>

        <section id="founder-section" className="mt-20 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Meet the Founder</h2>
          <p className="mt-1 text-sm text-slate-500">Mike Nielson, Founder, OncoKind</p>
          <div className="mt-6 grid gap-8 md:grid-cols-[180px_1fr]">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <div className="flex aspect-[3/4] items-center justify-center p-4 text-center text-sm text-slate-500">
                Founder photo placeholder
              </div>
            </div>
            <div>
              <blockquote className="border-l-4 border-primary pl-4 text-lg font-medium text-slate-800">
                &quot;When the woman who cared for you your entire life receives a terrifying prognosis, you understand very quickly what is missing.&quot;
              </blockquote>
              <div className="mt-6 space-y-4 text-slate-700">
                <p>My name is Mike, and I built OncoKind because cancer has been part of my life for as long as I can remember.</p>
                <p>I lost my grandmother to cancer when I was 9. My grandfather passed when I was 15. At 16, my dad had a kidney removed due to kidney cancer. At 28, I lost my cousin — who was more like a brother — just one month after his diagnosis. And now, my mom is battling a rare Stage 4 metastatic cancer with a prognosis that has changed everything.</p>
                <p>Each of these experiences prepared me in ways I didn&apos;t ask for but couldn&apos;t ignore.</p>
                <p>My career started in software after graduate school, where I worked as a Sales Engineer and Project Manager before moving into sales as an Account Executive. More recently, I&apos;ve worked as a consultant — where I learned that the most powerful thing you can offer someone isn&apos;t a product, it&apos;s a partnership.</p>
                <p>When my mom was diagnosed, I became her primary caregiver. And in that role, all the other challenges I&apos;d faced became small. When the woman who cared for you your entire life receives a terrifying prognosis, you understand very quickly what is missing — not just in the medical system, but in the tools built to support it. Pathology reports written for specialists. Information delivered without context. Families left to navigate alone.</p>
                <p>I built OncoKind to change that. Not to replace doctors — but to make sure no family ever sits in a waiting room without understanding what they&apos;re facing and what questions to ask.</p>
                <p>This is personal. Every feature, every word, and every design decision is made with that in mind.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
