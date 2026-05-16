'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const industries = [
  {
    id: 'dental',
    label: 'Dental',
    icon: '🦷',
    color: '#2E5BFF',
    tasks: [
      { name: 'Appt Confirmations', hours: 2.5, savings: 800 },
      { name: 'Insurance Verify', hours: 2.0, savings: 1200 },
      { name: 'Patient Intake', hours: 1.5, savings: 600 },
      { name: 'No-Show Follow-ups', hours: 1.0, savings: 400 },
    ],
  },
  {
    id: 'legal',
    label: 'Legal',
    icon: '⚖️',
    color: '#7B6FE8',
    tasks: [
      { name: 'Client Intake', hours: 3.0, savings: 2400 },
      { name: 'Document Review', hours: 4.0, savings: 3200 },
      { name: 'Scheduling', hours: 1.5, savings: 800 },
      { name: 'Status Updates', hours: 1.0, savings: 1000 },
    ],
  },
  {
    id: 'realestate',
    label: 'Real Estate',
    icon: '🏠',
    color: '#3CB97A',
    tasks: [
      { name: 'Lead Qualification', hours: 2.5, savings: 1800 },
      { name: 'Showing Schedule', hours: 1.5, savings: 600 },
      { name: 'Follow-up Seq', hours: 2.0, savings: 1200 },
      { name: 'Doc Collection', hours: 1.5, savings: 800 },
    ],
  },
  {
    id: 'contractors',
    label: 'Contractors',
    icon: '🔨',
    color: '#E6A820',
    tasks: [
      { name: 'Estimate Requests', hours: 2.0, savings: 1500 },
      { name: 'Job Scheduling', hours: 1.5, savings: 900 },
      { name: 'Invoice Follow-ups', hours: 1.5, savings: 2000 },
      { name: 'Review Requests', hours: 0.5, savings: 500 },
    ],
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: '🏥',
    color: '#c9553d',
    tasks: [
      { name: 'Appt Reminders', hours: 2.0, savings: 1600 },
      { name: 'Rx Refills', hours: 1.5, savings: 1200 },
      { name: 'Lab Results', hours: 1.0, savings: 800 },
      { name: 'Insurance Pre-Auth', hours: 2.5, savings: 2400 },
    ],
  },
]

export function BarrelDiagram() {
  const [activeIndustry, setActiveIndustry] = useState(0)
  const industry = industries[activeIndustry]
  const totalSavings = industry.tasks.reduce((s, t) => s + t.savings, 0)
  const totalHours = industry.tasks.reduce((s, t) => s + t.hours, 0)

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="mono text-accent text-sm mb-2">BY INDUSTRY</p>
        <h2 className="text-3xl md:text-4xl font-bold">
          What we automate for{' '}
          <span style={{ color: industry.color }}>{industry.label}</span>
        </h2>
      </div>

      {/* Industry selector */}
      <div className="flex justify-center gap-2 mb-8">
        {industries.map((ind, i) => (
          <button
            key={ind.id}
            onClick={() => setActiveIndustry(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeIndustry === i
                ? 'text-white'
                : 'bg-paper text-ink/60 border border-rule hover:border-ink/30'
            }`}
            style={activeIndustry === i ? { backgroundColor: ind.color } : {}}
          >
            <span>{ind.icon}</span>
            <span>{ind.label}</span>
          </button>
        ))}
      </div>

      {/* Barrel visualization */}
      <div className="bg-paper border border-rule rounded-lg p-6 mb-6">
        <div className="space-y-3">
          {industry.tasks.map((task, i) => (
            <motion.div
              key={`${industry.id}-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4"
            >
              {/* Label */}
              <div className="w-32 text-right">
                <p className="text-sm font-medium">{task.name}</p>
                <p className="text-xs text-ink/40 mono">{task.hours}h/wk</p>
              </div>

              {/* Bar */}
              <div className="flex-1 h-8 bg-rule/30 rounded overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(task.hours / 4) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="h-full rounded"
                  style={{ backgroundColor: industry.color }}
                />
              </div>

              {/* Savings */}
              <div className="w-20 text-right">
                <p className="font-bold mono" style={{ color: industry.color }}>
                  ${task.savings}
                </p>
                <p className="text-[10px] text-ink/40 mono">/mo</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between">
          <div>
            <p className="font-bold text-lg">{industry.label} Total</p>
            <p className="text-sm text-ink/50">{totalHours} hours/week recovered</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold mono" style={{ color: industry.color }}>
              ${totalSavings.toLocaleString()}/mo
            </p>
            <p className="text-xs text-ink/40 mono">ESTIMATED SAVINGS</p>
          </div>
        </div>
      </div>
    </div>
  )
}
