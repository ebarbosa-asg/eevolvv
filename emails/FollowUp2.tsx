import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface FollowUp2Props {
  name?: string
  businessName?: string
  industry?: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function FollowUp2Email({ name, businessName, industry }: FollowUp2Props) {
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
      <Preview>Still thinking it over? Here&apos;s what other businesses found with eevolvv</Preview>
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
                EFT failures and missed leads — both fixable.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                A few days ago we sent your gym&apos;s automation roadmap. Two of the highest-ROI items:
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
                  → EFT Dunning Recovery — failed payments are recovered automatically; industry recovery rate is 60–80%.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 12px', opacity: 0.65 }}>
                  ↳ Without this, every failed payment is a manual phone call or a lost member.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
                  → 14-Day Lead Nurture — new leads and trial members get a sequence that moves them to paid.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: 0, opacity: 0.65 }}>
                  ↳ Industry conversion lifts from 15–25% to 40–60% with automation.
                </Text>
              </Section>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                These are Month 2 builds. Month 1 starts with your churn early-warning system.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                The Seed tier ($950/yr) gets you started. Core ($2,400/yr) gets you all five
                automations over 3 months.
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
                No-shows and insurance delays — both solvable this month.
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                A few days ago we sent your practice&apos;s automation roadmap. Two of your highest-ROI Month 2 builds:
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
                  → No-Show Confirmation — automated text + email sequences cut no-shows 40–60%. At $200/slot that&apos;s real production recovered weekly.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 12px', opacity: 0.65 }}>
                  ↳ Industry no-show rate: 10–15%. Top practices: under 5%.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}>
                  → Insurance Pre-Auth — automated pre-authorization reduces same-day claim denials and front-desk bottlenecks.
                </Text>
                <Text style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: 0, opacity: 0.65 }}>
                  ↳ Faster auth = faster treatment acceptance = faster production.
                </Text>
              </Section>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Month 1 starts with your Recall Outreach system. These follow in Month 2.
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                Core tier ($2,400/yr) covers all five dental automations over 3 months.
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
                Still thinking it over?
              </Heading>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
                {greeting}
              </Text>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                We sent your eevolvv report for {biz} a few days ago. No pressure — but here&apos;s
                what other businesses found when they started with Seed:
              </Text>
              {/* Social proof bullets */}
              <Section
                style={{
                  background: 'rgba(20,20,19,0.04)',
                  borderLeft: '3px solid #8C2B1A',
                  padding: '16px 20px',
                  margin: '16px 0',
                }}
              >
                <Text
                  style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: '0 0 8px' }}
                >
                  → A local service business automated their client intake form in 72 hours.
                  8 hours/week freed — they used that time to take on 3 more clients.
                </Text>
                <Text
                  style={{ fontSize: 13, color: '#141413', lineHeight: 1.7, margin: 0 }}
                >
                  → A solopreneur launched their first professional landing page in 72 hours.
                  First inbound lead came in within 48 hours of going live.
                </Text>
              </Section>
              <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6 }}>
                The Seed tier ($950/yr) is our lowest-risk starting point. Built in 72 hours,
                hosted and maintained. If you&apos;re not satisfied in the first 30 days,
                we&apos;ll make it right.
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
              {isFitness ? 'EXPLORE CORE →' : isDental ? 'EXPLORE CORE →' : 'EXPLORE SEED →'}
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
