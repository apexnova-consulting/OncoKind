'use client';

import Link from 'next/link';
import { Reveal, RevealStagger } from '@/components/motion/Reveal';
import { Shield, FileText, BedDouble, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PriorAuthProLanding() {
  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      {/* Slim marketing nav */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <Link href="/" className="font-display text-xl font-semibold text-[#1C2B2D]">
          Onco<span className="text-[#6B8F71]">Kind</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/pricing" className="text-sm text-slate-600 hover:text-[#1C2B2D]">
            Pricing
          </Link>
          <Link href="/login" className="text-sm text-slate-600 hover:text-[#1C2B2D]">
            Log In
          </Link>
          <Button asChild className="bg-[#6B8F71] text-sm text-white hover:bg-[#5a7a60]">
            <Link href="/signup">Start Free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#6B8F71]/10 px-4 py-2 text-xs font-medium text-[#6B8F71]">
            <Shield className="h-3.5 w-3.5" />
            OncoKind Prior Auth Engine — For Care Facilities
          </div>
          <h1 className="font-display mb-6 text-4xl font-semibold leading-tight text-[#1C2B2D] md:text-5xl">
            Stop Losing 3 Hours
            <br />
            Per Prior Authorization
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-500">
            AI-generated prior auth requests, step therapy exception letters, and continued stay
            defenses — built for Directors of Nursing, Social Workers, and Care Coordinators at
            SNFs, group homes, and rehab centers.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="bg-[#6B8F71] px-8 py-3 text-base text-white hover:bg-[#5a7a60]"
            >
              <Link href="/signup?plan=professional">
                Start Free — Professional Plan
              </Link>
            </Button>
            <Button
              asChild
              className="border border-slate-200 bg-white px-8 py-3 text-base text-[#1C2B2D] hover:bg-slate-50"
            >
              <Link href="mailto:hello@oncokind.com">
                Book a Demo
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-slate-400">
            No credit card required. Professional plan includes full Prior Auth Engine access.
          </p>
        </Reveal>
      </section>

      {/* Three core workflows */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <RevealStagger>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: FileText,
                color: 'text-[#6B8F71] bg-[#6B8F71]/10',
                title: 'Prior Authorization Request',
                body: 'Generate a complete, payer-specific prior auth request from a medication order. Includes clinical justification, medical necessity language, and physician attestation block.',
              },
              {
                icon: Shield,
                color: 'text-[#E8C37A] bg-[#E8C37A]/10',
                title: 'Step Therapy Exception',
                body: '"Have you tried other meds?" — We cite your state\'s step therapy reform law by statute, document previous drug failures, and assert your patient\'s legal right to skip the step requirement.',
              },
              {
                icon: BedDouble,
                color: 'text-[#4A7FA5] bg-[#4A7FA5]/10',
                title: 'Continued Stay Defense',
                body: 'Fight premature discharge reviews with InterQual-adjacent medical necessity language. Document functional status, care goals, and discharge barriers that reviewers respond to.',
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className={`mb-4 inline-flex rounded-xl p-2.5 ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 font-semibold text-[#1C2B2D]">{card.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{card.body}</p>
                </div>
              );
            })}
          </div>
        </RevealStagger>
      </section>

      {/* Stats bar */}
      <section className="bg-[#1C2B2D] py-14">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
              {[
                { stat: '90M+',   label: 'Prior auth requests filed in the US annually' },
                { stat: '2–4 hrs', label: 'Average staff time lost per authorization' },
                { stat: '45–60%', label: 'Appeal success rate with professionally-written letters' },
              ].map((item) => (
                <div key={item.stat}>
                  <div className="font-display mb-2 text-4xl font-semibold text-[#E8C37A]">
                    {item.stat}
                  </div>
                  <div className="text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Reveal>
          <h2 className="font-display mb-12 text-center text-3xl font-semibold text-[#1C2B2D]">
            From denial to letter in under 2 minutes
          </h2>
        </Reveal>
        <RevealStagger>
          <div className="space-y-6">
            {[
              {
                step: '1',
                title: 'Enter the case details',
                body: 'Patient identifier (no PHI stored), payer, medication, and diagnosis code. Takes 60 seconds.',
              },
              {
                step: '2',
                title: 'Add your evidence',
                body: 'For step therapy: document which drugs the patient already tried and why they failed. For continued stay: describe current functional status and care goals.',
              },
              {
                step: '3',
                title: 'Generate the document',
                body: 'The AI produces a complete, professionally-worded submission document with the correct regulatory language for your payer and state.',
              },
              {
                step: '4',
                title: 'Review, sign, and submit',
                body: 'Fill in any bracketed placeholders, have the prescribing physician sign the attestation, and submit. Track the outcome directly in the platform.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1C2B2D] text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-[#1C2B2D]">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </RevealStagger>
      </section>

      {/* Feature list */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <Reveal>
          <h2 className="font-display mb-8 text-center text-2xl font-semibold text-[#1C2B2D]">
            Everything included in the Professional plan
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              'Prior Authorization Request generator',
              'Step Therapy Exception letters with state law citations',
              'Continued Stay / Medical Necessity defense',
              'Denial Letter Analyzer (plain-English breakdown)',
              'Drug trial history documentation',
              'Outcome tracking (approved / denied / appealing)',
              'Print-ready PDF export with disclaimer footer',
              'Unlimited cases',
              'No PHI stored — staff-controlled patient identifiers',
              'AI audit log for every generation',
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#6B8F71]" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="bg-[#6B8F71] py-16 text-center">
        <Reveal>
          <h2 className="font-display mb-4 text-3xl font-semibold text-white">
            Ready to stop losing hours to prior auth paperwork?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-sm text-[#E8F0E9]">
            OncoKind Professional includes full Prior Auth Engine access. Unlimited cases, all three
            document types, outcome tracking, and the Denial Analyzer — included at $999/month.
          </p>
          <Button
            asChild
            className="bg-white px-10 py-3 text-base font-semibold text-[#1C2B2D] hover:bg-[#F8F6F2]"
          >
            <Link href="/signup?plan=professional">
              Get Started — Professional Plan{' '}
              <ArrowRight className="ml-2 inline h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Disclaimer footer */}
      <footer className="bg-[#1C2B2D] py-6 text-center">
        <p className="text-xs text-slate-400">
          OncoKind Prior Auth is an AI-assisted document drafting tool. All generated documents
          must be reviewed by a licensed healthcare professional prior to submission. Not a
          substitute for legal or clinical judgment.{' '}
          <Link href="/" className="hover:text-white">
            oncokind.com
          </Link>{' '}
          ·{' '}
          <a href="mailto:hello@oncokind.com" className="hover:text-white">
            hello@oncokind.com
          </a>
        </p>
      </footer>

    </div>
  );
}
