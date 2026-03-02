import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export const metadata = {
  title: 'Pricing | OncoKind',
  description: 'Free, Pro, and Enterprise plans — simple pricing for families and professional advocates.',
};

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;
const STRIPE_PRICE_ID_ENTERPRISE = process.env.STRIPE_PRICE_ID_ENTERPRISE;

const FREE_FEATURES = [
  'Pathology report processing',
  'Clear biomarker summary',
  'Clinical trial matches (limited)',
  'Basic Doctor Prep questions',
  '1 report per month',
];

const PRO_FEATURES = [
  'Everything in Free',
  'Unlimited report processing',
  'Full trial match results',
  'Downloadable Doctor Prep PDF',
  '50-mile radius trial search',
  'Priority processing',
];

const ENTERPRISE_FEATURES = [
  'Everything in Pro',
  'Multi-patient dashboard',
  'Batch report processing',
  'Branded PDF headers',
  'Usage analytics',
  'Concierge workflow support',
  'Dedicated support',
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
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 w-full">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-lg">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-0.5 text-xs font-medium text-white">
              Most Popular
            </span>
            <h2 className="text-xl font-semibold text-slate-900">Pro</h2>
            <p className="mt-2 text-slate-600">Full access</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">From $29</p>
            <p className="text-sm text-slate-500">/month</p>
            <ul className="mt-8 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {f}
                </li>
              ))}
            </ul>
            {user ? (
              STRIPE_PRICE_ID ? (
                <form action="/api/checkout" method="POST" className="mt-8">
                  <input type="hidden" name="priceId" value={STRIPE_PRICE_ID} />
                  <Button type="submit" className="w-full">
                    Upgrade to Pro
                  </Button>
                </form>
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

          {/* Enterprise */}
          <div id="enterprise" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm scroll-mt-24">
            <h2 className="text-xl font-semibold text-slate-900">Enterprise</h2>
            <p className="mt-2 text-slate-600">For advocates</p>
            <p className="mt-6 text-3xl font-bold text-slate-900">Custom</p>
            <p className="text-sm text-slate-500">contact us</p>
            <ul className="mt-8 space-y-3">
              {ENTERPRISE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  {f}
                </li>
              ))}
            </ul>
            {user && STRIPE_PRICE_ID_ENTERPRISE ? (
              <form action="/api/checkout" method="POST" className="mt-8">
                <input type="hidden" name="priceId" value={STRIPE_PRICE_ID_ENTERPRISE} />
                <Button type="submit" variant="outline" className="w-full">
                  Start Enterprise
                </Button>
              </form>
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
                  <th className="px-6 py-4 font-semibold text-slate-900 text-center">Pro</th>
                  <th className="px-6 py-4 font-semibold text-slate-900 text-center">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Report processing', '1/month', 'Unlimited', 'Unlimited + batch'],
                  ['Trial matches', 'Limited', 'Full (50mi)', 'Full + custom'],
                  ['Doctor Prep PDF', '—', '✓', '✓ Branded'],
                  ['Multi-patient', '—', '—', '✓'],
                  ['Usage analytics', '—', '—', '✓'],
                  ['Support', 'Community', 'Email', 'Dedicated'],
                ].map(([feature, free, pro, ent]) => (
                  <tr key={feature} className="border-b border-slate-100">
                    <td className="px-6 py-4 font-medium text-slate-900">{feature}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{free}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{pro}</td>
                    <td className="px-6 py-4 text-center text-slate-600">{ent}</td>
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
