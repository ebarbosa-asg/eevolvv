import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface FollowUp1Props {
  name?: string
  businessName?: string
  industry?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FollowUp1Email({ name, businessName, industry }: FollowUp1Props) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const biz = businessName || 'your business'
  const isFitness = industry === 'Fitness / Gym / Studio'

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
      <Preview>Your eevolvv report for {biz} — your top automation opportunities</Preview>
      <Body
        style={{
          background: '#faf7f0',
          margin: 0,
          padding: 0,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}
      >
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                color: '#8C2B1A',
                fontWeight: 700,
                margin: 0,
                textTransform: 'uppercase' as const,
              }}
            >
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          {isFitness ? (
            <Section style={{ marginBottom: 32 }}>
              <Heading
                as="h1"
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#141413',
                  margin: '0 0 12px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Your gym&apos;s churn is costing you right now.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Your eevolvv diagnostic for {biz} identified real opportunities to recover member
                revenue. The first automation we build is your churn early-warning system.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Here&apos;s what it does: it flags members who are showing at-risk behavior —
                declining class attendance, skipped weeks, failed EFT payments — 30 days before
                they cancel. Then it triggers a re-engagement sequence automatically.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Industry average monthly churn: 4–6%. Top gyms: under 4%. That gap, on a
                200-member gym, is worth $1,200–$1,800/month in recovered MRR.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Ready to start building? The Core tier gets your churn system live within
                7–10 days.
              </Text>
            </Section>
          ) : (
            <Section style={{ marginBottom: 32 }}>
              <Heading
                as="h1"
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: '#141413',
                  margin: '0 0 12px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                Your report is waiting to be acted on.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                We sent your eevolvv report for {biz} yesterday. The opportunities we identified
                don&apos;t get smaller while you wait — they get more expensive to fix.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                If you&apos;re ready to start building: the Seed tier ($950/yr) gets you a live,
                automated landing page in 72 hours.
              </Text>
            </Section>
          )}

          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={`${BASE_URL}/pricing`}
              style={{
                background: '#141413',
                color: '#faf7f0',
                padding: '16px 32px',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-block',
                fontFamily: 'Courier New, monospace',
              }}
            >
              {isFitness ? 'STOP THE CHURN →' : 'SEE PRICING →'}
            </Button>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />
          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
              EEVOLVV · hello@eevolvv.com ·{' '}
              <a href={`${BASE_URL}/unsubscribe?email=`} style={{ color: '#141413' }}>
                Unsubscribe
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
