'use client'

import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

const hourlyRate = 40
const weeksPerMonth = 4.33

export function ROICalculator() {
  const [hours, setHours] = useState(20)
  const [agents, setAgents] = useState(3)

  const calculations = useMemo(() => {
    const weeklyCost = hours * hourlyRate
    const monthlyCost = weeklyCost * weeksPerMonth
    const eevolvvCost = 500 + agents * 50
    const monthlySavings = monthlyCost - eevolvvCost
    const roi = ((monthlySavings / eevolvvCost) * 100).toFixed(0)
    const hoursRecovered = Math.round(hours * 0.85) // 85% automation rate

    return {
      weeklyCost: Math.round(weeklyCost),
      monthlyCost: Math.round(monthlyCost),
      eevolvvCost,
      monthlySavings: Math.round(monthlySavings),
      roi,
      hoursRecovered,
    }
  }, [hours, agents])

  return (
    <section className="bg-gradient-to-b from-gray-950 to-black text-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Pay for what we save you
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Adjust the sliders to match your business. See your exact ROI.
          </p>
        </motion.div>

        {/* Calculator */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            {/* Sliders */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Hours Slider */}
              <div>
                <label className="block text-gray-400 mb-4">
                  How many hours/week do you spend on repetitive admin work?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-2xl font-bold text-cyan-500 font-mono w-20 text-right">
                    {hours}h
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>5 hrs</span>
                  <span>40 hrs</span>
                </div>
              </div>

              {/* Agents Slider */}
              <div>
                <label className="block text-gray-400 mb-4">
                  How many different tasks could be automated?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={agents}
                    onChange={(e) => setAgents(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-2xl font-bold text-cyan-500 font-mono w-20 text-right">
                    {agents}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>1 task</span>
                  <span>10 tasks</span>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-gray-800">
              {/* Your Cost */}
              <div>
                <h3 className="text-red-400 font-mono text-sm mb-4">YOUR COST TODAY</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hours wasted/week</span>
                    <span className="text-white font-mono">{hours} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost @ ${hourlyRate}/hr</span>
                    <span className="text-white font-mono">${calculations.weeklyCost}/wk</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                    <span className="text-red-400">Monthly waste</span>
                    <span className="text-red-500 font-bold font-mono">
                      ${calculations.monthlyCost.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>

              {/* eevolvv Cost */}
              <div>
                <h3 className="text-cyan-400 font-mono text-sm mb-4">EEVOLVV COST</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base platform</span>
                    <span className="text-white font-mono">$500/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">AI agents ({agents} × $50)</span>
                    <span className="text-white font-mono">${agents * 50}/mo</span>
                  </div>
                  <div className="flex justify-between text-lg pt-2 border-t border-gray-800">
                    <span className="text-cyan-400">Total</span>
                    <span className="text-cyan-500 font-bold font-mono">
                      ${calculations.eevolvvCost}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Savings Highlight */}
            <motion.div
              key={calculations.monthlySavings}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="mt-8 bg-gradient-to-r from-green-950/50 to-cyan-950/50 border border-green-900/50 rounded-lg p-6"
            >
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-green-400 text-sm mb-1">YOU SAVE</p>
                  <p className="text-3xl font-bold text-green-500 font-mono">
                    ${calculations.monthlySavings.toLocaleString()}/mo
                  </p>
                </div>
                <div>
                  <p className="text-green-400 text-sm mb-1">HOURS RECOVERED</p>
                  <p className="text-3xl font-bold text-green-500 font-mono">
                    {calculations.hoursRecovered}h/wk
                  </p>
                </div>
                <div>
                  <p className="text-green-400 text-sm mb-1">ROI</p>
                  <p className="text-3xl font-bold text-green-500 font-mono">
                    {calculations.roi}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/contact"
              className="inline-block bg-cyan-500 text-black px-10 py-5 rounded-lg font-bold text-xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              Start Free Diagnostic →
            </a>
            <p className="text-gray-500 text-sm mt-4">
              No credit card. No commitment. See your exact savings first.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
