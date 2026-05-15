'use client'

import { motion } from 'framer-motion'
import { CountingNumber } from '../ui/counting-number'

const stats = [
  { value: 2847, label: 'Total Hours Saved', suffix: ' hrs' },
  { value: 74320, label: 'Money Recovered', prefix: '$' },
  { value: 47, label: 'Businesses Automated', suffix: '' },
  { value: 94, label: 'Client Satisfaction', suffix: '%' },
]

const testimonials = [
  {
    quote: "We were spending 6 hours a week on appointment confirmations. eevolvv's AI handles it all now. Haven't missed an appointment in 3 months.",
    name: 'Dr. Sarah Chen',
    title: 'Lakewood Family Dental',
    location: 'Dallas, TX',
    savings: '$800/mo',
  },
  {
    quote: "I was skeptical. Then they showed me exactly what I was losing. Now I get 15 hours a week back. That's almost 2 full work days.",
    name: 'Michael Torres',
    title: 'Torres Law Group',
    location: 'Austin, TX',
    savings: '$3,200/mo',
  },
  {
    quote: "The diagnostic alone was worth it. They found things I didn't even know were problems. Implementation took 3 days.",
    name: 'Jennifer Walsh',
    title: 'Walsh Real Estate',
    location: 'Houston, TX',
    savings: '$1,800/mo',
  },
]

export function SocialProof() {
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
            Real results from real businesses
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We don't make claims. We show you data.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-center"
            >
              <p className="text-3xl md:text-4xl font-bold text-cyan-500 font-mono mb-2">
                {stat.prefix}
                <CountingNumber value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 flex flex-col"
              >
                <div className="flex-1">
                  <svg className="w-8 h-8 text-cyan-500/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{t.quote}"</p>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-gray-500 text-sm">{t.title}</p>
                      <p className="text-gray-600 text-xs">{t.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-500 font-bold font-mono">{t.savings}</p>
                      <p className="text-gray-600 text-xs">saved</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
