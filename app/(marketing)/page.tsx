import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import {
  FileUp,
  Sparkles,
  FileText,
  Shield,
  Heart,
  Filter,
  Stethoscope,
  Check,
} from 'lucide-react';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/80 px-4 py-20 sm:py-28 animate-in fade-in duration-700">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Clarity for Families Navigating Cancer.
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Upload a pathology report. Receive clear explanations and relevant
            clinical trial options — designed to help you prepare for your next
            oncology appointment.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Button asChild size="lg" className="rounded-xl px-8">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="rounded-xl px-8">
                  <Link href="/signup">Upload Report Securely</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-slate-300 px-8"
                >
                  <Link href="/signup?tier=pro">For Professional Advocates</Link>
                </Button>
              </>
            )}
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-500" />
              HIPAA-conscious design
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-500" />
              Zero raw report retention
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              Secure AI processing
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-brand-500" />
              Stripe-secured checkout
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-200/60 bg-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Three simple steps to clearer understanding and better preparation.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50/80 p-6 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-500">
                <FileUp className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">1. Upload securely</h3>
              <p className="mt-2 text-sm text-slate-600">
                Share your pathology report. We process it with zero raw data
                retention — only structured insights are stored.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50/80 p-6 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                2. We extract key biomarkers and stage
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Our AI identifies biomarkers, TNM stage, and histology — then
                finds relevant clinical trials near you.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50/80 p-6 text-center transition-shadow hover:shadow-md">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-500">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                3. Receive a clear summary + trial matches
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Get plain-language explanations and a Doctor Prep Sheet to take
                to your next appointment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The OncoKind Difference */}
      <section className="border-t border-slate-200/60 bg-slate-50/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            The OncoKind Difference
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Designed to support, never to overwhelm.
          </p>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: Heart,
                title: 'No alarming statistics',
                desc: 'We never display survival rates or fear-based language.',
              },
              {
                icon: Filter,
                title: 'Empathy-filtered AI summaries',
                desc: 'Every summary passes our tone guardrails for calm, actionable guidance.',
              },
              {
                icon: Stethoscope,
                title: 'Built with clinical guardrails',
                desc: 'We respect clinical boundaries and encourage oncologist discussion.',
              },
              {
                icon: FileText,
                title: 'Designed for preparation, not replacement',
                desc: 'OncoKind helps you prepare for appointments — your doctor remains your guide.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
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
      </section>

      {/* For Professionals */}
      <section className="border-t border-slate-200/60 bg-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            For Professionals
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Enterprise tools for advocates and concierge health services.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              'Multi-patient dashboard',
              'Batch processing',
              'Branded reports',
              'Concierge workflow support',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              >
                <Check className="h-4 w-4 text-brand-500" />
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing#enterprise">View Enterprise Options</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="border-t border-slate-200/60 bg-slate-50/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Start free. Upgrade when you need more.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { name: 'Free', desc: 'Try OncoKind', price: '$0', cta: 'Get Started' },
              { name: 'Pro', desc: 'Full access', price: 'From $29/mo', cta: 'Upgrade' },
              { name: 'Enterprise', desc: 'For advocates', price: 'Custom', cta: 'Contact' },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <h3 className="font-semibold text-slate-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{tier.desc}</p>
                <p className="mt-4 text-xl font-bold text-slate-900">{tier.price}</p>
                <Button asChild variant={tier.name === 'Pro' ? 'default' : 'outline'} className="mt-6 w-full">
                  <Link href={tier.name === 'Enterprise' ? '/pricing#enterprise' : '/pricing'}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/pricing" className="text-brand-500 font-medium hover:underline">
              View Full Pricing →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-200/60 bg-white px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Start with clarity today.
          </h2>
          <p className="mt-4 text-slate-600">
            Join families and advocates who use OncoKind to prepare for their
            oncology appointments.
          </p>
          {!user && (
            <Button asChild size="lg" className="mt-8 rounded-xl px-8">
              <Link href="/signup">Upload Report Securely</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
