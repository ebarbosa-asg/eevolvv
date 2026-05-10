import { Card, CardHeader, CardContent } from '@/components/ds/Card'
import { KPIStat } from '@/components/ds/KPIStat'
import { DataRow } from '@/components/ds/DataRow'
import { Badge } from '@/components/ds/Badge'

interface FitnessKPIPanelsProps {
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

const FITNESS_PANELS = [
  {
    id: 'churnRate',
    label: 'MONTHLY CHURN RATE',
    industryAvg: '4–6%',
    topPerformers: '<4%',
    direction: 'lower' as const,
    note: 'On a 200-member gym, each 1% gap = ~$300–$600/mo',
  },
  {
    id: 'leadConversion',
    label: 'LEAD-TO-MEMBER CONVERSION',
    industryAvg: '15–25%',
    topPerformers: '40–60%',
    direction: 'higher' as const,
    note: 'Automation lifts conversion rate by 2–4x',
  },
  {
    id: 'arpm',
    label: 'AVG REVENUE PER MEMBER',
    industryAvg: '$50–$150/mo',
    topPerformers: '$250+/mo (boutique)',
    direction: 'higher' as const,
    note: 'Upsell and EFT recovery directly improve ARPM',
  },
  {
    id: 'annualRetention',
    label: 'ANNUAL MEMBER RETENTION',
    industryAvg: '66.4% median',
    topPerformers: '80%+',
    direction: 'higher' as const,
    note: 'Every 5% improvement = significant LTV gain',
  },
  {
    id: 'classUtilization',
    label: 'CLASS UTILIZATION RATE',
    industryAvg: '—',
    topPerformers: '70%+ target',
    direction: 'higher' as const,
    note: 'Low utilization = dead revenue slots recoverable with automation',
  },
]

export function FitnessKPIPanels({ submission: _ }: FitnessKPIPanelsProps) {
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
        → FITNESS KPI BENCHMARKS
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
        {FITNESS_PANELS.map((panel) => (
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
