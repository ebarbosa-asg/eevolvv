# Task Brief: Welcome Email Template + Webhook Trigger

**ID:** T08
**PRD:** autonomous-sidegig-pivot
**Complexity:** 3/5
**Priority:** must
**Model:** sonnet
**Depends on:** T04, T06

---

## Objective

Create two react-email templates (`WelcomeEmail.tsx` and `OnboardingEmail.tsx`) and the `lib/email-helpers.ts` module with typed helper functions `sendWelcomeEmail()` and `sendOnboardingEmail()`. These are called by T06's `createClientRecord()` and must return `{ success, error? }` — never throw.

---

## Context

**Verify before starting:**
- `lib/webhook-handlers.ts` exists (T04 complete) — it will import from `lib/email-helpers.ts`
- `emails/EvolutionReport.tsx` — the definitive email template pattern to follow exactly

**Pattern: `emails/EvolutionReport.tsx`:**
```tsx
import { Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font } from '@react-email/components'

// Props interface
interface Props { ... }

// Named export function
export function EvolutionReportEmail({ name, ... }: Props) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" ... />
      </Head>
      <Preview>...</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* content */}
        </Container>
      </Body>
    </Html>
  )
}
```

**Pattern: `app/api/diagnostic/route.ts` email sending (lines 158-178):**
```typescript
const { error: emailError } = await resend.emails.send({
  from: process.env.FROM_EMAIL ?? 'hello@eevolvv.com',
  to: email,
  subject: `...`,
  html,
})
```

**Design system for emails:**
- Background: `#faf7f0` (--paper)
- Text: `#141413` (--ink)
- Accent: `#8C2B1A` (brick red — use as hex in emails, CSS vars don't work in email clients)
- Font: Helvetica Neue (email-safe fallback; not Space Grotesk — Google Fonts don't load in most email clients)
- Section markers: use `[§ XX · LABEL]` as plain text styled in mono-like font
- Logo: plain text `EEVOLVV` in bold (pattern from EvolutionReport.tsx)

**Resend setup:**
- `const resend = new Resend(process.env.RESEND_API_KEY)` — create fresh instance in email-helpers.ts
- `from` field: `hello@eevolvv.com` (domain already verified)

---

## Implementation

### Files to Create

- `emails/WelcomeEmail.tsx` — "Welcome to eevolvv" confirmation email
- `emails/OnboardingEmail.tsx` — "Complete your onboarding" email with token link
- `lib/email-helpers.ts` — Typed helper functions using Resend

### Files to Modify

None directly (T06 will import from `lib/email-helpers.ts`).

### Step-by-Step

1. Create `emails/WelcomeEmail.tsx`:

```tsx
import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Font,
} from '@react-email/components'

interface WelcomeEmailProps {
  name?: string
  tier: 'seed' | 'core' | 'evolve'
}

const TIER_LABELS: Record<string, string> = {
  seed: 'Seed',
  core: 'Core',
  evolve: 'Evolve',
}

const TIER_SLAS: Record<string, string> = {
  seed: '72 hours',
  core: '7–10 days',
  evolve: '14–21 days',
}

export function WelcomeEmail({ name, tier }: WelcomeEmailProps) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const tierLabel = TIER_LABELS[tier] ?? tier
  const sla = TIER_SLAS[tier] ?? '7–10 days'

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>Welcome to eevolvv — your {tierLabel} build is confirmed.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
            <Text style={{ fontSize: 10, letterSpacing: '0.14em', color: '#141413', opacity: 0.4, margin: 0, textTransform: 'uppercase' as const }}>
              AI BUSINESS TRANSFORMATION
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 28, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Your {tierLabel} build is confirmed.
            </Heading>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.6, margin: '0 0 8px', opacity: 0.8 }}>
              {greeting}
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
              Welcome to eevolvv. Your {tierLabel} subscription is active and your build slot is reserved. Here&apos;s what happens next.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32, background: '#fff', border: '1px solid rgba(20,20,19,0.14)', padding: '24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase' as const }}>
              § 01 · WHAT HAPPENS NEXT
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
              <strong>→ Step 1:</strong> Complete your onboarding form (link in next email). Takes 5 minutes.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
              <strong>→ Step 2:</strong> Your technician reviews your intake and starts the build. Build SLA: <strong>{sla}</strong>.
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: 0 }}>
              <strong>→ Step 3:</strong> You receive a preview link for review, then your build goes live.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.6, opacity: 0.6, margin: 0 }}>
              Questions? Reply to this email or reach us at hello@eevolvv.com. E monitors this inbox directly.
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 24 }} />

          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0, letterSpacing: '0.1em' }}>
              EEVOLVV · eevolvving forward, together · hello@eevolvv.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
```

2. Create `emails/OnboardingEmail.tsx`:

```tsx
import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface OnboardingEmailProps {
  name?: string
  tier: 'seed' | 'core' | 'evolve'
  token: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

const TIER_LABELS: Record<string, string> = {
  seed: 'Seed',
  core: 'Core',
  evolve: 'Evolve',
}

export function OnboardingEmail({ name, tier, token }: OnboardingEmailProps) {
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const tierLabel = TIER_LABELS[tier] ?? tier
  const onboardingUrl = `${BASE_URL}/onboard/${token}`

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font fontFamily="Helvetica Neue" fallbackFontFamily="Helvetica" webFont={undefined} fontWeight={400} fontStyle="normal" />
      </Head>
      <Preview>Complete your onboarding — your {tierLabel} build starts when you do.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>

          <Section style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Section style={{ marginBottom: 32 }}>
            <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Your build clock starts when you complete onboarding.
            </Heading>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.6, margin: '0 0 8px', opacity: 0.8 }}>
              {greeting}
            </Text>
            <Text style={{ fontSize: 15, color: '#141413', lineHeight: 1.6, opacity: 0.8, margin: 0 }}>
              We need 5 minutes of your time to gather your build requirements. Once you submit, your {tierLabel} build enters the queue and your technician gets to work.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={onboardingUrl}
              style={{
                background: '#141413', color: '#faf7f0',
                padding: '16px 32px', fontSize: 11,
                letterSpacing: '0.18em', fontWeight: 700,
                textDecoration: 'none', display: 'inline-block',
                fontFamily: 'Courier New, monospace',
              }}
            >
              COMPLETE ONBOARDING →
            </Button>
            <Text style={{ fontSize: 12, color: '#141413', opacity: 0.5, marginTop: 12 }}>
              This link expires in 30 days. If it expires, reply to this email.
            </Text>
          </Section>

          <Section style={{ marginBottom: 32, background: 'rgba(20,20,19,0.04)', border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 12, color: '#141413', opacity: 0.6, lineHeight: 1.6, margin: 0 }}>
              Or copy this link into your browser:<br />
              <span style={{ color: '#8C2B1A', wordBreak: 'break-all' as const }}>{onboardingUrl}</span>
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 24 }} />

          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0, letterSpacing: '0.1em' }}>
              EEVOLVV · hello@eevolvv.com
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
```

3. Create `lib/email-helpers.ts`:

```typescript
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { OnboardingEmail } from '@/emails/OnboardingEmail'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.FROM_EMAIL ?? 'hello@eevolvv.com'

type Tier = 'seed' | 'core' | 'evolve'

interface EmailResult {
  success: boolean
  error?: string
}

export async function sendWelcomeEmail({
  email,
  name,
  tier,
}: {
  email: string
  name?: string
  tier: Tier
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  try {
    const html = await render(WelcomeEmail({ name, tier }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to eevolvv — your ${tier.charAt(0).toUpperCase() + tier.slice(1)} build is confirmed`,
      html,
    })
    if (error) {
      console.error('[email-helpers] sendWelcomeEmail error:', error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendWelcomeEmail unexpected error:', err)
    return { success: false, error: String(err) }
  }
}

export async function sendOnboardingEmail({
  email,
  name,
  tier,
  token,
}: {
  email: string
  name?: string
  tier: Tier
  token: string
}): Promise<EmailResult> {
  if (!resend) return { success: false, error: 'Email service not configured' }

  try {
    const html = await render(OnboardingEmail({ name, tier, token }))
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Complete your onboarding — your ${tier.charAt(0).toUpperCase() + tier.slice(1)} build starts when you do`,
      html,
    })
    if (error) {
      console.error('[email-helpers] sendOnboardingEmail error:', error)
      return { success: false, error: String(error) }
    }
    return { success: true }
  } catch (err) {
    console.error('[email-helpers] sendOnboardingEmail unexpected error:', err)
    return { success: false, error: String(err) }
  }
}
```

---

## Code Patterns to Follow

```typescript
// Return type — never throw (from lib/supabase.ts pattern of graceful null)
async function sendX(): Promise<{ success: boolean; error?: string }> {
  try { ... return { success: true } }
  catch (err) { return { success: false, error: String(err) } }
}

// Render react-email to HTML (from diagnostic/route.ts:161)
const html = await render(ComponentName({ prop }))

// Resend send pattern (from diagnostic/route.ts:163-170)
const { error } = await resend.emails.send({ from, to, subject, html })
if (error) { console.error('[email-helpers]', error); return { success: false, error } }
```

---

## Environment Variables

| Variable | Used for |
|----------|----------|
| `RESEND_API_KEY` | Resend email client |
| `FROM_EMAIL` | Sender address (defaults to `hello@eevolvv.com`) |
| `NEXT_PUBLIC_BASE_URL` | Onboarding link construction in `OnboardingEmail` |

---

## Acceptance Criteria

- [ ] `emails/WelcomeEmail.tsx` renders without error; subject contains tier name
- [ ] `emails/OnboardingEmail.tsx` renders without error; includes `onboardingUrl` as clickable button
- [ ] `lib/email-helpers.ts` exports `sendWelcomeEmail({ email, name, tier })` returning `{ success, error? }`
- [ ] `lib/email-helpers.ts` exports `sendOnboardingEmail({ email, name, tier, token })` returning `{ success, error? }`
- [ ] Both functions return `{ success: false, error }` — never throw
- [ ] Resend `from` field is `hello@eevolvv.com`
- [ ] `WelcomeEmail` subject: `Welcome to eevolvv — your [Tier] build is confirmed`
- [ ] `OnboardingEmail` subject: `Complete your onboarding — your [Tier] build starts when you do`
- [ ] `OnboardingEmail` contains full onboarding URL: `{BASE_URL}/onboard/{token}`
- [ ] Both templates use `#faf7f0` background, `#141413` text, `#8C2B1A` accent — no CSS vars
- [ ] `npm run build` passes

---

## Dependencies Produced

| Output | Consumed by |
|--------|------------|
| `lib/email-helpers.ts` — `sendWelcomeEmail()`, `sendOnboardingEmail()` | T06 (webhook fulfillment) |
| `lib/email-helpers.ts` — module | T12, T17, T18, T19, T20, T21, T22, T23 (all add functions) |

---

## Do Not

- Do not use CSS custom properties (`var(--ink)`) in email templates — email clients don't support them; use hex values
- Do not use Google Fonts in email templates — embed-safe fallback fonts only
- Do not throw from `sendWelcomeEmail` or `sendOnboardingEmail` — return error object
- Do not use `window` or browser APIs in email templates — they run server-side
- Do not import `posthog-js` or any browser-only libraries
