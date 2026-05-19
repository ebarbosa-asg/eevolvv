'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const steps = [
  {
    number: '01',
    title: 'We Watch',
    subtitle: '7 days. Zero disruption.',
    description: 'We plug into your existing systems — email, phone, calendar, forms — and observe. No setup. No changes. We just watch and learn.',
    details: [
      'Connect to your email & calendar',
      'Monitor phone call patterns',
      'Track form submissions',
      'Map every repetitive task',
    ],
    visual: 'watch',
    color: 'cyan',
  },
  {
    number: '02',
    title: 'We Build',
    subtitle: 'Custom AI agents for your business.',
    description: 'Based on what we observed, we build custom AI agents — one for each task. Each agent handles one job, 24/7, without breaks or mistakes.',
    details: [
      'Appointment confirmation bot',
      'Insurance verification agent',
      'Patient intake automation',
      'Follow-up call system',
    ],
    visual: 'build',
    color: 'purple',
  },
  {
    number: '03',
    title: 'We Deploy',
    subtitle: 'Live in 72 hours.',
    description: 'We go live. Your team does less work. Your business runs smoother. And you get a dashboard showing exactly what we automated and how much time we saved.',
    details: [
      'Go live in 72 hours',
      'Real-time savings dashboard',
      '24/7 monitoring',
      'Instant support',
    ],
    visual: 'deploy',
    color: 'green',
  },
]

function WatchVisual() {
  return (
    <div className="relative h-48 flex items-center justify-center">
      {/* Central eye */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-full border-2 border-cyan-500 flex items-center justify-center"
      >
        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <span className="text-2xl">👁️</span>
        </div>
      </motion.div>
      
      {/* Orbiting data points */}
      {['📧', '📞', '📋', '📅'].map((icon, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
          className="absolute w-8 h-8"
          style={{
            transformOrigin: '96px 96px',
            left: '50%',
            top: '50%',
            marginLeft: '-16px',
            marginTop: '-16px',
          }}
        >
          <div
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm"
            style={{
              transform: `rotate(${-360}deg)`,
              position: 'absolute',
              left: `${60 * Math.cos((i * Math.PI) / 2)}px`,
              top: `${60 * Math.sin((i * Math.PI) / 2)}px`,
            }}
          >
            {icon}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function BuildVisual() {
  const agents = [
    { name: 'Appt Bot', status: 'active' },
    { name: 'Insurance', status: 'active' },
    { name: 'Intake', status: 'building' },
    { name: 'Follow-up', status: 'queued' },
  ]

  return (
    <div className="space-y-3 p-4">
      {agents.map((agent, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center gap-3 bg-gray-800/50 p-3 rounded"
        >
          <div
            className={`w-2 h-2 rounded-full ${
              agent.status === 'active'
                ? 'bg-green-500'
                : agent.status === 'building'
                ? 'bg-yellow-500 animate-pulse'
                : 'bg-gray-500'
            }`}
          />
          <span className="text-sm font-mono flex-1">{agent.name}</span>
          <span className="text-xs text-gray-500">{agent.status}</span>
        </motion.div>
      ))}
    </div>
  )
}

function DeployVisual() {
  return (
    <div className="space-y-4 p-4">
      {/* Before/After bars */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-red-400">BEFORE</span>
          <span className="text-gray-500">18 hrs/week</span>
        </div>
        <div className="h-4 bg-red-500/30 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="h-full bg-red-500"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-green-400">AFTER</span>
          <span className="text-gray-500">2 hrs/week</span>
        </div>
        <div className="h-4 bg-green-500/30 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '11%' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-green-500"
          />
        </div>
      </div>
      
      {/* Savings callout */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="bg-green-950/50 border border-green-500/30 rounded p-3 text-center"
      >
        <p className="text-green-400 text-sm">YOU SAVE</p>
        <p className="text-2xl font-bold text-green-500 font-mono">16 hrs/week</p>
      </motion.div>
    </div>
  )
}

export function SolutionSteps() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="bg-gradient-to-b from-black to-gray-950 text-white py-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            How it works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Three steps. Seven days. Free report first.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {/* Step Navigation */}
          <div className="flex justify-center gap-4 mb-12">
            {steps.map((step, i) => (
              <button
                key={i}
                onClick={() => setActiveStep(i)}
                className={`px-6 py-3 rounded-lg font-mono text-sm transition-all ${
                  activeStep === i
                    ? 'bg-cyan-500 text-black'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {step.number}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left: Text */}
            <div>
              <div className="text-cyan-500 font-mono text-sm mb-2">
                STEP {steps[activeStep].number}
              </div>
              <h3 className="text-3xl font-bold mb-2">{steps[activeStep].title}</h3>
              <p className="text-cyan-400 mb-4">{steps[activeStep].subtitle}</p>
              <p className="text-gray-400 mb-6">{steps[activeStep].description}</p>
              
              <ul className="space-y-3">
                {steps[activeStep].details.map((detail, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-cyan-500">✓</span>
                    <span className="text-gray-300">{detail}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Right: Visual */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              {activeStep === 0 && <WatchVisual />}
              {activeStep === 1 && <BuildVisual />}
              {activeStep === 2 && <DeployVisual />}
            </div>
          </motion.div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-16 rounded transition-all ${
                  i <= activeStep ? 'bg-cyan-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
