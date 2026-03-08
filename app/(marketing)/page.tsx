import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { FileUp, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="bg-[#f9fafb]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f9fafb] px-4 py-20 sm:py-28 animate-in fade-in duration-700">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-accent sm:text-5xl">
            Navigate Cancer Care With Clarity
          </h1>
          <p className="mt-6 text-lg text-slate-600 sm:text-xl">
            Understand diagnoses, explore treatment options, and find the best steps for your loved one.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Button asChild size="lg" className="h-14 rounded-xl px-10 text-base">
                <Link href="/journey">Go to Journey</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="h-14 rounded-xl px-10 text-base shadow-md">
                  <Link href="/signup" className="flex items-center gap-2">
                    <FileUp className="h-5 w-5" />
                    Upload Your Medical Report
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-14 rounded-xl border-slate-300 px-10 text-base"
                >
                  <Link href="/signup">Explore Caregiver Tools</Link>
                </Button>
              </>
            )}
          </div>
          {/* 3-step guide */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
              Upload Your Report
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">2</span>
              Get Clear Results
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">3</span>
              Follow Your Care Plan
            </span>
          </div>
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
              { name: 'Professional', desc: 'For advocates', price: '$999/mo', cta: 'Contact' },
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
