'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const chaosItems = [
  { icon: '📞', text: 'Appointment call #47', time: '9:02 AM' },
  { icon: '📧', text: 'Insurance verification needed', time: '9:15 AM' },
  { icon: '📋', text: 'New patient form (paper)', time: '9:32 AM' },
  { icon: '🔔', text: 'No-show: 2:00 PM slot', time: '9:45 AM' },
  { icon: '📞', text: 'Follow-up call #12', time: '10:01 AM' },
  { icon: '📧', text: 'Referral request', time: '10:18 AM' },
  { icon: '⚠️', text: 'Double-booked: 3:00 PM', time: '10:30 AM' },
  { icon: '📋', text: 'Insurance expired', time: '10:45 AM' },
]

const calmItems = [
  { icon: '✅', text: '47 appointments confirmed', time: 'Auto' },
  { icon: '✅', text: 'Insurance verified (all)', time: 'Auto' },
  { icon: '✅', text: 'Digital intake complete', time: 'Auto' },
  { icon: '✅', text: 'No-show filled automatically', time: 'Auto' },
  { icon: '✅', text: 'Follow-ups sent', time: 'Auto' },
  { icon: '✅', text: 'Referral processed', time: 'Auto' },
  { icon: '✅', text: 'Schedule optimized', time: 'Auto' },
  { icon: '✅', text: 'Coverage alerts sent', time: 'Auto' },
]

export function HeroSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <section className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-500 font-mono animate-pulse">Loading...</div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-500 rounded-sm flex items-center justify-center font-bold text-black">e</div>
          <span className="font-mono text-sm">eevolvv</span>
        </div>
        <a href="/contact" className="text-sm font-mono text-gray-400 hover:text-cyan-500 transition-colors">
          Get Started →
        </a>
      </div>

      <div className="container mx-auto px-6 pt-24 pb-16">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">We watch your business</span>
            <br />
            <span className="text-cyan-500">for 7 days.</span>
            <br />
            <span className="text-white">Then we automate</span>
            <br />
            <span className="text-red-500">everything wasting your time.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            No setup. No tech knowledge. Just tell us what you do all day,
            and we'll show you exactly what we can automate.
          </p>
        </motion.div>

        {/* Split Screen Animation */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Chaos Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-900/50 border border-red-900/50 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h3 className="text-red-500 font-mono text-sm">BEFORE: Your Office Now</h3>
            </div>
            <div className="space-y-3">
              {chaosItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3 bg-red-950/30 p-3 rounded border border-red-900/30"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{item.text}</p>
                    <p className="text-xs text-gray-500 font-mono">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-red-900/30">
              <div className="flex justify-between text-sm">
                <span className="text-red-400">Hours wasted today:</span>
                <span className="text-red-500 font-bold font-mono">6.2 hrs</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-red-400">Cost this month:</span>
                <span className="text-red-500 font-bold font-mono">$4,800</span>
              </div>
            </div>
          </motion.div>

          {/* Calm Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gray-900/50 border border-cyan-900/50 rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-cyan-500 rounded-full" />
              <h3 className="text-cyan-500 font-mono text-sm">AFTER: With eevolvv</h3>
            </div>
            <div className="space-y-3">
              {calmItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-3 bg-cyan-950/30 p-3 rounded border border-cyan-900/30"
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">{item.text}</p>
                    <p className="text-xs text-cyan-500 font-mono">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-cyan-900/30">
              <div className="flex justify-between text-sm">
                <span className="text-cyan-400">Hours saved today:</span>
                <span className="text-cyan-500 font-bold font-mono">5.8 hrs</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-cyan-400">Money recovered:</span>
                <span className="text-cyan-500 font-bold font-mono">$4,200/mo</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16"
        >
          <a
            href="/contact"
            className="inline-block bg-cyan-500 text-black px-10 py-5 rounded-lg font-bold text-xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            Start Free 7-Day Diagnostic →
          </a>
          <p className="text-gray-500 text-sm mt-4 font-mono">
            No credit card. No commitment. Just data.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
