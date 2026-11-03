/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/pricing',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/professional',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/trust',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
      {
        source: '/prior-auth-pro',
        headers: [{ key: 'Cache-Control', value: 'no-store, must-revalidate' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/waitlist',
        destination: '/signup',
        permanent: true,
      },
      {
        source: '/empathy-filter',
        destination: '/features/empathy-filter',
        permanent: true,
      },
      {
        source: '/signup',
        has: [{ type: 'query', key: 'plan', value: 'advocate' }],
        destination: '/signup?plan=pro',
        permanent: true,
      },
      {
        source: '/signup',
        has: [{ type: 'query', key: 'plan', value: 'plus' }],
        destination: '/signup?plan=pro',
        permanent: true,
      },
      {
        source: '/signup',
        has: [{ type: 'query', key: 'plan', value: 'professional' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/features/goals-of-care',
        destination: '/features/prep-sheets?type=goals-of-care',
        permanent: true,
      },
      {
        source: '/features/genetic-counseling',
        destination: '/features/prep-sheets?type=genetic-counseling',
        permanent: true,
      },
      {
        source: '/features/care-plan-questions',
        destination: '/features/prep-sheets?type=care-plan',
        permanent: true,
      },
      { source: '/kindauth', destination: '/', permanent: true },
      { source: '/kindauth/:path*', destination: '/', permanent: true },
      { source: '/snf', destination: '/', permanent: true },
      { source: '/snf/:path*', destination: '/', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    serverComponentsExternalPackages: ['playwright-core', '@sparticuz/chromium'],
  },
};

module.exports = nextConfig;
