import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface BuildStartedProps {
  name?: string
  tier: string
  sla: string
  portalUrl: string
}

export function BuildStartedEmail({ name, tier, sla, portalUrl }: BuildStartedProps) {
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
      <Preview>We've started building your {tierLabel} — {sla} SLA from now.</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />
          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            We&apos;ve started your {tierLabel} build.
          </Heading>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7, margin: '0 0 12px' }}>
            {greeting}
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            Your technician has claimed your build and work has begun. Build SLA: <strong>{sla}</strong> from today.
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.7 }}>
            You&apos;ll receive another email when your build is ready for review.
          </Text>
          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button
              href={portalUrl}
              style={{ background: '#141413', color: '#faf7f0', padding: '14px 28px', fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, textDecoration: 'none', display: 'inline-block', fontFamily: 'Courier New, monospace' }}
            >
              VIEW YOUR PORTAL →
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
