'use client'

import { useState } from 'react'
import Link from 'next/link'
import posthog from 'posthog-js'

export default function ContactPage() {
  const [fields, setFields] = useState({ name: '', email: '', phone: '', message: '' })
  const [smsConsent, setSmsConsent] = useState<boolean | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fields, smsConsent: smsConsent === true }),
      })
      if (res.ok) {
        posthog.identify(fields.email, { email: fields.email, name: fields.name })
        posthog.capture('contact_form_submitted', {
          has_phone: !!fields.phone.trim(),
          sms_consent: smsConsent === true,
        })
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background: 'var(--paper)', color: 'var(--ink)', minHeight: '100vh', fontFamily: 'var(--font-display)' }}>
      <header className="border-b border-black/10">
        <div className="site-rail flex h-14 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-[var(--ink)] no-underline">
            eevolvv
          </Link>
          <Link href="/" className="text-xs text-black/50 hover:text-black/80 transition-colors">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="site-rail py-14 md:py-20">
        <div className="mx-auto max-w-lg">
          <p className="mono text-[11px] uppercase tracking-[0.28em] text-black/40">Buy now · or get in touch</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Skip the call. Pick a tier.</h1>
          <p className="mt-2 text-sm text-black/50">
            Direct checkout below — no demo required, live in 14 days, cancel anytime. Or send a message if you need help choosing.
          </p>

          {/* Direct-buy buttons — above the form, where the eye lands */}
          <div className="mt-8 grid gap-3">
            <Link
              href="/pricing?tier=core&checkout=1"
              className="mono flex items-center justify-between rounded border border-black/15 bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-[var(--paper)] no-underline transition-opacity hover:opacity-90"
              style={{ letterSpacing: '0.14em' }}
            >
              <span>AGENT THREE · $999/MO · MOST POPULAR</span>
              <span>→</span>
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/pricing?tier=seed&checkout=1"
                className="mono flex items-center justify-between rounded border border-black/15 bg-white px-4 py-3 text-xs font-semibold text-[var(--ink)] no-underline transition-colors hover:bg-black/[0.03]"
                style={{ letterSpacing: '0.14em' }}
              >
                <span>AGENT ONE $499/MO</span>
                <span>→</span>
              </Link>
              <Link
                href="/pricing"
                className="mono flex items-center justify-between rounded border border-black/15 bg-white px-4 py-3 text-xs font-semibold text-[var(--ink)] no-underline transition-colors hover:bg-black/[0.03]"
                style={{ letterSpacing: '0.14em' }}
              >
                <span>$97 FAST PATH</span>
                <span>→</span>
              </Link>
            </div>
            <p className="mono text-[10px] text-black/45" style={{ letterSpacing: '0.14em' }}>
              SECURED BY STRIPE · CANCEL ANYTIME · $2K/MO RECOVERED OR YOUR MONEY BACK
            </p>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10" />
            <div className="mono text-[10px] tracking-[0.22em] text-black/40">OR · MESSAGE US</div>
            <div className="h-px flex-1 bg-black/10" />
          </div>
          <p className="mt-4 text-sm text-black/50">We'll reply within one business day.</p>

          {status === 'done' ? (
            <div className="mt-10 rounded border border-black/10 bg-black/[0.03] p-6 text-center space-y-2">
              <p className="font-semibold text-[var(--ink)]">Message sent.</p>
              <p className="text-sm text-black/50">We'll be in touch soon.</p>
              <Link href="/" className="mt-4 inline-block text-sm font-medium underline-offset-2 hover:underline">
                ← Back to eevolvv
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-10 space-y-5">
              {/* name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Name</label>
                <input
                  required
                  value={fields.name}
                  onChange={set('name')}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:border-black/40 focus:ring-0"
                  placeholder="Your name"
                />
              </div>

              {/* email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Email</label>
                <input
                  required
                  type="email"
                  value={fields.email}
                  onChange={set('email')}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:border-black/40 focus:ring-0"
                  placeholder="you@company.com"
                />
              </div>

              {/* phone */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">
                  Phone number <span className="font-normal text-black/40">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={fields.phone}
                  onChange={set('phone')}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:border-black/40 focus:ring-0"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* message */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  required
                  rows={5}
                  value={fields.message}
                  onChange={set('message')}
                  className="w-full rounded border border-black/15 bg-white px-3 py-2 text-sm placeholder:text-black/30 focus:border-black/40 focus:ring-0 resize-none"
                  placeholder="Tell us what you're working on…"
                />
              </div>

              {/* sms opt-in — only shown if phone is filled */}
              {fields.phone.trim().length > 4 && (
                <div className="rounded border border-black/10 bg-black/[0.02] p-4 space-y-3 text-sm">
                  <p className="text-black/70">
                    eevolvv would like your consent to send informational text message
                    communications from <span className="mono font-semibold">+1 (844) 433-8658</span> to
                    your mobile number, in response to your questions or to provide information
                    relevant to your relationship with us.
                  </p>
                  <p className="text-xs text-black/50">
                    Consent is not a condition of purchase. Message frequency varies. Message and
                    data rates may apply. Reply STOP to unsubscribe at any time. Reply HELP for
                    assistance. We do not share your mobile opt-in information with anyone.{' '}
                    <Link href="/privacy#sms-opt-in" className="underline underline-offset-2">
                      Privacy policy & messaging terms
                    </Link>
                    .
                  </p>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="sms"
                        className="mt-0.5 accent-black"
                        onChange={() => setSmsConsent(true)}
                        checked={smsConsent === true}
                      />
                      <span>Yes, I consent to receive informational messages from eevolvv</span>
                    </label>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="sms"
                        className="mt-0.5 accent-black"
                        onChange={() => setSmsConsent(false)}
                        checked={smsConsent === false}
                      />
                      <span>No, I do not want to receive any text messages from eevolvv</span>
                    </label>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <p className="text-sm text-red-600">Something went wrong — please try again or email hello@eevolvv.com.</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded bg-[var(--ink)] py-2.5 text-sm font-semibold text-[var(--paper)] transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
