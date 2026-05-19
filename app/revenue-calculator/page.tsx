'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RevenueCalculatorPage() {
  const [leadsPerDay, setLeadsPerDay] = useState(200)
  const [contactRate, setContactRate] = useState(25)
  const [qualifyRate, setQualifyRate] = useState(20)
  const [closeRate, setCloseRate] = useState(15)
  const [avgDealSize, setAvgDealSize] = useState(499)
  const [months, setMonths] = useState(6)

  const dailyContacted = Math.round(leadsPerDay * (contactRate / 100))
  const dailyQualified = Math.round(dailyContacted * (qualifyRate / 100))
  const dailyClosed = Math.round(dailyQualified * (closeRate / 100))
  const monthlyClosed = dailyClosed * 30
  const monthlyMRR = monthlyClosed * avgDealSize
  const totalMRR = monthlyMRR * months
  const totalClients = monthlyClosed * months

  return (
    <main className="bg-paper text-ink min-h-screen">
      <section className="px-8 pt-32 pb-20 max-w-4xl mx-auto">
        <div className="mono text-[10px] tracking-[0.3em] text-accent mb-8 font-bold">
          REVENUE PROJECTION CALCULATOR
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-[0.9] mb-8">
          How fast can you<br />
          <span className="italic font-serif">scale to $1M ARR?</span>
        </h1>
        <p className="text-xl opacity-60 max-w-2xl leading-relaxed mb-12">
          Adjust the inputs below to see your projected revenue growth.
          Based on automated lead generation + email outreach.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              LEADS PER DAY
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              value={leadsPerDay}
              onChange={(e) => setLeadsPerDay(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">{leadsPerDay}</div>
          </div>

          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              CONTACT RATE (%)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={contactRate}
              onChange={(e) => setContactRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">{contactRate}%</div>
          </div>

          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              QUALIFY RATE (%)
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={qualifyRate}
              onChange={(e) => setQualifyRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">{qualifyRate}%</div>
          </div>

          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              CLOSE RATE (%)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">{closeRate}%</div>
          </div>

          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              AVG DEAL SIZE ($/mo)
            </label>
            <input
              type="range"
              min="99"
              max="1999"
              step="50"
              value={avgDealSize}
              onChange={(e) => setAvgDealSize(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">${avgDealSize}</div>
          </div>

          <div>
            <label className="mono text-[9px] tracking-[0.26em] opacity-40 block mb-2">
              PROJECTION (MONTHS)
            </label>
            <input
              type="range"
              min="1"
              max="24"
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-2xl font-bold mt-2">{months} months</div>
          </div>
        </div>

        {/* Results */}
        <div className="border-2 border-ink p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Projected Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-1">DAILY CLOSED</div>
              <div className="text-3xl font-bold">{dailyClosed}</div>
            </div>
            <div>
              <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-1">MONTHLY CLOSED</div>
              <div className="text-3xl font-bold">{monthlyClosed}</div>
            </div>
            <div>
              <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-1">MONTHLY MRR</div>
              <div className="text-3xl font-bold text-accent">${monthlyMRR.toLocaleString()}</div>
            </div>
            <div>
              <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-1">TOTAL CLIENTS</div>
              <div className="text-3xl font-bold">{totalClients}</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-ink/10">
            <div className="mono text-[9px] tracking-[0.26em] opacity-40 mb-1">
              {months}-MONTH REVENUE
            </div>
            <div className="text-4xl font-bold text-accent">
              ${(totalMRR * 12).toLocaleString()} ARR
            </div>
          </div>
        </div>

        {/* CTA — direct to checkout from the highest-intent moment on the site */}
        <div className="text-center">
          <p className="text-lg opacity-70 mb-2 font-semibold">
            That ${(totalMRR * 12).toLocaleString()} is sitting there right now. Let's go capture it.
          </p>
          <p className="text-sm opacity-50 mb-6">
            Agent Three deploys the workflows above. Want the map first? Run the free diagnostic, then choose the build tier.
          </p>
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/pricing?tier=core&checkout=1"
              className="inline-block bg-ink text-paper px-10 py-5 font-bold text-lg tracking-tight hover:bg-accent transition-colors"
            >
              Start Agent Three — $999/mo →
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/pricing" className="opacity-60 underline underline-offset-4 hover:opacity-100">
                Compare tiers
              </Link>
              <span className="opacity-30">·</span>
              <Link href="/#diagnostic" className="opacity-60 underline underline-offset-4 hover:opacity-100">
                Free diagnostic first
              </Link>
            </div>
            <p className="mono text-[10px] opacity-40 tracking-[0.18em] uppercase mt-2">
              Secured by Stripe · Visa · MC · Amex · Cancel anytime
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
