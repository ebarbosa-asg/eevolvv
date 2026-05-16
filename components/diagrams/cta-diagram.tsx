'use client'

import { motion } from 'framer-motion'

export function CTADiagram() {
  return (
    <div className="w-full max-w-3xl mx-auto text-center">
      {/* Visual: 7-day timeline */}
      <div className="mb-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <motion.div
              key={day}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: day * 0.08 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center">
                <span className="text-accent font-bold text-sm mono">{day}</span>
              </div>
              {day < 7 && (
                <div className="absolute top-1/2 left-full w-2 h-px bg-accent/30" />
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-ink/50 text-sm">7 days. That&apos;s all it takes.</p>
      </div>

      {/* Offer card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-paper border border-rule rounded-lg p-8 mb-8"
      >
        <div className="grid grid-cols-3 gap-6 mb-6">
          {[
            { icon: '👁️', label: 'We Watch', desc: 'Observe your workflows' },
            { icon: '📊', label: 'We Analyze', desc: 'Find every inefficiency' },
            { icon: '🤖', label: 'We Build', desc: 'Your automation blueprint' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="font-bold text-sm">{item.label}</p>
              <p className="text-ink/40 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-rule pt-6">
          <p className="text-accent font-bold text-lg mono mb-1">100% MONEY-BACK GUARANTEE</p>
          <p className="text-ink/50 text-sm">If we don&apos;t save you at least $2,000/month, you pay nothing.</p>
        </div>
      </motion.div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 items-center">
        <button className="w-full max-w-sm bg-ink text-paper px-8 py-4 mono text-sm font-bold tracking-[0.2em] uppercase hover:bg-accent transition-all">
          Start Free Diagnostic →
        </button>
        <p className="text-ink/30 text-xs mono">No credit card · Takes 2 minutes</p>
      </div>
    </div>
  )
}
