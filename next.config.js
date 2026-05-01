const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Include any dev port you use (`next dev -p 3005`, etc.) or Server Actions CSRF checks fail.
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'localhost:3005',
        '127.0.0.1:3000',
        '127.0.0.1:3005',
        'talent.eevolvv.com',
        'eevolvv.com',
      ],
    },
    instrumentationHook: true,
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps when Sentry is configured
  silent: !process.env.SENTRY_DSN,

  // Tree-shake Sentry debug statements from production bundle
  hideSourceMaps: true,
  widenClientFileUpload: true,
})
