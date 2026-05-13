import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Font,
} from '@react-email/components'

export interface AdminOnboardingAlertProps {
  clientName: string
  businessName: string
  vertical: string
  gymSoftware: string
  credentialsPresent: boolean
  memberCount: string
  monthlyChurnRate: string
  tier: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function AdminOnboardingAlert({
  clientName,
  businessName,
  vertical,
  gymSoftware,
  credentialsPresent,
  memberCount,
  monthlyChurnRate,
  tier,
}: AdminOnboardingAlertProps) {
  // Auto-calculate retention opportunity
  // members × avg_arpm × churn_gap × 12 where avg_arpm=$100, target churn=4%
  const members = parseFloat(memberCount) || 0
  const churn = parseFloat(monthlyChurnRate) || 0
  const churnGap = Math.max(churn - 4, 0) / 100
  const retentionOpportunity = Math.round(members * 100 * churnGap * 12)

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
              EEVOLVV · ONBOARDING ALERT
            </Text>
          </Section>
          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 32 }} />

          <Section style={{ marginBottom: 32 }}>
            <Heading
              as="h1"
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#141413',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              New {vertical} Onboarding Submitted
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
              A new client has completed their onboarding form.
            </Text>
          </Section>

          {/* Client details */}
          <Section
            style={{
              background: 'rgba(20,20,19,0.04)',
              borderLeft: '3px solid #8C2B1A',
              padding: '16px 20px',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 12, color: '#141413', lineHeight: 1.8, margin: 0, fontFamily: 'Courier New, monospace' }}>
              → CLIENT NAME      ↳ {clientName}{'\n'}
              → BUSINESS         ↳ {businessName}{'\n'}
              → VERTICAL         ↳ {vertical}{'\n'}
              → TIER             ↳ {tier.toUpperCase()}{'\n'}
              → GYM SOFTWARE     ↳ {gymSoftware}{'\n'}
              → CREDENTIALS      ↳ {credentialsPresent ? 'YES — provided' : 'NOT PROVIDED'}{'\n'}
              → MEMBER COUNT     ↳ {memberCount || '—'}{'\n'}
              → MONTHLY CHURN    ↳ {monthlyChurnRate ? `${monthlyChurnRate}%` : '—'}
            </Text>
          </Section>

          {retentionOpportunity > 0 && (
            <Section
              style={{
                background: 'rgba(20,20,19,0.04)',
                border: '1px solid rgba(20,20,19,0.14)',
                padding: '16px 20px',
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  color: '#8C2B1A',
                  fontWeight: 700,
                  margin: '0 0 8px',
                  textTransform: 'uppercase' as const,
                }}
              >
                → RETENTION OPPORTUNITY
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 600, color: '#141413', margin: '0 0 4px' }}>
                ${retentionOpportunity.toLocaleString()}/yr
              </Text>
              <Text style={{ fontSize: 12, color: '#141413', opacity: 0.6, margin: 0 }}>
                Based on {memberCount} members × $100 ARPM × {Math.max(churn - 4, 0).toFixed(1)}% churn gap × 12 months
              </Text>
            </Section>
          )}

          <Section style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
              Log in to the admin dashboard to review the full responses and claim this build.
            </Text>
          </Section>

          <Hr style={{ borderColor: 'rgba(20,20,19,0.14)', marginBottom: 16 }} />
          <Section>
            <Text style={{ fontSize: 11, color: '#141413', opacity: 0.4, margin: 0 }}>
              EEVOLVV INTERNAL · {BASE_URL}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
