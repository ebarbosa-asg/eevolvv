import Link from 'next/link'
import type { ClientAgentFile, ClientAgentPageConfig } from '@/data/clientAgentPages'

function statusLabel(status: ClientAgentFile['status'] | 'ready' | 'active' | 'locked') {
  if (status === 'included') return 'PAID'
  if (status === 'available') return 'AVAILABLE'
  return status.toUpperCase()
}

export function ClientAgentPage({ client }: { client: ClientAgentPageConfig }) {
  return (
    <main className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <header className="border-b border-[var(--rule)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <div className="brand-wordmark text-2xl">eevolvv</div>
            <div className="mono mt-1 text-[10px] font-semibold tracking-[0.2em] text-[var(--accent)]">
              CLIENT AGENT PAGE
            </div>
          </div>
          <div className="hidden text-right md:block">
            <div className="mono text-[10px] tracking-[0.2em] opacity-45">PRIVATE OS</div>
            <div className="mt-1 text-sm font-semibold">{client.company}</div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div>
          <div className="mono text-[11px] font-semibold tracking-[0.22em] text-[var(--accent)]">
            § 01 · {client.agentName}
          </div>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.045em] md:text-7xl">
            {client.headline}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 opacity-65">
            {client.summary}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#agent-actions"
              className="btn-gradient inline-flex px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] no-underline"
            >
              {client.primaryCta} →
            </a>
            <a
              href={client.contactHref}
              className="inline-flex border border-[var(--ink)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] no-underline"
            >
              Contact team
            </a>
          </div>
        </div>

        <div className="border border-[var(--ink)] bg-white/30">
          <div className="border-b border-[var(--ink)] bg-[var(--ink)] px-5 py-4 text-[var(--paper)]">
            <div className="mono text-[10px] tracking-[0.24em] text-[var(--accent)]">AGENT STATE</div>
            <div className="mt-2 text-3xl font-semibold tracking-[-0.035em]">{client.stage}</div>
          </div>
          <div className="grid grid-cols-2 border-b border-[var(--ink)]">
            <Stat label="Business" value={client.businessType} />
            <Stat label="Product" value="Agent page" />
          </div>
          <div className="p-5">
            <div className="mono mb-4 text-[10px] tracking-[0.22em] opacity-55">WHAT THIS PAGE CONTROLS</div>
            <div className="grid gap-2">
              {['Files', 'Paid work', 'Agent actions', 'Next recommendations'].map(item => (
                <div key={item} className="flex items-center justify-between border border-[var(--rule)] px-4 py-3">
                  <span className="font-semibold">{item}</span>
                  <span className="text-[var(--accent)]">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <SectionTitle number="02" label="PAID / BUILT FILES" title="Everything we build becomes a file on the page." />
        <div className="mt-8 grid gap-0 border border-[var(--ink)] md:grid-cols-2">
          {client.files.map((file, index) => (
            <FileCard key={file.label} file={file} index={index} />
          ))}
        </div>
      </section>

      <section id="agent-actions" className="mx-auto max-w-7xl px-6 pb-16">
        <SectionTitle number="03" label="AGENT ACTIONS" title="The client runs the business through actions." />
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {client.actions.map(action => (
            <div key={action.label} className="border border-[var(--ink)] bg-white/25 p-5">
              <div className="mono mb-4 text-[10px] tracking-[0.2em] text-[var(--accent)]">{statusLabel(action.status)}</div>
              <h3 className="text-2xl font-semibold tracking-[-0.025em]">{action.label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-65">{action.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <SectionTitle number="04" label="NEXT PAID BUILDS" title="Upsells are useful unlocks, not random add-ons." />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {client.paidOptions.map(option => (
            <div key={option.label} className="border border-[var(--rule)] p-5">
              <div className="mono mb-4 text-[10px] tracking-[0.2em] text-[var(--accent)]">AVAILABLE</div>
              <h3 className="text-xl font-semibold tracking-[-0.02em]">{option.label}</h3>
              <p className="mt-3 text-sm leading-6 opacity-65">{option.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-[var(--ink)] p-5 last:border-r-0">
      <div className="mono text-[10px] tracking-[0.2em] opacity-45">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  )
}

function SectionTitle({ number, label, title }: { number: string; label: string; title: string }) {
  return (
    <div className="border-t border-[var(--ink)] pt-6">
      <div className="mono text-[11px] font-semibold tracking-[0.22em] text-[var(--accent)]">§ {number} · {label}</div>
      <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-none tracking-[-0.035em] md:text-5xl">{title}</h2>
    </div>
  )
}

function FileCard({ file, index }: { file: ClientAgentFile; index: number }) {
  const body = (
    <div className="min-h-44 border-b border-r border-[var(--ink)] p-5 transition hover:bg-white/40">
      <div className="mono mb-5 flex justify-between text-[10px] tracking-[0.18em] opacity-55">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>{statusLabel(file.status)}</span>
      </div>
      <h3 className="text-2xl font-semibold tracking-[-0.025em]">{file.label}</h3>
      <p className="mt-3 text-sm leading-6 opacity-65">{file.description}</p>
    </div>
  )

  if (!file.href) return body
  return (
    <Link href={file.href} className="block text-inherit no-underline">
      {body}
    </Link>
  )
}
