import Image from 'next/image'
import type { Metadata } from 'next'
import { AgentIntake } from './AgentIntake'

export const metadata: Metadata = {
  title: 'Studio 23 Inspection Agent',
  description: 'Prototype inspection intake and lead-routing agent for Studio 23 Roofing and Construction LLC.',
  robots: { index: false, follow: false },
}

export default function Studio23AgentPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#171717]">
      <header className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
          <a href="/studio-23" className="font-serif text-2xl font-semibold tracking-tight no-underline">
            Studio 23
          </a>
          <nav className="hidden items-center gap-7 text-sm uppercase tracking-[0.18em] text-black/55 md:flex">
            <a href="/studio-23" className="hover:text-black">Site</a>
            <a href="/studio-23#services" className="hover:text-black">Services</a>
            <a href="/studio-23#contact" className="hover:text-black">Contact</a>
          </nav>
          <a
            href="tel:+15127580200"
            className="rounded-full border border-black px-5 py-2 text-sm font-medium no-underline transition hover:bg-black hover:text-white"
          >
            Call now
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[0.95fr_1.05fr] md:py-20">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-[#d40000]">
            Studio 23 Agent Prototype
          </p>
          <h1 className="font-serif text-6xl leading-[0.92] tracking-tight md:text-8xl">
            Inspection intake that does not drop the lead
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-black/70">
            A first operating agent for Studio 23: qualify roof, gutter, fence, and storm-damage
            requests, package the job context, and prepare the next action for the team.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Image
            src="/client-assets/studio-23/crops/active-roof-job.png"
            alt="Active roof installation"
            width={324}
            height={469}
            priority
            className="h-full min-h-[360px] w-full object-cover shadow-sm"
          />
          <div className="grid gap-4">
            <Image
              src="/client-assets/studio-23/crops/fence-install.png"
              alt="Fence installation"
              width={454}
              height={301}
              className="h-full min-h-[170px] w-full object-cover shadow-sm"
            />
            <Image
              src="/client-assets/studio-23/crops/gutter-detail.png"
              alt="Gutter detail"
              width={306}
              height={404}
              className="h-full min-h-[170px] w-full object-cover shadow-sm"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <AgentIntake />
      </section>
    </main>
  )
}
