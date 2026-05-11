import * as React from 'react'
import {
  Html, Head, Body, Container, Section, Text, Heading, Hr, Font,
} from '@react-email/components'

export interface AdminDentalOnboardingAlertProps {
  clientName: string
  businessName: string
  practiceManagementSoftware: string
  credentialsPresent: boolean
  recallRate: string
  noShowRate: string
  frontDeskCount: string
  tier: string
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://eevolvv.com'

export function AdminDentalOnboardingAlert({
  clientName,
  businessName,
  practiceManagementSoftware,
  credentialsPresent,
  recallRate,
  noShowRate,
  frontDeskCount,
  tier,
}: AdminDentalOnboardingAlertProps) {
  // Recall opportunity formula: providerCount × recallGap × $75,000/yr per provider
  // Use frontDeskCount as proxy until provider count is collected; assume providers = frontDeskCount
  const providers = parseFloat(frontDeskCount) || 1
  const recall = parseFloat(recallRate) || 0
  const recallGap = Math.max(85 - recall, 0) / 100
  const recallOpportunity = Math.round(providers * recallGap * 75000)

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
              New Dental / Oral Health Onboarding Submitted
            </Heading>
            <Text style={{ fontSize: 14, color: '#141413', lineHeight: 1.6, margin: 0 }}>
              A new dental practice client has completed their onboarding form.
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
              → VERTICAL         ↳ Dental / Oral Health{'\n'}
              → TIER             ↳ {tier.toUpperCase()}{'\n'}
              → PMS              ↳ {practiceManagementSoftware || '—'}{'\n'}
              → CREDENTIALS      ↳ {credentialsPresent ? 'YES — provided' : 'NOT PROVIDED'}{'\n'}
              → RECALL RATE      ↳ {recallRate ? `${recallRate}%` : '—'}{'\n'}
              → NO-SHOW RATE     ↳ {noShowRate ? `${noShowRate}%` : '—'}{'\n'}
              → FRONT DESK COUNT ↳ {frontDeskCount || '—'}
            </Text>
          </Section>

          {recallOpportunity > 0 && (
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
                → RECALL OPPORTUNITY
              </Text>
              <Text style={{ fontSize: 18, fontWeight: 600, color: '#141413', margin: '0 0 4px' }}>
                ${recallOpportunity.toLocaleString()}/yr
              </Text>
              <Text style={{ fontSize: 12, color: '#141413', opacity: 0.6, margin: 0 }}>
                Based on {frontDeskCount} staff × {Math.max(85 - recall, 0).toFixed(0)}% recall gap × $75K/provider/yr
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
