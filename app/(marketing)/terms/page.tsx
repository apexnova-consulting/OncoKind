const sections = [
  {
    title: '1. Acceptance of These Terms',
    body: [
      'These Terms of Service govern your access to and use of OncoKind, including our website, applications, community features, reports, doctor prep tools, clinical trial matching features, and related services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms and our Privacy Policy.',
      'If you are using the Services on behalf of another person, such as a family member or someone in your care, you represent that you have authority to do so and that you will use the Services in a way that is lawful and appropriate for that situation. If you do not agree to these Terms, do not use the Services.',
    ],
  },
  {
    title: '2. What OncoKind Does',
    body: [
      'OncoKind is an educational and organizational platform designed to help patients, caregivers, and advocates better understand cancer-related information, prepare for appointments, review structured report outputs, and explore support resources. The Services may include AI-assisted summaries, trial matching information, question prompts, care-planning tools, and moderated community discussions.',
      'OncoKind is not a hospital, physician practice, emergency service, insurance company, or law firm. We do not diagnose disease, prescribe medication, recommend a specific treatment, provide medical care, make coverage determinations, or offer legal advice.',
    ],
  },
  {
    title: '3. Important Medical Disclaimer',
    body: [
      'The Services are provided for educational and informational purposes only. Nothing in the Services is medical advice, nursing advice, mental health advice, legal advice, or financial advice. You should always rely on qualified clinicians and other licensed professionals for decisions about diagnosis, treatment, medication, clinical trial participation, coverage, appeals, or urgent medical needs.',
      'Do not use OncoKind for emergencies. If you think someone may have a medical emergency, call 911 or your local emergency number immediately, or seek emergency medical care.',
      'Clinical content, care suggestions, trial matches, and generated summaries may be incomplete, outdated, or incorrect. You are responsible for reviewing all information with your care team before acting on it.',
    ],
  },
  {
    title: '4. Eligibility and Accounts',
    body: [
      'You must be at least 18 years old and able to form a binding agreement to use the Services. You agree to provide accurate information when creating an account and to keep your login credentials confidential. You are responsible for all activity that occurs under your account.',
      'You may not impersonate another person, create accounts using false information, or use the Services in violation of any law, regulation, court order, or third-party right.',
    ],
  },
  {
    title: '5. Acceptable Use',
    body: [
      'You agree not to misuse the Services. This includes, without limitation, attempting to reverse engineer the Services, interfere with security features, scrape or copy data at scale, upload malicious code, access another user’s account or data without authorization, or use the Services to develop or train a competing product.',
      'You also agree not to use the Services to harass others, spread misinformation, post unlawful or infringing material, upload content you do not have the right to use, or share another person’s sensitive information without appropriate authorization.',
    ],
  },
  {
    title: '6. Community Rules',
    body: [
      'OncoKind’s community features are intended for peer support. Community content reflects the views of the person who posted it, not OncoKind. We may moderate, review, remove, edit, restrict, or report content at our discretion to help protect users and maintain a safe environment.',
      'Do not post personal health information, account credentials, insurance numbers, addresses, phone numbers, or other highly sensitive information in public community areas unless you are comfortable making that information visible to others. Even moderated communities carry risk, and you remain responsible for what you choose to share.',
    ],
  },
  {
    title: '7. Uploaded Materials and Your Content',
    body: [
      'You retain ownership of the content you submit to the Services, including uploaded reports, text, and community posts. By submitting content, you grant OncoKind a limited, non-exclusive license to host, process, transmit, analyze, display, and use that content as necessary to operate, secure, improve, and support the Services.',
      'You represent and warrant that you have all rights, permissions, and authority necessary to submit that content and permit our processing of it. You are solely responsible for the legality, accuracy, and appropriateness of any content you submit.',
    ],
  },
  {
    title: '8. AI-Generated Content and Trial Information',
    body: [
      'Some outputs are generated or assisted by automated systems, including AI models and structured matching workflows. AI-generated content may contain errors, omissions, or misleading language despite our safeguards. Clinical trial matches are illustrative and depend on available information, eligibility criteria, geography, and data freshness.',
      'You should independently verify all trial details, eligibility requirements, and treatment-related statements with the relevant medical provider, institution, sponsor, or registry before relying on them.',
    ],
  },
  {
    title: '9. Privacy and Security',
    body: [
      'Our Privacy Policy explains how we collect, use, store, and disclose information. By using the Services, you acknowledge that no security system is perfect and that electronic transmission and storage always involve some risk.',
      'Unless we have expressly agreed otherwise in a separate signed written agreement, OncoKind is not acting as your business associate under HIPAA and these Terms do not create a Business Associate Agreement.',
    ],
  },
  {
    title: '10. Paid Plans, Billing, and Renewals',
    body: [
      'Some features require a paid subscription. Prices, plan details, billing intervals, and included features are shown at checkout or on the pricing page in effect at the time of purchase. Payments are processed by Stripe, our third-party payment processor. We do not store full payment card numbers.',
      'If you purchase a subscription, you authorize recurring charges for the selected plan until cancellation. You are responsible for applicable taxes, fees, and charges. Paid subscriptions remain active until the end of the current billing period unless otherwise stated at checkout.',
      'We may change plan pricing or features prospectively. Any such changes will apply on a future billing cycle unless otherwise required by law.',
    ],
  },
  {
    title: '11. Cancellation and Termination',
    body: [
      'You may stop using the Services at any time and may cancel a paid subscription through the available billing tools or by contacting us if needed. Except where required by law, fees already paid are non-refundable.',
      'We may suspend or terminate your access to the Services at any time, with or without notice, if we believe you have violated these Terms, created risk for other users, exposed us to liability, or misused the Services. We may also discontinue or change all or part of the Services at any time.',
    ],
  },
  {
    title: '12. Intellectual Property',
    body: [
      'The Services, including our software, design, branding, text, graphics, workflows, and underlying technology, are owned by OncoKind or its licensors and are protected by intellectual property laws. Except as expressly permitted by these Terms, you may not copy, modify, distribute, sell, sublicense, or create derivative works from the Services.',
      'OncoKind, the OncoKind name, logos, and related marks are our trademarks or the trademarks of our licensors. These Terms do not grant you any license to use them except as necessary to use the Services as intended.',
    ],
  },
  {
    title: '13. Disclaimer of Warranties',
    body: [
      'THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ONCOKIND DISCLAIMS ALL WARRANTIES, INCLUDING ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, AVAILABILITY, OR QUIET ENJOYMENT.',
      'We do not guarantee that the Services will be uninterrupted, error-free, secure, current, or suitable for your particular needs, or that any content or output will be accurate, complete, or clinically appropriate.',
    ],
  },
  {
    title: '14. Limitation of Liability',
    body: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, ONCOKIND AND ITS OFFICERS, EMPLOYEES, CONTRACTORS, AFFILIATES, AND LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.',
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF ONCOKIND FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICES OR THESE TERMS WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO ONCOKIND FOR THE SERVICES IN THE 12 MONTHS BEFORE THE EVENT GIVING RISE TO THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS (US $100).',
    ],
  },
  {
    title: '15. Indemnification',
    body: [
      'You agree to defend, indemnify, and hold harmless OncoKind and its affiliates, officers, employees, contractors, and licensors from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys’ fees, arising out of or related to your content, your misuse of the Services, your breach of these Terms, or your violation of any law or third-party right.',
    ],
  },
  {
    title: '16. Governing Law and Disputes',
    body: [
      'These Terms are governed by the laws applicable in the jurisdiction where OncoKind is organized and operates, without regard to conflict-of-law principles. You agree that any dispute arising out of or relating to these Terms or the Services will be resolved exclusively in the state or federal courts located in that jurisdiction, unless applicable law requires otherwise, and you consent to personal jurisdiction in those courts.',
    ],
  },
  {
    title: '17. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. If we make material changes, we will update the "Last updated" date and may provide additional notice where appropriate. Your continued use of the Services after the effective date of updated Terms constitutes acceptance of the revised Terms.',
    ],
  },
  {
    title: '18. Contact Us',
    body: [
      'If you have questions about these Terms, please contact us at hello@oncokind.com.',
    ],
  },
] as const;

export const metadata = {
  title: 'Terms of Service | OncoKind',
  description:
    'OncoKind Terms of Service governing use of our educational cancer-care platform, community, subscriptions, and related services.',
};

export default function TermsPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-content)]">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-[var(--color-primary-900)] sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
          These Terms of Service explain the rules that apply when you use OncoKind. Please read
          them carefully, especially the sections on medical disclaimers, subscription billing,
          community content, limitations of liability, and dispute resolution.
        </p>
        <p className="mt-4 text-sm font-medium tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
          Last updated: May 4, 2026
        </p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-sans text-xl font-semibold text-[var(--color-primary-900)]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
