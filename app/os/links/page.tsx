import { Card, CardContent, SectionMarker } from '@/components/ds'
import { OSTopbar } from '../components/OSTopbar'

const QUICK_LINKS = [
  { name: 'Studio 23 Preview', tag: 'First client build', url: '/studio-23' },
  { name: 'First Client Canva', tag: 'Client source asset', url: 'https://canva.link/ruosh2c13ksqw5s' },
  { name: 'eevolvv.com', tag: 'Live site', url: 'https://eevolvv.com' },
  { name: 'HubSpot', tag: 'CRM + pipeline', url: 'https://app.hubspot.com' },
  { name: 'Linear', tag: 'Engineering', url: 'https://linear.app' },
  { name: 'Notion', tag: 'Knowledge base', url: 'https://notion.so' },
  { name: 'Wave', tag: 'Accounting', url: 'https://www.waveapps.com/accounting' },
  { name: 'PostHog', tag: 'Analytics', url: 'https://app.posthog.com' },
  { name: 'PandaDoc', tag: 'Proposals', url: 'https://app.pandadoc.com' },
  { name: 'Mercury', tag: 'Banking', url: 'https://mercury.com' },
  { name: 'Stripe', tag: 'Payments', url: 'https://dashboard.stripe.com' },
  { name: 'Vercel', tag: 'Hosting', url: 'https://vercel.com/dashboard' },
  { name: 'Supabase', tag: 'Database', url: 'https://supabase.com/dashboard/project/qmdygiumftesoqzqmsqe' },
  { name: 'Resend', tag: 'Email', url: 'https://resend.com' },
  { name: 'Anthropic', tag: 'AI / API keys', url: 'https://console.anthropic.com' },
  { name: 'Grasshopper', tag: 'Phone', url: 'https://grasshopper.com' },
  { name: 'Calendly', tag: 'Scheduling', url: 'https://calendly.com/hello-eevolvv' },
  { name: 'Bitwarden', tag: 'Passwords', url: 'https://vault.bitwarden.com' },
  { name: 'GitHub', tag: 'Codebase', url: 'https://github.com/ebarbosa-asg/eevolvv' },
]

const INTERNAL_DOCS = [
  { name: 'Service Agreement', tag: 'Contract template', url: '/service-agreement.docx', download: true },
  { name: 'Pitch Deck', tag: 'Investor materials', url: '/investor/pitch.html', download: false },
  { name: 'Privacy Policy', tag: 'Legal', url: '/privacy', download: false },
  { name: 'Terms of Service', tag: 'Legal', url: '/terms', download: false },
]

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-paper">
      <OSTopbar title="LINKS" />
      <div className="max-w-[1280px] mx-auto px-8 py-12">
        <SectionMarker num="07" label="QUICK LINKS" className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {QUICK_LINKS.map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent>
                  <div className="font-semibold text-sm text-ink mb-1">{link.name}</div>
                  <div className="mono text-[11px] text-ink/50">{link.tag}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        <SectionMarker num="08" label="INTERNAL DOCS" className="mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {INTERNAL_DOCS.map(doc => (
            <a
              key={doc.url}
              href={doc.url}
              target={doc.download ? undefined : '_blank'}
              rel="noopener noreferrer"
              download={doc.download}
              className="block no-underline"
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent>
                  <div className="font-semibold text-sm text-ink mb-1">{doc.name}</div>
                  <div className="mono text-[11px] text-ink/50">{doc.tag}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
