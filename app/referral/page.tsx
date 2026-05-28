'use client'
import Link from 'next/link'
import { useState } from 'react'
import { VolvvE } from '@/components/VolvvE'

export default function ReferralPage() {
  const [email, setEmail] = useState('')
  const [referralUrl, setReferralUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const generateLink = async () => {
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) setReferralUrl(data.url)
    } finally {
      setLoading(false)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <main className="bg-paper text-ink min-h-screen">
      {/* Hero */}
      <section className="px-8 pt-32 pb-20 text-center max-w-4xl mx-auto">
        <div className="mono text-[10px] tracking-[0.3em] text-accent mb-8 font-bold">
          REFERRAL PROGRAM
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
          Give a month.<br />
          <span className="italic font-serif">Get a month.</span>
        </h1>
        <p className="text-xl opacity-60 max-w-2xl mx-auto leading-relaxed mb-12">
          Know a business that&apos;s drowning in manual work? Send them eevolvv.
          When they subscribe, you get <strong>$100 credit</strong> — up to 2 months free.
        </p>
        {referralUrl ? (
          <div className="text-center">
            <p className="text-sm opacity-60 mb-4">Your referral link is ready:</p>
            <div className="flex items-center justify-center gap-2 max-w-lg mx-auto">
              <code className="bg-ink/5 px-4 py-3 rounded text-sm font-mono flex-1 truncate border border-ink/10">
                {referralUrl}
              </code>
              <button
                onClick={copyLink}
                className="bg-ink text-paper px-6 py-3 font-bold text-sm hover:bg-accent transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-sm mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generateLink()}
                className="flex-1 px-4 py-3 border-2 border-ink/10 bg-transparent text-ink text-sm focus:outline-none focus:border-accent"
              />
              <button
                onClick={generateLink}
                disabled={loading || !email}
                className="bg-ink text-paper px-6 py-3 font-bold text-sm hover:bg-accent transition-colors disabled:opacity-40"
              >
                {loading ? '...' : 'Get Link →'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 border-t border-ink/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border-2 border-ink/10 p-8">
              <div className="mono text-[9px] tracking-[0.26em] text-accent mb-4 font-bold">
                STEP 01
              </div>
              <h3 className="text-xl font-bold mb-3">Share Your Link</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Get a unique referral link from your dashboard. Share it with business owners who are wasting time on manual work.
              </p>
            </div>
            <div className="border-2 border-ink/10 p-8">
              <div className="mono text-[9px] tracking-[0.26em] text-accent mb-4 font-bold">
                STEP 02
              </div>
              <h3 className="text-xl font-bold mb-3">They Subscribe</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                Your referral signs up for any paid plan (Seed at $499/mo or above). Their subscription activates immediately.
              </p>
            </div>
            <div className="border-2 border-ink/10 p-8">
              <div className="mono text-[9px] tracking-[0.26em] text-accent mb-4 font-bold">
                STEP 03
              </div>
              <h3 className="text-xl font-bold mb-3">You Get $100</h3>
              <p className="text-sm opacity-60 leading-relaxed">
                $100 credit is applied to your next invoice. No cap — refer 10 clients, get $1,000 in credits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Rewards Table */}
      <section className="px-8 py-20 border-t border-ink/10 bg-ink text-paper">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight mb-12 text-center">Referral Rewards</h2>
          <div className="border-2 border-paper/20">
            <table className="w-full">
              <thead>
                <tr className="border-b border-paper/20">
                  <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-60">
                    REFERRALS
                  </th>
                  <th className="text-left p-4 mono text-[9px] tracking-[0.26em] opacity-60">
                    CREDIT EARNED
                  </th>
                  <th className="text-right p-4 mono text-[9px] tracking-[0.26em] opacity-60">
                    MONTHS FREE
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { refs: '1', credit: '$100', months: '0.2' },
                  { refs: '3', credit: '$300', months: '0.6' },
                  { refs: '5', credit: '$500', months: '1' },
                  { refs: '10', credit: '$1,000', months: '2' },
                  { refs: '25', credit: '$2,500', months: '5' },
                  { refs: '50', credit: '$5,000', months: '10' },
                ].map((row) => (
                  <tr key={row.refs} className="border-b border-paper/10">
                    <td className="p-4 font-bold">{row.refs}</td>
                    <td className="p-4">{row.credit}</td>
                    <td className="p-4 text-right">{row.months}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <VolvvE scale={3} state="thinking" />
        <h2 className="text-4xl font-bold tracking-tight mt-8 mb-4">
          Start earning today.
        </h2>
        <p className="text-lg opacity-60 mb-8">
          Every business owner you know is leaving money on the table.
        </p>
        {referralUrl ? (
          <a
            href={referralUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-ink text-paper px-10 py-5 font-bold text-lg tracking-tight hover:bg-accent transition-colors"
          >
            Open Your Link →
          </a>
        ) : (
          <button
            onClick={generateLink}
            disabled={loading || !email}
            className="inline-block bg-ink text-paper px-10 py-5 font-bold text-lg tracking-tight hover:bg-accent transition-colors disabled:opacity-40"
          >
            {loading ? 'Generating...' : 'Get Your Link →'}
          </button>
        )}
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-ink/10 text-center">
        <p className="mono text-[10px] tracking-[0.2em] opacity-30">
          eevolvv, Inc. · Delaware C Corp · +1 (844) 433-8658
        </p>
      </footer>
    </main>
  )
}
