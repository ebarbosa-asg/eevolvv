'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface AgentPipelineProps {
  onComplete?: () => void
}

const stages = [
  {
    id: 'watch',
    step: '01',
    title: 'We Watch',
    subtitle: '7 days. Zero disruption.',
    icon: 'eye' as const,
    color: '#2E5BFF',
    inputs: ['Email', 'Phone', 'Calendar', 'Forms'],
    outputs: ['47 tasks found', '12 workflows mapped', '89% automatable'],
    detail: 'We plug into your existing systems and observe. No setup, no changes. We just watch and learn where time leaks.',
  },
  {
    id: 'build',
    step: '02',
    title: 'We Build',
    subtitle: 'Custom AI agents.',
    icon: 'gear' as const,
    color: '#E6A820',
    inputs: ['47 tasks', '12 workflows'],
    outputs: ['12 agents created', '24/7 operation', 'Zero errors'],
    detail: 'Based on what we observed, we build custom AI agents — one for each task. Each agent handles one job, without breaks or mistakes.',
  },
  {
    id: 'deploy',
    step: '03',
    title: 'We Deploy',
    subtitle: 'Live in 72 hours.',
    icon: 'rocket' as const,
    color: '#3CB97A',
    inputs: ['12 agents', 'Your systems'],
    outputs: ['16 hrs/wk saved', '$2,500/mo recovered', 'Real-time dashboard'],
    detail: 'We go live. Your team does less work. Your business runs smoother. You get a dashboard showing exactly what we automated.',
  },
]

function EyeIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.svg width="48" height="48" viewBox="0 0 48 48" animate={{ scale: active ? 1.1 : 1 }}>
      <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="24" cy="24" r="8" fill={color} opacity="0.3" />
      <circle cx="24" cy="24" r="4" fill={color} />
      {active && (
        <motion.circle
          cx="24" cy="24" r="12"
          fill="none" stroke={color} strokeWidth="1"
          initial={{ opacity: 0.5, r: 8 }}
          animate={{ opacity: 0, r: 20 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.svg>
  )
}

function GearIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      animate={{ rotate: active ? 360 : 0 }}
      transition={{ duration: 4, repeat: active ? Infinity : 0, ease: 'linear' }}
    >
      <circle cx="24" cy="24" r="8" fill={color} opacity="0.3" />
      <circle cx="24" cy="24" r="4" fill={color} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="22"
          y="4"
          width="4"
          height="12"
          rx="2"
          fill={color}
          transform={`rotate(${angle} 24 24)`}
        />
      ))}
    </motion.svg>
  )
}

function RocketIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      animate={{ y: active ? [-2, 2, -2] : 0 }}
      transition={{ duration: 1, repeat: active ? Infinity : 0 }}
    >
      <path
        d="M24 4 L32 20 L28 20 L28 36 L20 36 L20 20 L16 20 Z"
        fill={color}
        opacity="0.8"
      />
      <circle cx="24" cy="14" r="3" fill="white" opacity="0.5" />
      <motion.path
        d="M20 36 L18 42 L24 38 L30 42 L28 36"
        fill={color}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: active ? [0.5, 1, 0.5] : 0.5 }}
        transition={{ duration: 0.5, repeat: active ? Infinity : 0 }}
      />
    </motion.svg>
  )
}

function StageIcon({ icon, color, active }: { icon: 'eye' | 'gear' | 'rocket'; color: string; active: boolean }) {
  switch (icon) {
    case 'eye': return <EyeIcon color={color} active={active} />
    case 'gear': return <GearIcon color={color} active={active} />
    case 'rocket': return <RocketIcon color={color} active={active} />
  }
}

export function AgentPipeline({ onComplete }: AgentPipelineProps) {
  const [activeStage, setActiveStage] = useState<number | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)

  const startAutoPlay = () => {
    if (autoPlay) return
    setAutoPlay(true)
    setActiveStage(0)
    setTimeout(() => setActiveStage(1), 2000)
    setTimeout(() => setActiveStage(2), 4000)
    setTimeout(() => {
      setActiveStage(null)
      setAutoPlay(false)
      onComplete?.()
    }, 6500)
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="mono text-accent text-sm mb-2">HOW IT WORKS</p>
        <h2 className="text-3xl md:text-4xl font-bold">
          We watch. We build. We deploy.
        </h2>
        <p className="text-ink/50 mt-2">Three stages. Seven days. Free report first.</p>
      </div>

      {/* Pipeline */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-rule hidden md:block" />

        <div className="grid md:grid-cols-3 gap-6">
          {stages.map((stage, i) => {
            const isActive = activeStage === i
            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onClick={() => !autoPlay && setActiveStage(isActive ? null : i)}
                className={`relative bg-paper border rounded-lg p-6 cursor-pointer transition-all ${
                  isActive ? 'border-accent shadow-lg' : 'border-rule hover:border-ink/20'
                }`}
              >
                {/* Step number */}
                <div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mono"
                  style={{ backgroundColor: stage.color, color: 'white' }}
                >
                  {stage.step}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <StageIcon icon={stage.icon} color={stage.color} active={isActive} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-center mb-1">{stage.title}</h3>
                <p className="text-sm text-center mb-4" style={{ color: stage.color }}>{stage.subtitle}</p>

                {/* Expanded content */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      {/* Inputs */}
                      <div className="mb-3">
                        <p className="text-[10px] mono text-ink/40 uppercase mb-1">Inputs</p>
                        <div className="flex flex-wrap gap-1">
                          {stage.inputs.map((input) => (
                            <span
                              key={input}
                              className="px-2 py-0.5 rounded text-[10px] mono"
                              style={{ backgroundColor: stage.color + '15', color: stage.color }}
                            >
                              {input}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center my-2">
                        <svg width="20" height="20" viewBox="0 0 20 20">
                          <line x1="10" y1="0" x2="10" y2="15" stroke={stage.color} strokeWidth="2" />
                          <polyline points="5,10 10,18 15,10" fill="none" stroke={stage.color} strokeWidth="2" />
                        </svg>
                      </div>

                      {/* Outputs */}
                      <div className="mb-3">
                        <p className="text-[10px] mono text-ink/40 uppercase mb-1">Outputs</p>
                        <div className="flex flex-wrap gap-1">
                          {stage.outputs.map((output) => (
                            <span
                              key={output}
                              className="px-2 py-0.5 rounded text-[10px] mono font-bold"
                              style={{ backgroundColor: stage.color + '25', color: stage.color }}
                            >
                              {output}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Detail */}
                      <p className="text-sm text-ink/60 leading-relaxed">{stage.detail}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Collapsed hint */}
                {!isActive && (
                  <p className="text-[10px] mono text-ink/30 text-center mt-2">Click to expand</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Auto-play button */}
      {!autoPlay && (
        <div className="text-center mt-8">
          <button
            onClick={startAutoPlay}
            className="bg-ink text-paper px-8 py-3 mono text-sm font-bold tracking-wider uppercase hover:bg-accent transition-all"
          >
            Play Pipeline →
          </button>
        </div>
      )}
    </div>
  )
}
