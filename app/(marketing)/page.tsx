import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { DashboardPreview } from '@/components/marketing/DashboardPreview';
import { SampleReportDemo } from '@/components/marketing/SampleReportDemo';
import { FileUp, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-[#f9fafb]">
      {/* Product-first hero: left = copy + CTA, right = dashboard preview */}
      <section className="relative overflow-hidden bg-[#f9fafb] px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-accent sm:text-4xl lg:text-5xl">
                Navigate Cancer Care With Clarity
              </h1>
              <p className="mt-3 text-sm font-medium text-primary">
                <Link href="/about#founder-section" className="underline-offset-4 hover:underline">
                  Built by a caregiver, for caregivers.
                </Link>
              </p>
              <p className="mt-5 text-base text-slate-600 sm:text-lg lg:text-xl" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                Understand diagnoses, explore treatment options, and find the best steps for your loved one.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {user ? (
                  <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base">
                    <Link href="/journey">Go to Journey</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base shadow-md">
                      <Link href="/signup" className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        Upload Your Medical Report
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-xl border-slate-300 px-8 text-base"
                    >
                      <Link href="/signup">Explore Caregiver Tools</Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-3 sm:gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                  Upload Your Report
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                  Get Clear Results
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
                  Follow Your Care Plan
                </span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <DashboardPreview />
            </div>
          </div>
          <SampleReportDemo />
        </div>
      </section>

      {/* Trust cues — doctor imagery */}
      <section className="border-t border-slate-200/60 bg-white px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <h2 id="how-it-works" className="text-center font-heading text-2xl font-semibold text-accent sm:text-3xl">
            Trusted Guidance for Families
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Designed with clinicians and caregivers. HIPAA-conscious, zero raw report retention.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                src: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=300&fit=crop',
                alt: 'Doctor with patient',
              },
              {
                src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
                alt: 'Healthcare professional',
              },
              {
                src: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop',
                alt: 'Medical care team',
              },
            ].map((item) => (
              <div
                key={item.src}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
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
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
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
              { name: 'Caregiver Pro', desc: 'For families', price: '$19/mo', cta: 'Upgrade' },
              { name: 'Professional', desc: 'For Care Teams & Concierge Health Services', price: '$999/mo', cta: 'Contact' },
            ].map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center"
              >
                <h3 className="font-semibold text-slate-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{tier.desc}</p>
                <p className="mt-4 text-xl font-bold text-slate-900">{tier.price}</p>
                <Button asChild variant={tier.name === 'Caregiver Pro' ? 'default' : 'outline'} className="mt-6 w-full">
                  <Link href={tier.name === 'Professional' ? '/pricing#enterprise' : '/pricing'}>
                    {tier.cta}
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center">
            <Link href="/pricing" className="text-primary font-medium hover:underline">
              View Full Pricing →
            </Link>
          </p>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-t border-slate-200/60 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-2xl font-semibold text-accent sm:text-3xl">
            Built to help you prepare with confidence
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: '🗓',
                title: 'Doctor Prep Sheet',
                desc: 'Walk into every appointment prepared.',
              },
              {
                icon: '🔬',
                title: 'Clinical Trial Matching',
                desc: 'Find trials you may qualify for, in plain language.',
              },
              {
                icon: '🛡',
                title: 'Empathy Filter',
                desc: 'Every word is chosen to support, not scare.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm">
                <p className="text-2xl" aria-hidden>{item.icon}</p>
                <h3 className="mt-3 font-heading text-lg font-semibold text-accent">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
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
              <Link href="/signup">Upload Medical Report</Link>
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
