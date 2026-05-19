'use client'

import { motion } from 'framer-motion'

export function FinalCTA() {
  return (
    <section className="bg-black text-white py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Main CTA Box */}
          <div className="bg-gradient-to-b from-gray-900/80 to-gray-950/80 border border-cyan-900/50 rounded-2xl p-12 text-center relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />
            
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <span className="text-4xl">🎁</span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                7-Day Diagnostic.{' '}
                <span className="text-cyan-500">Zero Risk.</span>
              </h2>

              <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
                We'll watch your business for free. If we can't save you at least{' '}
                <span className="text-cyan-500 font-bold">$2,000/month</span>,{' '}
                you pay nothing.
              </p>

              {/* What's included */}
              <div className="grid md:grid-cols-3 gap-4 mb-10 text-left">
                {[
                  { icon: '👁️', title: 'We Watch', desc: '7 days of observation' },
                  { icon: '📊', title: 'We Analyze', desc: 'Custom efficiency report' },
                  { icon: '🤖', title: 'We Build', desc: 'Your automation blueprint' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-gray-800/50 rounded-lg p-4"
                  >
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Free-first proof */}
              <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-4 mb-8">
                <p className="text-green-400 font-bold mb-1">Free report first</p>
                <p className="text-gray-400 text-sm">
                  Get the ghost-work scan and roadmap preview before you pick a paid build.
                </p>
              </div>

              {/* CTA Button */}
              <a
                href="/contact"
                className="inline-block bg-cyan-500 text-black px-12 py-6 rounded-lg font-bold text-xl hover:bg-cyan-400 transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
              >
                Get My Free Diagnostic →
              </a>

              <p className="text-gray-600 text-sm mt-6 font-mono">
                No credit card required • Takes 2 minutes to start
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-12 text-gray-500 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>No long-term contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>24/7 support included</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>SOC 2 compliant</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
