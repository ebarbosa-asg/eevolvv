'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { CountingNumber } from '../ui/counting-number'

const weeklyData = [
  {
    day: 'MON',
    tasks: [
      { label: 'Appointment confirmations', hours: 2.5, color: 'bg-red-500' },
      { label: 'Insurance verification', hours: 1.5, color: 'bg-orange-500' },
      { label: 'Patient intake forms', hours: 1.0, color: 'bg-yellow-500' },
      { label: 'Follow-up calls', hours: 1.0, color: 'bg-pink-500' },
    ],
  },
  {
    day: 'TUE',
    tasks: [
      { label: 'Appointment reminders', hours: 2.0, color: 'bg-red-500' },
      { label: 'Insurance calls', hours: 2.0, color: 'bg-orange-500' },
      { label: 'New patient setup', hours: 1.5, color: 'bg-yellow-500' },
      { label: 'Referral processing', hours: 0.5, color: 'bg-pink-500' },
    ],
  },
  {
    day: 'WED',
    tasks: [
      { label: 'No-show follow-ups', hours: 1.5, color: 'bg-red-500' },
      { label: 'Insurance verification', hours: 2.0, color: 'bg-orange-500' },
      { label: 'Form processing', hours: 1.5, color: 'bg-yellow-500' },
      { label: 'Callback requests', hours: 1.0, color: 'bg-pink-500' },
    ],
  },
  {
    day: 'THU',
    tasks: [
      { label: 'Appointment confirmations', hours: 2.0, color: 'bg-red-500' },
      { label: 'Insurance calls', hours: 1.5, color: 'bg-orange-500' },
      { label: 'Patient intake', hours: 1.5, color: 'bg-yellow-500' },
      { label: 'Schedule coordination', hours: 1.0, color: 'bg-pink-500' },
    ],
  },
  {
    day: 'FRI',
    tasks: [
      { label: 'End-of-week follow-ups', hours: 2.0, color: 'bg-red-500' },
      { label: 'Insurance catch-up', hours: 1.5, color: 'bg-orange-500' },
      { label: 'Form cleanup', hours: 1.0, color: 'bg-yellow-500' },
      { label: 'Next week prep', hours: 1.5, color: 'bg-pink-500' },
    ],
  },
]

const totalHours = weeklyData.reduce(
  (sum, day) => sum + day.tasks.reduce((s, t) => s + t.hours, 0),
  0
)

const hourlyRate = 40
const monthlyWaste = totalHours * hourlyRate * 4

export function PainCalendar() {
  const [isClient, setIsClient] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            You're losing{' '}
            <span className="text-red-500">
              <CountingNumber value={totalHours} format={(n) => n.toFixed(1)} /> hours/week
            </span>{' '}
            to work a machine could do.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Here's what a typical week looks like for a dental practice with 20+ employees.
            Every colored block is time your team spends on tasks that could be automated.
          </p>
        </motion.div>

        {/* Calendar Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-5 gap-4">
            {weeklyData.map((day, dayIndex) => (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: dayIndex * 0.1 }}
                className={`bg-gray-900/50 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedDay === dayIndex ? 'ring-2 ring-cyan-500' : 'hover:ring-1 hover:ring-gray-700'
                }`}
                onClick={() => setSelectedDay(selectedDay === dayIndex ? null : dayIndex)}
              >
                <div className="text-center mb-4">
                  <span className="text-cyan-500 font-mono font-bold">{day.day}</span>
                  <div className="text-2xl font-bold mt-1">
                    {day.tasks.reduce((s, t) => s + t.hours, 0).toFixed(1)}h
                  </div>
                </div>
                
                {/* Stacked bars */}
                <div className="space-y-2">
                  {day.tasks.map((task, taskIndex) => (
                    <motion.div
                      key={taskIndex}
                      initial={{ width: 0 }}
                      whileInView={{ width: '100%' }}
                      viewport={{ once: true }}
                      transition={{ delay: dayIndex * 0.1 + taskIndex * 0.05 + 0.5 }}
                      className="relative"
                    >
                      <div className={`h-6 ${task.color} rounded-sm flex items-center px-2`}>
                        <span className="text-xs text-white/80 truncate">
                          {selectedDay === dayIndex ? task.label : ''}
                        </span>
                      </div>
                      {selectedDay === dayIndex && (
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                          {task.hours}h
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6 text-center">
              <p className="text-red-400 text-sm mb-2">HOURS WASTED/WEEK</p>
              <p className="text-4xl font-bold text-red-500 font-mono">
                <CountingNumber value={totalHours} format={(n) => n.toFixed(1)} />
              </p>
            </div>
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6 text-center">
              <p className="text-red-400 text-sm mb-2">COST @ $40/HR</p>
              <p className="text-4xl font-bold text-red-500 font-mono">
                $<CountingNumber value={totalHours * hourlyRate} />
              </p>
              <p className="text-red-400 text-xs">per week</p>
            </div>
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6 text-center">
              <p className="text-red-400 text-sm mb-2">MONTHLY WASTE</p>
              <p className="text-4xl font-bold text-red-500 font-mono">
                $<CountingNumber value={monthlyWaste} />
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 mb-6">
              This is you. <span className="text-cyan-500">Let us show you the fix.</span>
            </p>
            <a
              href="/contact"
              className="inline-block bg-cyan-500 text-black px-8 py-4 rounded-lg font-bold hover:bg-cyan-400 transition-all"
            >
              Show Me What You'd Automate →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
