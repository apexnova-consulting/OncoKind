import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MEDICAL_DISCLAIMER_TEXT, PATH_B_PRIVACY_LANGUAGE, professionalHipaaNote } from '@/lib/disclosures';
import { ClinicalAdvisorSection } from '@/components/clinical/ClinicalAdvisorSection';
import { pageMetadata } from '@/lib/seo';
import { subprocessorsForTrustPage } from '@/lib/legal/subprocessors';
import { CONCIERGE_RETENTION_CLAIM, TOOLS_RETENTION_CLAIM } from '@/lib/legal/retention';
import { CONCIERGE_REFUND_TERMS } from '@/lib/legal/refunds';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const lastReviewed = 'October 28, 2026';

const collectedData = [
  {
    type: 'Report content',
    what: 'The text of your uploaded pathology report',
    why: 'To generate your plain-English summary and prep sheet',
  },
  {
    type: 'Account information',
    what: 'Email address and first name',
    why: 'To save your reports and send account-related communications',
  },
  {
    type: 'Service logs',
    what: 'Errors and performance data needed to keep the service running. No page-level tracking before you accept analytics.',
    why: 'To keep the service running. Product analytics is not switched on today.',
  },
  {
    type: 'Appointment dates',
    what: 'Dates you optionally enter',
    why: 'To trigger your post-appointment check-in',
  },
  {
    type: 'Income band (optional)',
    what: 'A coarse household income range you may enter in Access Agent',
    why: 'Only to check assistance program eligibility. Field-encrypted. Not sent to analytics. Deletable.',
  },
  {
    type: 'Concierge records',
    what: 'Medical records, patient authorization, and personal representative documents you send us',
    why: 'Used only to complete your Concierge case',
  },
  {
    type: 'Payment details',
    what: 'Handled by Stripe; we do not see your full card number',
    why: 'To take payment for paid plans and Concierge cases',
  },
  {
    type: 'Demo booking',
    what: 'Name and email you give when booking a demo',
    why: 'To schedule a conversation with our team',
  },
  {
    type: 'Family graph',
    what: 'Relative invites and claimed seats you choose to add',
    why: 'To support Family sharing and genetic counseling prep conversations',
  },
];

const changeLog = [
  {
    date: 'October 28, 2026',
    note: 'Aligned collection, retention, and Business Associate Agreement copy with Tools versus Concierge, and matched cookie language to product analytics being off.',
  },
  {
    date: 'October 27, 2026',
    note: 'Listed the Call for me voice vendor as a future subprocessor, kept scoped Concierge retention, and aligned family plan names with Caregiver Plus until a merge is confirmed.',
  },
  {
    date: 'October 6, 2026',
    note: 'Described Complete the Picture, Access Agent, and Concierge workflows.',
  },
];

export const metadata = pageMetadata({
  title: 'Trust and privacy',
  description: 'How OncoKind handles report uploads, Concierge records, retention, and privacy requests.',
  path: '/trust',
  imageAlt: 'OncoKind Trust Center',
});

export default function TrustPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-full)] space-y-10">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Trust Center
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            Your Privacy Is Not an Afterthought
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            At OncoKind, every product decision starts with one question: what would a caregiver need
            to feel safe sharing something this personal? Here is exactly how we handle your data.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            1. What We Collect
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-100)]">
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Data Type</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">What It Is</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Why We Collect It</th>
                </tr>
              </thead>
              <tbody>
                {collectedData.map((row) => (
                  <tr key={row.type} className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-4 py-4 font-medium text-[var(--color-primary-900)]">{row.type}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.what}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            2. What We Do Not Do
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <li>✗ We do not sell your data to any third party, ever.</li>
            <li>✗ We do not share your report content with advertisers.</li>
            <li>✗ Tools: we do not store raw report text after your summary is generated. Concierge: authorized records are stored encrypted and deleted 90 days after Case Ready.</li>
            <li>✗ We do not use your personal health information to train AI models.</li>
            <li>✗ OncoKind.com is ad-free. No advertiser has ever paid to influence what you see here.</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            3. How Your Data Is Protected
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              {
                title: 'Encryption in transit',
                body: 'All data transmitted between your device and OncoKind is encrypted using TLS 1.2 or higher.',
              },
              {
                title: 'Encryption at rest',
                body: 'All stored data is encrypted at rest using AES-256.',
              },
              {
                title: 'Access controls',
                body: 'Only essential personnel have access to backend systems, with audit logging and role-based controls.',
              },
              {
                title: 'Data retention',
                body: `${TOOLS_RETENTION_CLAIM} ${CONCIERGE_RETENTION_CLAIM} You can ask us to delete them sooner. Generated summaries and prep sheets can be deleted from account settings.`,
              },
              {
                title: 'Breach notification',
                body: 'In the event of a data breach, affected users will be notified without unreasonable delay.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-5"
              >
                <h3 className="font-semibold text-[var(--color-primary-900)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            4. Our Subprocessors
          </h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-100)]">
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Service</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Purpose</th>
                  <th className="px-4 py-3 font-semibold text-[var(--color-primary-900)]">Data Shared</th>
                </tr>
              </thead>
              <tbody>
                {subprocessorsForTrustPage().map((row) => (
                  <tr key={row.service} className="border-b border-[var(--color-border-subtle)]">
                    <td className="px-4 py-4 font-medium text-[var(--color-primary-900)]">{row.service}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.purpose}</td>
                    <td className="px-4 py-4 text-[var(--color-text-secondary)]">{row.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            How Complete the Picture, Access Agent, and Concierge work
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              These are guided workflows with typed tools, deterministic rules, and a language model used only
              for extraction and rewording. A person approves every outbound step. They do not diagnose or choose treatment.
            </p>
            <p>
              We redact names, medical record numbers, dates of birth, addresses, phone numbers, and account numbers
              before analysis. The token map stays in your account storage, encrypted, and is used only to put names
              back in your own view and in letters you generate.
            </p>
            <p>
              Nothing is emailed, printed as a sent letter, or called until you review the exact script or letter
              and approve it. Coordinators see only assigned Concierge cases. Document opens are logged. You can
              revoke an authorization, which stops outstanding records requests.
            </p>
            <p>
              No lab, pharma, or program funding may affect what is shown, ranked, or suggested. No referral fees.
              No ads. No data sales.
            </p>
            <p>{CONCIERGE_REFUND_TERMS}</p>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            5. Your Rights
          </h2>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <li><strong>Access:</strong> You can request a copy of all data OncoKind holds about you at any time from settings, or email support@oncokind.com.</li>
            <li><strong>Deletion:</strong> You can request permanent deletion of your account and associated data. We complete deletion requests within 30 days.</li>
            <li><strong>Portability:</strong> You can request your data in a portable format.</li>
            <li><strong>Contact:</strong> For privacy or data requests, email <a className="underline" href="mailto:support@oncokind.com">support@oncokind.com</a>.</li>
          </ul>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">6. HIPAA</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>{PATH_B_PRIVACY_LANGUAGE}</p>
            <p>{professionalHipaaNote()}</p>
            <p>
              Using OncoKind does not create a Business Associate Agreement by default. If your
              organization needs a formal compliance review, contact us before onboarding.
            </p>
          </div>
        </section>

        <ClinicalAdvisorSection />

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            Cookies and Consent
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              OncoKind uses essential cookies for authentication, session security, and language
              preferences. These cookies are required for the site to function.
            </p>
            <p>
              Product analytics is not switched on. The cookie banner still lists optional analytics in case that
              changes. If analytics is enabled later, it will run only after you choose Accept All or allow
              analytics in cookie preferences.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>Essential:</strong> session, authentication, language preference</li>
              <li><strong>Analytics:</strong> optional site-usage measurement after consent only</li>
              <li><strong>Opt out:</strong> choose Essential Only or update your preferences when the banner appears</li>
            </ul>
          </div>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-sm)]">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)]">
            Change log
          </h2>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
            {changeLog.map((entry) => (
              <li key={entry.date}>
                <strong>{entry.date}:</strong> {entry.note}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
            This page was last reviewed on {lastReviewed}.
          </p>
        </section>

        <section className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-8 text-white shadow-[var(--shadow-md)]">
          <p className="font-display text-3xl font-semibold">Questions about your privacy? We&apos;ll answer them directly.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/support">Contact Us</Link>
            </Button>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--color-primary-900)]">
              <Link href="/signup">Create an account</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[var(--color-surface-300)]">
            {MEDICAL_DISCLAIMER_TEXT}
          </p>
        </section>
      </div>
    </main>
  );
}
