'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface TimeLeakProps {
  onComplete?: () => void
}

const weeklyTasks = [
  { day: 'MON', label: 'Appt confirmations', hours: 2.5, detail: 'Calling patients one by one' },
  { day: 'MON', label: 'Insurance calls', hours: 1.5, detail: 'Verifying coverage manually' },
  { day: 'MON', label: 'Intake forms', hours: 1.0, detail: 'Paper forms + manual entry' },
  { day: 'MON', label: 'Follow-ups', hours: 1.0, detail: 'No-show callbacks' },
  { day: 'TUE', label: 'Appt reminders', hours: 2.0, detail: '24-hour reminder calls' },
  { day: 'TUE', label: 'Insurance verify', hours: 2.0, detail: 'New patient verification' },
  { day: 'TUE', label: 'New patient setup', hours: 1.5, detail: 'Creating records by hand' },
  { day: 'TUE', label: 'Referrals', hours: 0.5, detail: 'Coordinating with other offices' },
  { day: 'WED', label: 'No-show follow-ups', hours: 1.5, detail: 'Rescheduling missed appts' },
  { day: 'WED', label: 'Insurance catch-up', hours: 2.0, detail: 'Pending verifications' },
  { day: 'WED', label: 'Form processing', hours: 1.5, detail: 'Scanning and filing' },
  { day: 'WED', label: 'Callbacks', hours: 1.0, detail: 'Returning patient calls' },
  { day: 'THU', label: 'Appt confirmations', hours: 2.0, detail: 'Calling patients one by one' },
  { day: 'THU', label: 'Insurance calls', hours: 1.5, detail: 'Verifying coverage manually' },
  { day: 'THU', label: 'Patient intake', hours: 1.5, detail: 'Processing new patients' },
  { day: 'THU', label: 'Schedule coord', hours: 1.0, detail: 'Coordinating schedules' },
  { day: 'FRI', label: 'Week follow-ups', hours: 2.0, detail: 'End-of-week callbacks' },
  { day: 'FRI', label: 'Insurance catch-up', hours: 1.5, detail: 'Week\'s pending items' },
  { day: 'FRI', label: 'Form cleanup', hours: 1.0, detail: 'Filing and organizing' },
  { day: 'FRI', label: 'Next week prep', hours: 1.5, detail: 'Preparing for Monday' },
]

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI']
const dayColors: Record<string, string> = {
  MON: '#c9553d',
  TUE: '#d4763d',
  WED: '#d4a03d',
  THU: '#c9a83d',
  FRI: '#b8b03d',
}

const totalHours = weeklyTasks.reduce((s, t) => s + t.hours, 0)
const hourlyRate = 40
const weeklyCost = totalHours * hourlyRate

export function TimeLeak({ onComplete }: TimeLeakProps) {
  const [activeTask, setActiveTask] = useState<number | null>(null)
  const [revealedTasks, setRevealedTasks] = useState(0)

  // Auto-reveal tasks one by one
  const startReveal = () => {
    if (revealedTasks > 0) return
    let i = 0
    const interval = setInterval(() => {
      i++
      setRevealedTasks(i)
      if (i >= weeklyTasks.length) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 80)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="mono text-accent text-sm mb-2">INTERACTIVE DIAGRAM</p>
        <h2 className="text-3xl md:text-4xl font-bold">
          This is where your week goes.
        </h2>
        <p className="text-ink/50 mt-2">Each block is time lost to manual work. Click to see details.</p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {days.map((day) => {
          const dayTasks = weeklyTasks.filter((t) => t.day === day)
          const dayHours = dayTasks.reduce((s, t) => s + t.hours, 0)
          return (
            <div key={day} className="bg-paper border border-rule rounded-lg overflow-hidden">
              {/* Day header */}
              <div
                className="px-3 py-2 text-center"
                style={{ backgroundColor: dayColors[day] + '20' }}
              >
                <span className="mono text-sm font-bold" style={{ color: dayColors[day] }}>
                  {day}
                </span>
                <div className="text-lg font-bold mono">{dayHours.toFixed(1)}h</div>
              </div>
              {/* Task blocks */}
              <div className="p-2 space-y-1">
                {dayTasks.map((task, taskIdx) => {
                  const globalIdx = weeklyTasks.indexOf(task)
                  const isRevealed = globalIdx < revealedTasks
                  const isActive = activeTask === globalIdx
                  return (
                    <motion.button
                      key={`${day}-${taskIdx}`}
                      initial={{ width: 0, opacity: 0 }}
                      animate={{
                        width: isRevealed ? '100%' : 0,
                        opacity: isRevealed ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      onClick={() => setActiveTask(isActive ? null : globalIdx)}
                      className={`block w-full text-left rounded-sm px-2 py-1 text-[10px] mono transition-all cursor-pointer overflow-hidden whitespace-nowrap ${
                        isActive
                          ? 'ring-2 ring-accent'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: dayColors[day] + '30',
                        color: dayColors[day],
                        height: `${Math.max(task.hours * 12, 20)}px`,
                      }}
                    >
                      {task.hours}h
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail popup */}
      <AnimatePresence>
        {activeTask !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-paper border border-rule rounded-lg p-4 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">{weeklyTasks[activeTask].label}</p>
                <p className="text-ink/50 text-sm">{weeklyTasks[activeTask].detail}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-accent mono">{weeklyTasks[activeTask].hours}h</p>
                <p className="text-ink/40 text-xs mono">
                  ${(weeklyTasks[activeTask].hours * hourlyRate).toFixed(0)}/wk
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary bar */}
      <div className="bg-ink text-paper rounded-lg p-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-accent text-3xl font-bold mono">{totalHours.toFixed(1)}</p>
            <p className="text-paper/50 text-xs mono mt-1">HOURS/WEEK</p>
          </div>
          <div>
            <p className="text-accent text-3xl font-bold mono">${weeklyCost}</p>
            <p className="text-paper/50 text-xs mono mt-1">COST/WEEK</p>
          </div>
          <div>
            <p className="text-accent text-3xl font-bold mono">${(weeklyCost * 4).toLocaleString()}</p>
            <p className="text-paper/50 text-xs mono mt-1">COST/MONTH</p>
          </div>
        </div>
      </div>

      {/* Reveal button */}
      {revealedTasks === 0 && (
        <div className="text-center mt-6">
          <button
            onClick={startReveal}
            className="bg-ink text-paper px-8 py-3 mono text-sm font-bold tracking-wider uppercase hover:bg-accent transition-all"
          >
            Reveal the Leak →
          </button>
        </div>
      )}
    </div>
  )
}
