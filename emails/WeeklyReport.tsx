import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Button, Hr, Preview, Font,
} from '@react-email/components'

interface WeeklyReportProps {
  name?: string
  weekLabel: string
  pilotProduct?: string
  metricName?: string
  metricValue?: string
  responseTime?: string
  automationRuns?: number
  summary?: string
  recommendation?: string
  portalUrl?: string
}

export function WeeklyReportEmail({
  name,
  weekLabel,
  pilotProduct,
  metricName,
  metricValue,
  responseTime,
  automationRuns,
  summary,
  recommendation,
  portalUrl = 'https://eevolvv.com/os',
}: WeeklyReportProps) {
  const firstName = name ? name.split(' ')[0] : null
  const hasMetrics = metricValue || responseTime || automationRuns !== undefined

  const fallbackSummary =
    'No automation activity logged this week. Your system is configured and monitoring for activity.'

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
      <Preview>
        {weekLabel} — Your eevolvv weekly update
        {pilotProduct ? ` · ${pilotProduct}` : ''}
      </Preview>
      <Body
        style={{
          background: '#faf7f0',
          margin: 0,
          padding: 0,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}
      >
        <Container style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px' }}>

          {/* ── Header wordmark ── */}
          <Section style={{ marginBottom: 20 }}>
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

          {/* ── Opening ── */}
          <Heading
            as="h1"
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#141413',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            {firstName ? `Here's your weekly update, ${firstName}.` : "Here's your weekly update."}
          </Heading>
          <Text
            style={{
              fontSize: 11,
              letterSpacing: '0.18em',
              color: '#141413',
              opacity: 0.45,
              margin: '0 0 28px',
              textTransform: 'uppercase' as const,
              fontFamily: 'Courier New, monospace',
            }}
          >
            {weekLabel}
            {pilotProduct ? ` · ${pilotProduct.toUpperCase()}` : ''}
          </Text>

          {/* ── Metrics block ── */}
          {hasMetrics && (
            <Section
              style={{
                marginBottom: 24,
                border: '1px solid rgba(20,20,19,0.14)',
                borderLeft: '3px solid #8C2B1A',
                padding: '20px 24px',
                background: 'rgba(20,20,19,0.025)',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: '#8C2B1A',
                  fontWeight: 700,
                  margin: '0 0 14px',
                  textTransform: 'uppercase' as const,
                  fontFamily: 'Courier New, monospace',
                }}
              >
                § 01 · THIS WEEK
              </Text>

              {metricName && metricValue && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#141413',
                    margin: '0 0 8px',
                    fontFamily: 'Courier New, monospace',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#8C2B1A' }}>→</span>{' '}
                  <span style={{ fontWeight: 700 }}>{metricName.toUpperCase()}</span>
                  {'    '}
                  {metricValue}
                </Text>
              )}

              {responseTime && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#141413',
                    margin: '0 0 8px',
                    fontFamily: 'Courier New, monospace',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#8C2B1A' }}>→</span>{' '}
                  <span style={{ fontWeight: 700 }}>RESPONSE TIME</span>
                  {'    '}
                  {responseTime}
                </Text>
              )}

              {automationRuns !== undefined && (
                <Text
                  style={{
                    fontSize: 13,
                    color: '#141413',
                    margin: 0,
                    fontFamily: 'Courier New, monospace',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: '#8C2B1A' }}>→</span>{' '}
                  <span style={{ fontWeight: 700 }}>AUTOMATION RUNS</span>
                  {'    '}
                  {automationRuns} {automationRuns === 1 ? 'time' : 'times'}
                </Text>
              )}
            </Section>
          )}

          {/* ── Summary paragraph ── */}
          <Section style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 10,
                letterSpacing: '0.22em',
                color: '#8C2B1A',
                fontWeight: 700,
                margin: '0 0 10px',
                textTransform: 'uppercase' as const,
                fontFamily: 'Courier New, monospace',
              }}
            >
              § 02 · SUMMARY
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#141413',
                lineHeight: 1.65,
                margin: 0,
                opacity: 0.85,
              }}
            >
              {summary || fallbackSummary}
            </Text>
          </Section>

          {/* ── Recommendation block ── */}
          {recommendation && (
            <Section
              style={{
                marginBottom: 28,
                border: '1px solid rgba(20,20,19,0.14)',
                borderLeft: '3px solid #8C2B1A',
                padding: '20px 24px',
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: '#8C2B1A',
                  fontWeight: 700,
                  margin: '0 0 10px',
                  textTransform: 'uppercase' as const,
                  fontFamily: 'Courier New, monospace',
                }}
              >
                § 03 · NEXT STEP
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#141413',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                <span style={{ color: '#8C2B1A' }}>→</span> {recommendation}
              </Text>
            </Section>
          )}

          {/* ── CTA ── */}
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
              VIEW YOUR DASHBOARD →
            </Button>
          </Section>

          {/* ── Footer ── */}
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', margin: '32px 0 16px' }} />
          <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
            EEVOLVV · hello@eevolvv.com · Questions? Reply directly.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
