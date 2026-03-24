import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { stripePrices, hasProPrices, hasEnterprisePrices } from '@/lib/stripe-prices';

export const metadata = {
  title: 'Pricing | OncoKind',
  description: 'Free, Pro, and Enterprise plans — simple pricing for families and professional advocates.',
};

const FREE_FEATURES = [
  'Diagnosis explanation',
  'Basic care map',
  '1 report per month',
];

const CAREGIVER_PRO_FEATURES = [
  'Everything in Free',
  'AI Care Navigator',
  'Clinical trial matching',
  'Care timeline',
  'Unlimited reports',
  'Doctor Prep Sheet',
];

const PROFESSIONAL_FEATURES = [
  'Everything in Caregiver Pro',
  'Branded portal (white-label subdomain)',
  'HIPAA BAA acknowledgment flow',
  'Batch report queue + status tracking',
  'Exportable patient roster + prep completion flags',
  'Dedicated support channel (email/Slack placeholder)',
];

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Start free. Upgrade when you need more. Stripe-secured checkout.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {/* Free */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Free</h2>
            <p className="mt-2 text-slate-600">Try OncoKind</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">$0</p>
            <p className="text-sm text-slate-500"> forever</p>
            <ul className="mt-8 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Caregiver Pro */}
          <div className="relative rounded-2xl border-2 border-primary bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-white">
              Most Popular
            </span>
            <h2 className="text-xl font-semibold text-slate-900">Caregiver Pro</h2>
            <p className="mt-2 text-slate-600">For families</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">$19</p>
            <p className="text-sm text-slate-500">/month</p>
            <ul className="mt-8 space-y-3">
              {CAREGIVER_PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              hasProPrices ? (
                <div className="mt-8 space-y-3">
                  {stripePrices.proMonthly && (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="priceId" value={stripePrices.proMonthly} />
                  <Button type="submit" className="w-full">
                    Caregiver Pro Monthly
                  </Button>
                    </form>
                  )}
                  {stripePrices.proYearly && (
                    <form action="/api/checkout" method="POST">
                      <input type="hidden" name="priceId" value={stripePrices.proYearly} />
                  <Button type="submit" variant="outline" className="w-full">
                    Caregiver Pro Yearly
                  </Button>
                    </form>
                  )}
                </div>
              ) : (
                <Button asChild className="mt-8 w-full">
                  <Link href="/dashboard/billing">Manage in Dashboard</Link>
                </Button>
              )
            ) : (
              <Button asChild className="mt-8 w-full">
                <Link href="/signup">Get Started → Upgrade</Link>
              </Button>
            )}
          </div>

          {/* Professional */}
          <div id="enterprise" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-24">
            <h2 className="text-xl font-semibold text-slate-900">Professional</h2>
            <p className="mt-2 text-slate-600">For Care Teams & Concierge Health Services</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">$999</p>
            <p className="text-sm text-slate-500">/month</p>
            <ul className="mt-8 space-y-3">
              {PROFESSIONAL_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            {user && hasEnterprisePrices ? (
              <div className="mt-8 space-y-3">
                {stripePrices.enterpriseUnlimited && (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="priceId" value={stripePrices.enterpriseUnlimited} />
                    <Button type="submit" variant="outline" className="w-full">
                      Professional — Unlimited
                    </Button>
                  </form>
                )}
                {stripePrices.enterprisePerSeat && (
                  <form action="/api/checkout" method="POST">
                    <input type="hidden" name="priceId" value={stripePrices.enterprisePerSeat} />
                    <Button type="submit" variant="outline" className="w-full">
                      Professional — Per seat
                    </Button>
                  </form>
                )}
              </div>
            ) : (
              <Button asChild variant="outline" className="mt-8 w-full">
                <a href="mailto:hello@oncokind.com?subject=Enterprise%20Inquiry">Contact Us</a>
              </Button>
            )}
          </div>
        </div>

        {/* Feature comparison table */}
        <section className="mt-24" id="comparison">
          <h2 className="text-center text-2xl font-semibold text-slate-900">
            Feature Comparison
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse rounded-xl border border-slate-200 bg-white text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 font-semibold text-slate-900">Feature</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 text-center">Free</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 text-center">Caregiver Pro</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 text-center">Professional</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Report processing', '1/month', 'Unlimited', 'Unlimited + batch'],
                  ['Trial matches', 'Limited', 'Full (50mi)', 'Full + custom'],
                  ['Doctor Prep PDF', '—', '✓', '✓ Branded'],
                  ['Multi-patient', '—', '—', '✓'],
                  ['Branded portal', '—', '—', '✓'],
                  ['HIPAA BAA onboarding', '—', '—', '✓'],
                  ['Roster export + prep flags', '—', '—', '✓'],
                  ['Support', 'Community', 'Email', 'Dedicated'],
                ].map(([feature, free, pro, prof]) => (
                  <tr key={feature} className="border-b border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">{feature}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{free}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{pro}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{prof}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-12 text-center text-sm text-slate-500">
          All plans include HIPAA-conscious design, zero raw PHI retention, and
          Stripe-secured payments. Prices may vary by region (Stripe Tax).
        </p>
      </div>
    </main>
  );
}
