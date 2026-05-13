'use client'

import { FormEvent, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const CONTACT_EMAIL = 'info@studio23roofing.com'

type IntakeState = {
  name: string
  phone: string
  email: string
  address: string
  service: string
  urgency: string
  claimStatus: string
  details: string
}

const INITIAL_STATE: IntakeState = {
  name: '',
  phone: '',
  email: '',
  address: '',
  service: 'Roof inspection',
  urgency: 'This week',
  claimStatus: 'Not filed yet',
  details: '',
}

export function AgentIntake() {
  const [form, setForm] = useState<IntakeState>(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)

  const completion = useMemo(() => {
    const required = ['name', 'phone', 'address', 'details'] as const
    const complete = required.filter(key => form[key].trim().length > 0).length
    return Math.round((complete / required.length) * 100)
  }, [form])

  const mailtoHref = useMemo(() => {
    const subject = `Studio 23 inspection request — ${form.address || 'new lead'}`
    const body = [
      'New Studio 23 inspection request',
      '',
      `Name: ${form.name || 'Not provided'}`,
      `Phone: ${form.phone || 'Not provided'}`,
      `Email: ${form.email || 'Not provided'}`,
      `Property address: ${form.address || 'Not provided'}`,
      `Service: ${form.service}`,
      `Urgency: ${form.urgency}`,
      `Insurance claim status: ${form.claimStatus}`,
      '',
      'Project details:',
      form.details || 'Not provided',
      '',
      'Next action: call the lead, confirm inspection window, and request photos if not already provided.',
    ].join('\n')

    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }, [form])

  function updateField(key: keyof IntakeState, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
    setSubmitted(false)
  }

  function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <form onSubmit={submitIntake} className="bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <input
              value={form.name}
              onChange={event => updateField('name', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
              placeholder="Homeowner or property manager"
            />
          </Field>
          <Field label="Phone">
            <input
              value={form.phone}
              onChange={event => updateField('phone', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
              placeholder="Best callback number"
            />
          </Field>
          <Field label="Email">
            <input
              value={form.email}
              onChange={event => updateField('email', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
              placeholder="Optional"
            />
          </Field>
          <Field label="Property address">
            <input
              value={form.address}
              onChange={event => updateField('address', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
              placeholder="Street, city, ZIP"
            />
          </Field>
          <Field label="Service">
            <select
              value={form.service}
              onChange={event => updateField('service', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
            >
              <option>Roof inspection</option>
              <option>Roof repair</option>
              <option>Roof replacement</option>
              <option>Storm or hail damage</option>
              <option>Commercial roofing</option>
              <option>Gutters</option>
              <option>Fencing</option>
            </select>
          </Field>
          <Field label="Urgency">
            <select
              value={form.urgency}
              onChange={event => updateField('urgency', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
            >
              <option>Emergency</option>
              <option>This week</option>
              <option>This month</option>
              <option>Planning ahead</option>
            </select>
          </Field>
          <Field label="Insurance status">
            <select
              value={form.claimStatus}
              onChange={event => updateField('claimStatus', event.target.value)}
              className="w-full border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
            >
              <option>Not filed yet</option>
              <option>Claim already filed</option>
              <option>Adjuster scheduled</option>
              <option>Need guidance</option>
              <option>No insurance claim</option>
            </select>
          </Field>
          <Field label="Damage or project details" className="md:col-span-2">
            <textarea
              value={form.details}
              onChange={event => updateField('details', event.target.value)}
              className="min-h-36 w-full resize-y border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-[#d40000]"
              placeholder="Tell us what happened, what needs attention, and whether photos are available."
            />
          </Field>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-black px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#d40000]"
          >
            Package intake
          </button>
          <a
            href={mailtoHref}
            className="rounded-full border border-black/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] no-underline transition hover:border-black"
          >
            Open email packet
          </a>
        </div>
      </form>

      <aside className="bg-[#171717] p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff4b3e]">
          Agent Readiness
        </p>
        <div className="mt-5 h-2 bg-white/10">
          <div className="h-full bg-[#d40000]" style={{ width: `${completion}%` }} />
        </div>
        <p className="mt-3 font-mono text-sm text-white/70">{completion}% intake complete</p>

        <div className="mt-8 space-y-5">
          <AgentStep title="1. Qualify">
            Captures property, service type, urgency, claim status, and damage context.
          </AgentStep>
          <AgentStep title="2. Route">
            Sends a clean lead packet to Studio 23 for callback and inspection scheduling.
          </AgentStep>
          <AgentStep title="3. Track">
            Next build can push this into a claim tracker, CRM, calendar, or job board.
          </AgentStep>
        </div>

        {submitted && (
          <div className="mt-8 border border-white/15 bg-white/[0.08] p-5">
            <p className="font-serif text-3xl">Intake packaged</p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              The next button opens an email draft with the lead details. Once Studio 23 chooses
              a CRM or booking tool, this can become a direct workflow instead of email.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}

function Field({ label, className = '', children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-black/55">
        {label}
      </span>
      {children}
    </label>
  )
}

function AgentStep({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-white/15 pt-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/68">{children}</p>
    </div>
  )
}
