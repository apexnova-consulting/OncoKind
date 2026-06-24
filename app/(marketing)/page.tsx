import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { MarketingHome } from '@/components/marketing/MarketingHome';

export const metadata: Metadata = {
  title: 'OncoKind — Clarity for Families Navigating Cancer',
  description:
    'OncoKind translates your loved one\'s pathology report into plain English, prepares you for every oncology appointment, and guides your family through every step of the cancer journey — without survival statistics, without fear.',
  alternates: {
    canonical: 'https://www.oncokind.com/',
  },
  openGraph: {
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description:
      'Translate your loved one\'s pathology report into plain English. Generate Doctor Prep Sheets, match clinical trials, and navigate cancer — without survival statistics, without fear.',
    url: 'https://www.oncokind.com/',
    type: 'website',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'OncoKind — Clarity for families navigating cancer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description:
      'Translate your loved one\'s pathology report into plain English. Generate Doctor Prep Sheets, match clinical trials, and navigate cancer — without survival statistics, without fear.',
  },
  keywords: [
    'how to read a pathology report',
    'questions to ask oncologist',
    'cancer caregiver tools',
    'how to appeal cancer insurance denial',
    'clinical trial matching',
    'cancer caregiver support',
    'pathology report translation',
    'oncology appointment preparation',
  ],
};

const jsonLdFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this medical advice? Can I trust what OncoKind tells me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OncoKind is an educational preparation tool — it helps you understand what your loved one\'s report says and what questions to bring to your oncologist. It is not a substitute for medical advice and never tries to be. Every output is sourced from NCCN guidelines and NCI resources. Your oncology team remains your primary guide.',
      },
    },
    {
      '@type': 'Question',
      name: "What happens to my loved one's medical records after I upload them?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Your raw file is not retained after processing. We extract what\'s needed to build your Cancer Profile, then the document is removed. Storage is encrypted. We have never retained raw PHI and our architecture is designed so that we can\'t.',
      },
    },
    {
      '@type': 'Question',
      name: "I'm not very tech-savvy. Is this hard to use?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "The core experience is: upload a PDF, read the plain-English summary, review your question list. That's it. You can see exactly what the output looks like in the sample demo on this page before you create an account. If you can send an email attachment, you can use OncoKind.",
      },
    },
    {
      '@type': 'Question',
      name: 'My oncologist is very thorough. Do I really need this?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most oncologists are thorough — and most appointments are 15–20 minutes long, while the family is still processing the diagnosis. OncoKind doesn't replace your oncologist. It helps you arrive at the appointment with the right questions and understand what you heard afterward.",
      },
    },
    {
      '@type': 'Question',
      name: "What does 'free' actually include?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'One report translation per month, a full Cancer Profile, clinical trial matches, and read-only community access. No credit card required to start. Doctor Prep Sheets, unlimited reports, and insurance denial support are in paid plans. Full details on the pricing page.',
      },
    },
  ],
};

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OncoKind',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  description:
    'OncoKind translates pathology reports into plain English, generates Doctor Prep Sheets, matches clinical trials, and guides families through the cancer journey — without survival statistics, without fear.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free tier — one report per month, Cancer Profile, clinical trial matches',
  },
  url: 'https://www.oncokind.com',
};

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OncoKind',
  url: 'https://www.oncokind.com',
  logo: 'https://www.oncokind.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@oncokind.com',
    contactType: 'customer support',
  },
};

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
      />
      <MarketingHome signedIn={!!user} />
    </>
  );
}
