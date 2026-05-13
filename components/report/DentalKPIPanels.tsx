import { Card, CardHeader, CardContent } from '@/components/ds/Card'
import { KPIStat } from '@/components/ds/KPIStat'
import { DataRow } from '@/components/ds/DataRow'
import { Badge } from '@/components/ds/Badge'

interface DentalKPIPanelsProps {
  submission: {
    id: string
    business_name: string | null
    report: string | null
    tier: string | null
    email: string
    created_at: string
    industry: string | null
  }
}

const DENTAL_PANELS = [
  {
    id: 'recallRate',
    label: 'PATIENT RECALL RATE',
    industryAvg: '40–50%',
    topPerformers: '85%+',
    direction: 'higher' as const,
    note: 'Each 1% recall gap on a 1,500-patient panel = ~$75K/yr in lost production',
  },
  {
    id: 'noShowRate',
    label: 'NO-SHOW / CANCELLATION RATE',
    industryAvg: '10–15%',
    topPerformers: '<5%',
    direction: 'lower' as const,
    note: 'Every missed hygiene slot costs $150–$250. Automated confirmations cut no-shows by 40–60%.',
  },
  {
    id: 'treatmentAcceptance',
    label: 'TREATMENT ACCEPTANCE RATE',
    industryAvg: '50–60%',
    topPerformers: '80%+',
    direction: 'higher' as const,
    note: 'Automated follow-up sequences increase acceptance 15–25% within 30 days',
  },
  {
    id: 'collectionRate',
    label: 'COLLECTION RATE',
    industryAvg: '94–98%',
    topPerformers: '99%+',
    direction: 'higher' as const,
    note: 'AR automation and insurance pre-auth eliminate most collection gaps',
  },
  {
    id: 'daysInAR',
    label: 'DAYS IN A/R',
    industryAvg: '30–45 days',
    topPerformers: '<25 days',
    direction: 'lower' as const,
    note: 'Automated AR follow-up reduces days outstanding by 30–40% in 90 days',
  },
]

export function DentalKPIPanels({ submission: _ }: DentalKPIPanelsProps) {
  return (
    <div style={{ padding: '0 32px' }}>
      <div
        className="mono"
        style={{
          fontSize: 9,
          letterSpacing: '0.28em',
          color: 'var(--accent)',
          fontWeight: 700,
          marginBottom: 16,
          paddingTop: 32,
        }}
      >
        → DENTAL PRACTICE KPI BENCHMARKS
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 1,
          borderTop: '1px solid var(--rule)',
          borderLeft: '1px solid var(--rule)',
          margin: '0 0 32px',
        }}
      >
        {DENTAL_PANELS.map((panel) => (
          <Card
            key={panel.id}
            className="rounded-none border-0 border-r border-b border-rule"
          >
            <CardHeader>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                {panel.label}
              </div>
              <KPIStat value="Review your report" label="YOUR VALUE" />
            </CardHeader>
            <CardContent>
              <DataRow label="INDUSTRY AVG" value={panel.industryAvg} />
              <DataRow label="TOP PERFORMERS" value={panel.topPerformers} />
              <DataRow
                label="DIRECTION"
                value={
                  <Badge variant={panel.direction === 'lower' ? 'warning' : 'neutral'}>
                    {panel.direction === 'lower' ? 'Lower is better' : 'Higher is better'}
                  </Badge>
                }
              />
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: 'var(--ink)',
                  opacity: 0.5,
                  marginTop: 10,
                  lineHeight: 1.5,
                }}
              >
                {panel.note}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
