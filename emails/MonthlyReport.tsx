import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface MonthlyReportProps {
  name?: string
  tier: string
  month: string
  buildStatus: string
  buildUrl?: string
  agentRunCount: number
  nextBillingDate?: string
  portalUrl: string
}

export function MonthlyReportEmail({
  name,
  tier,
  month,
  buildStatus,
  buildUrl,
  agentRunCount,
  nextBillingDate,
  portalUrl,
}: MonthlyReportProps) {
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
      <Preview>{month} Update — Your eevolvv {tierLabel} Summary</Preview>
      <Body style={{ background: '#faf7f0', margin: 0, padding: 0, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        <Container style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <Section style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: 0, textTransform: 'uppercase' as const }}>
              EEVOLVV
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Heading as="h1" style={{ fontSize: 26, fontWeight: 600, color: '#141413', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {month} Update
          </Heading>
          <Text style={{ fontSize: 13, color: '#141413', opacity: 0.5, margin: '0 0 32px', letterSpacing: '0.06em' }}>
            YOUR EEVOLVV {tierLabel.toUpperCase()} SUMMARY
          </Text>
          <Text style={{ fontSize: 14, color: '#141413', opacity: 0.8, lineHeight: 1.6, margin: '0 0 24px' }}>
            {greeting}
          </Text>

          {/* Build Status */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 01 · BUILD STATUS
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: 0, fontWeight: 500 }}>
              Status: {buildStatus.replace('_', ' ').toUpperCase()}
            </Text>
            {buildUrl && (
              <Text style={{ fontSize: 12, color: '#8C2B1A', margin: '6px 0 0' }}>
                {buildUrl}
              </Text>
            )}
          </Section>

          {/* Activity */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 02 · THIS MONTH
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: '0 0 8px' }}>
              → AI agent runs: <strong>{agentRunCount}</strong>
            </Text>
            <Text style={{ fontSize: 12, color: '#141413', opacity: 0.6, margin: 0 }}>
              Your AI agents ran {agentRunCount} automated tasks this month.
            </Text>
          </Section>

          {/* Subscription */}
          <Section style={{ marginBottom: 24, border: '1px solid rgba(20,20,19,0.14)', padding: '20px 24px' }}>
            <Text style={{ fontSize: 10, letterSpacing: '0.22em', color: '#8C2B1A', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase' as const }}>
              § 03 · SUBSCRIPTION
            </Text>
            <Text style={{ fontSize: 14, color: '#141413', margin: '0 0 4px' }}>
              Plan: <strong>{tierLabel}</strong>
            </Text>
            {nextBillingDate && (
              <Text style={{ fontSize: 13, color: '#141413', opacity: 0.6, margin: 0 }}>
                Next billing: {nextBillingDate}
              </Text>
            )}
          </Section>

          <Section style={{ marginTop: 28, textAlign: 'center' as const }}>
            <Button
              href={portalUrl}
              style={{
                background: '#141413',
                color: '#faf7f0',
                padding: '14px 28px',
                fontSize: 11,
                letterSpacing: '0.18em',
                fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'Courier New, monospace',
              }}
            >
              VIEW YOUR PORTAL →
            </Button>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com · Questions? Reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
