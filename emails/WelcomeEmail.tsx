import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Preview, Font,
} from '@react-email/components'

interface WelcomeEmailProps {
  name?: string
  tier: 'seed' | 'core' | 'evolve'
}

const TIER_LABELS: Record<string, string> = {
  seed: 'Agent One',
  core: 'Agent Three',
  evolve: 'Agent Five',
}

const TIER_SLAS: Record<string, string> = {
  seed: 'after onboarding',
  core: 'after onboarding',
  evolve: 'after onboarding',
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
      <Preview>Welcome to eevolvv — your {tierLabel} agent page is confirmed.</Preview>
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
              Your {tierLabel} agent page is confirmed.
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

          {/* Kickoff call */}
          <Section style={{ marginBottom: 32, background: '#141413', padding: '24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 10px', textTransform: 'uppercase' as const }}>
              § 02 · BOOK YOUR KICKOFF CALL
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 600, color: '#faf7f0', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
              15 minutes. Your report, your roadmap.
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(250,247,240,0.55)', lineHeight: 1.6, margin: '0 0 20px' }}>
              We&apos;ll walk through your diagnostic results together and map out exactly what gets built first.
            </Text>
            <a
              href="https://calendly.com/hello-eevolvv"
              style={{ display: 'inline-block', background: '#8C2B1A', color: '#faf7f0', padding: '14px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textDecoration: 'none' }}
            >
              BOOK YOUR 15-MIN CALL →
            </a>
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
