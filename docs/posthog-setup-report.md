<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the eevolvv Next.js App Router application. Both client-side and server-side tracking are in place, covering the full diagnostic funnel — from when a user starts the AI chat through report generation and CTA conversion — as well as contact form submissions.

**What was set up:**
- `posthog-js` and `posthog-node` installed as dependencies
- PostHog initialized in `instrumentation-client.ts` alongside existing Sentry setup (via `/ingest` reverse proxy)
- Reverse proxy rewrites added to `next.config.js` (`/ingest/*` → PostHog US)
- `lib/posthog-server.ts` created for server-side PostHog client
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set in `.env.local`
- User identification wired at two touchpoints: after report generation (diagnostic email) and after contact form submission

| Event | Description | File |
|---|---|---|
| `diagnostic_chat_started` | User sends their first message in the diagnostic chat | `components/ChatEngine.tsx` |
| `diagnostic_intake_completed` | Chat AI signals [READY] — all intake data collected | `components/ChatEngine.tsx` |
| `diagnostic_report_viewed` | Report displayed to user + user identified by email | `components/ChatEngine.tsx` |
| `diagnostic_error` | Error in diagnostic flow (chat or report generation) | `components/ChatEngine.tsx` |
| `diagnostic_cta_clicked` | User clicks the "Book Strategy Call" CTA in the report | `components/ChatEngine.tsx` |
| `contact_form_submitted` | Contact form submitted successfully (client-side) | `app/contact/page.tsx` |
| `diagnostic_report_generated` | Server-side: report generated, user identified by email | `app/api/diagnostic/route.ts` |
| `diagnostic_rate_limited` | Server-side: user hit 3/hr rate limit | `app/api/diagnostic/route.ts` |
| `contact_received` | Server-side: contact form email sent via Resend | `app/api/contact/route.ts` |

## Next steps

We've built a dashboard and five insights to monitor the diagnostic funnel and business activity:

- **Dashboard — Analytics basics:** https://us.posthog.com/project/407291/dashboard/1537727
- **Diagnostic Funnel** (chat started → intake completed → report viewed): https://us.posthog.com/project/407291/insights/Eae6gZSM
- **Diagnostic Reports Generated (Daily):** https://us.posthog.com/project/407291/insights/MEV2ro0P
- **CTA Click-Through Rate** (report viewed → book call clicked): https://us.posthog.com/project/407291/insights/BEYTZGz0
- **Diagnostic Errors by Stage:** https://us.posthog.com/project/407291/insights/rX45oAeP
- **Contact Form + Rate Limit Activity:** https://us.posthog.com/project/407291/insights/x9PCLXZd

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-pages-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
