import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface FollowUp3Props {
  name?: string
  businessName?: string
  industry?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FollowUp3Email({ name, businessName, industry }: FollowUp3Props) {
  const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hi,'
  const biz = businessName || 'your business'
  const isFitness = industry === 'Fitness / Gym / Studio'
  const isDental = industry === 'Dental / Oral Health'

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
      <Preview>Last chance to lock in your eevolvv build for {biz}</Preview>
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
                Your class utilization report and referral campaign are ready to build.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                This is our last follow-up for {biz}&apos;s automation roadmap.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Month 3 in your roadmap includes:
              </Text>
              <Section
                style={{
                  background: 'rgba(20,20,19,0.04)',
                  borderLeft: '3px solid #8C2B1A',
                  padding: '16px 20px',
                  margin: '16px 0',
                }}
              >
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
                  → Class Utilization Report — weekly automated fill-rate analysis; identifies dead time slots before they drain revenue.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                  → Referral Campaign — automated referral ask to your most loyal members; referrals convert at 3–5x higher rate than cold leads.
                </Text>
              </Section>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Your diagnostic report stays on file. We pick up exactly where the analysis left off.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Build queue opens every Monday. Spots fill fast.
              </Text>
            </Section>
          ) : isDental ? (
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
                Your A/R follow-up system and new patient nurture are ready to build.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                This is our last follow-up for {biz}&apos;s automation roadmap.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Month 3 in your dental roadmap includes:
              </Text>
              <Section
                style={{
                  background: 'rgba(20,20,19,0.04)',
                  borderLeft: '3px solid #8C2B1A',
                  padding: '16px 20px',
                  margin: '16px 0',
                }}
              >
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
                  → AR Follow-Up — automated copay and balance reminders cut days-in-AR by 30–40% in 90 days.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 12px', opacity: 0.65 }}>
                  ↳ Industry benchmark: 30–45 days. Top practices: under 25 days.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: 0 }}>
                  → New Patient Nurture — post-consult sequences that move treatment-planned patients to scheduled; lifts acceptance 15–25%.
                </Text>
              </Section>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Your diagnostic report stays on file. We pick up exactly where the analysis left off.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Build queue opens every Monday. Spots fill fast.
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
                Last chance to lock in your build.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                It&apos;s been 7 days since we sent your eevolvv diagnostic report for {biz}.
                This is our last follow-up.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                We keep our build queue lean — which means pricing stays where it is today, but
                availability doesn&apos;t. If you&apos;ve been waiting for the right moment,
                this is it.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Ready to start building? Your diagnostic report stays on file — we&apos;ll pick
                up exactly where the analysis left off.
              </Text>
            </Section>
          )}

          <Section style={{ marginBottom: 32, textAlign: 'center' as const }}>
            <Button
              href={`${BASE_URL}/pricing`}
              style={{
                background: '#8C2B1A',
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
              CLAIM YOUR SPOT →
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
