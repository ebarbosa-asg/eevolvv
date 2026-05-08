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
