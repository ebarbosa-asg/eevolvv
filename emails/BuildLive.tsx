import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface BuildLiveProps {
  name?: string
  tier: string
  buildUrl: string
  portalUrl: string
}

export function BuildLiveEmail({ name, tier, buildUrl, portalUrl }: BuildLiveProps) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Helvetica Neue"
          fallbackFontFamily="Helvetica"
          webFont={undefined}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your {tierLabel} site is live →</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Your {tierLabel} site is live →
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            Your build is deployed and live. Here&apos;s your URL:
          </Text>
          <Section style={{ margin: '20px 0', padding: '20px 24px', border: '1px solid rgba(20,20,19,0.14)', textAlign: 'center' as const }}>
            <Text style={{ fontSize: 16, color: '#8C2B1A', fontWeight: 700, margin: 0, wordBreak: 'break-all' as const }}>
              {buildUrl}
            </Text>
          </Section>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            What&apos;s next: you&apos;ll receive monthly performance reports, uptime monitoring is active, and your AI agents continue learning your business. Your quarterly re-calibration is scheduled for 90 days from today.
          </Text>
          <Section style={{ marginTop: 28, display: 'flex', gap: 12, textAlign: 'center' as const }}>
            <Button
              href={buildUrl}
              style={{ background: '#8C2B1A', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontFamily: 'Courier New, monospace', marginBottom: 12 }}
            >
              VISIT YOUR SITE →
            </Button>
          </Section>
          <Section style={{ textAlign: 'center' as const }}>
            <Button
              href={portalUrl}
              style={{ background: 'transparent', color: '#141413', padding: '12px 24px', fontSize: 10, letterSpacing: '0.16em', fontWeight: 600, textDecoration: 'none', display: 'inline-block', fontFamily: 'Courier New, monospace', border: '1px solid rgba(20,20,19,0.3)' }}
            >
              VIEW PORTAL
            </Button>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
