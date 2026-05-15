'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  maxValue: number
  color?: string
  label?: string
  delay?: number
}

export function ProgressBar({ 
  value, 
  maxValue, 
  color = 'bg-red-500', 
  label,
  delay = 0 
}: ProgressBarProps) {
  const percentage = (value / maxValue) * 100

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">{label}</span>
          <span className="text-white font-mono">{value}h</span>
        </div>
      )}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
