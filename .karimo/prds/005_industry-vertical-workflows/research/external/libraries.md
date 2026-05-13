# External Libraries — Industry Vertical Workflows

## No New NPM Packages Required for Core Build

The existing stack handles all core functionality:
- Claude via `@anthropic-ai/sdk` — AI chat and report generation
- Supabase via `@supabase/supabase-js` — data persistence
- Resend via `resend` + `@react-email/components` — email delivery
- Next.js App Router — routing and SSR

## Potential Additions for Vertical-Specific Integrations

### 1. Dental Integration APIs

**NexHealth API** — patient scheduling, recall campaigns, intake forms
- REST API, requires OAuth
- Relevant for: appointment syncing, recall automation
- No npm package; direct API calls via `fetch`

**Weave API** — patient communication, reminders, reviews
- REST API + webhooks
- Relevant for: SMS reminders, review requests
- No npm package; direct API calls

**Dentrix/Eaglesoft/Open Dental** — practice management
- Legacy systems with limited API access; typically use middleware like Carestream or HL7 bridges
- Most integrations with these systems go through NexHealth or Weave as intermediaries

**Availity API** — insurance eligibility verification
- REST API, requires credentialing
- Relevant for: insurance pre-auth automation

### 2. Fitness Integration APIs

**Mindbody API** — booking, members, classes, billing
- REST API + webhooks; well-documented
- npm: no official package; use `@mindbodyonline/widgets` for embed components only
- Relevant for: class utilization, churn detection, member history

**Glofox API** — member management, attendance, payments
- REST API
- Relevant for: attendance tracking, EFT dunning

### 3. Restaurant Integration APIs

**Toast API** — POS, orders, staff, reporting
- REST API; requires Toast Partner enrollment
- Relevant for: sales data, labor scheduling, inventory

**OpenTable API** — reservations, no-shows, guest data
- REST API
- Relevant for: reservation management, no-show tracking

**7shifts API** — staff scheduling
- REST API + webhooks
- Relevant for: schedule automation, labor cost tracking

## Utility Libraries Worth Evaluating

| Library | Purpose | NPM | Notes |
|---------|---------|-----|-------|
| `zod` | Schema validation for industry-specific intake data | `zod` | Already common in Next.js apps |
| `date-fns` | Date manipulation for scheduling automation | `date-fns` | Lightweight alternative to moment |
| `twilio` | SMS for dental recall, appointment reminders | `twilio` | If building SMS automation |
| `@sendgrid/mail` | Industry-specific email sequences | `@sendgrid/mail` | Alternative to Resend for high volume |

## Recommendation

For a first vertical (dental or fitness), do not introduce new npm packages. Use direct `fetch` calls to the integration APIs (NexHealth, Mindbody). Keep the dependency surface minimal until integration needs are confirmed through actual client use.

The most impactful "library" for this feature is actually internal: a well-structured `lib/industries/{vertical}.ts` config module that centralizes all vertical-specific data (questions, prompts, benchmarks, integrations).
