'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const industries = [
  {
    id: 'dental',
    label: 'Dental',
    icon: '🦷',
    automations: [
      {
        title: 'Appointment Confirmations',
        before: '2 hrs/day calling patients',
        after: 'AI texts + calls 24/7',
        savings: '$800/mo',
        description: 'Automated reminders via text and phone. Patients can confirm, reschedule, or cancel without talking to anyone.',
      },
      {
        title: 'Insurance Verification',
        before: '1 hr/patient manual checks',
        after: 'Instant API verification',
        savings: '$1,200/mo',
        description: 'Real-time insurance eligibility checks before appointments. No more surprises at checkout.',
      },
      {
        title: 'Patient Intake Forms',
        before: 'Paper forms + manual entry',
        after: 'Digital forms + auto-populate',
        savings: '$600/mo',
        description: 'Patients fill forms on their phone. Data flows directly into your practice management system.',
      },
      {
        title: 'No-Show Follow-ups',
        before: 'Manual calls after no-shows',
        after: 'Auto-reschedule offers',
        savings: '$400/mo',
        description: 'Instant outreach when someone doesn\'t show. Fill empty slots automatically.',
      },
    ],
  },
  {
    id: 'legal',
    label: 'Law Firms',
    icon: '⚖️',
    automations: [
      {
        title: 'Client Intake',
        before: '30 min/call screening',
        after: 'AI qualification bot',
        savings: '$2,400/mo',
        description: 'Automated initial consultations. Qualify leads before they ever talk to a lawyer.',
      },
      {
        title: 'Document Review',
        before: 'Hours of manual review',
        after: 'AI extracts key clauses',
        savings: '$3,200/mo',
        description: 'Automated contract review. Flag unusual clauses, missing terms, and risks instantly.',
      },
      {
        title: 'Appointment Scheduling',
        before: 'Back-and-forth emails',
        after: 'Self-service booking',
        savings: '$800/mo',
        description: 'Clients book directly into your calendar. No more phone tag.',
      },
      {
        title: 'Status Updates',
        before: 'Manual client calls',
        after: 'Auto case updates',
        savings: '$1,000/mo',
        description: 'Clients get automatic updates on their case status. Fewer "where\'s my case?" calls.',
      },
    ],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: '🏠',
    automations: [
      {
        title: 'Lead Qualification',
        before: 'Manual call screening',
        after: 'AI pre-qualifies buyers',
        savings: '$1,800/mo',
        description: 'Automated buyer qualification. Know budget, timeline, and needs before the first showing.',
      },
      {
        title: 'Showing Scheduling',
        before: 'Coordination calls',
        after: 'Self-service booking',
        savings: '$600/mo',
        description: 'Buyers book showings directly. Syncs with your calendar automatically.',
      },
      {
        title: 'Follow-up Sequences',
        before: 'Manual check-ins',
        after: 'Automated nurture',
        savings: '$1,200/mo',
        description: 'Automated follow-up after showings. Keep hot leads warm without lifting a finger.',
      },
      {
        title: 'Document Collection',
        before: 'Chasing paperwork',
        after: 'Auto-request system',
        savings: '$800/mo',
        description: 'Automated document requests. Get pre-approvals, IDs, and disclosures collected fast.',
      },
    ],
  },
  {
    id: 'contractors',
    label: 'Contractors',
    icon: '🔨',
    automations: [
      {
        title: 'Estimate Requests',
        before: 'Phone tag + manual quotes',
        after: 'AI qualification + scheduling',
        savings: '$1,500/mo',
        description: 'Automated initial consultations. Qualify jobs and schedule estimates without phone calls.',
      },
      {
        title: 'Job Scheduling',
        before: 'Manual coordination',
        after: 'Auto-schedule by zone',
        savings: '$900/mo',
        description: 'Optimize routes and schedules automatically. Group jobs by location and priority.',
      },
      {
        title: 'Invoice Follow-ups',
        before: 'Chasing payments',
        after: 'Auto payment reminders',
        savings: '$2,000/mo',
        description: 'Automated payment reminders. Get paid faster without awkward conversations.',
      },
      {
        title: 'Review Requests',
        after: 'Manual ask after job',
        savings: '$500/mo',
        description: 'Automated review requests after job completion. Build your reputation on autopilot.',
      },
    ],
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: '🏥',
    automations: [
      {
        title: 'Appointment Reminders',
        before: 'Staff calls 24h before',
        after: 'Multi-channel auto-remind',
        savings: '$1,600/mo',
        description: 'Text, email, and call reminders. Reduce no-shows by up to 40%.',
      },
      {
        title: 'Prescription Refills',
        before: 'Phone requests + manual entry',
        after: 'Patient self-service',
        savings: '$1,200/mo',
        description: 'Patients request refills via text. Auto-sent to pharmacy after approval.',
      },
      {
        title: 'Lab Results Delivery',
        before: 'Manual calls for results',
        after: 'Secure auto-delivery',
        savings: '$800/mo',
        description: 'Results delivered automatically via patient portal. Flag urgent results for immediate review.',
      },
      {
        title: 'Insurance Pre-Auth',
        before: 'Manual paperwork',
        after: 'AI-assisted processing',
        savings: '$2,400/mo',
        description: 'Automated prior authorization requests. Track status and follow up automatically.',
      },
    ],
  },
]

export function IndustrySelector() {
  const [activeIndustry, setActiveIndustry] = useState(0)
  const industry = industries[activeIndustry]

  return (
    <section className="bg-gray-950 text-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            What we automate for{' '}
            <span className="text-cyan-500">{industry.label}</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Click an industry to see exactly what we'd automate for your business.
          </p>
        </motion.div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {industries.map((ind, i) => (
            <button
              key={ind.id}
              onClick={() => setActiveIndustry(i)}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeIndustry === i
                  ? 'bg-cyan-500 text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span>{ind.icon}</span>
              <span>{ind.label}</span>
            </button>
          ))}
        </div>

        {/* Automation Cards */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {industry.automations.map((auto, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-cyan-900/50 transition-all"
                >
                  <h3 className="text-xl font-bold mb-4">{auto.title}</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-red-500 text-sm">BEFORE:</span>
                      <span className="text-gray-400 text-sm">{auto.before}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-500 text-sm">AFTER:</span>
                      <span className="text-gray-300 text-sm">{auto.after}</span>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">{auto.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-cyan-500 font-bold font-mono">{auto.savings}</span>
                    <span className="text-gray-500 text-sm">estimated savings</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Total Savings Callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mt-16 bg-gradient-to-r from-cyan-950/50 to-purple-950/50 border border-cyan-900/50 rounded-lg p-8 text-center"
        >
          <p className="text-gray-400 mb-2">Total estimated savings for {industry.label}</p>
          <p className="text-4xl font-bold text-cyan-500 font-mono mb-4">
            ${industry.automations.reduce((sum, a) => {
              const num = parseInt(a.savings.replace(/[$,mo]/g, ''))
              return sum + num
            }, 0).toLocaleString()}/mo
          </p>
          <a
            href="/contact"
            className="inline-block bg-cyan-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-cyan-400 transition-all"
          >
            Get Your Custom Estimate →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
