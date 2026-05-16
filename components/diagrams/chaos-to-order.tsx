'use client'

import { motion } from 'framer-motion'

/**
 * Small animated icon showing chaos → order transformation
 * Appears below the split-flap hero as a visual anchor
 */
export function ChaosToOrder() {
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Chaos side */}
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="text-accent/40"
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <circle cx="60" cy="25" r="3" fill="currentColor" />
        <circle cx="40" cy="50" r="3.5" fill="currentColor" />
        <circle cx="15" cy="60" r="3" fill="currentColor" />
        <circle cx="65" cy="55" r="4" fill="currentColor" />
        <line x1="20" y1="20" x2="40" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.3" />
        <line x1="60" y1="25" x2="65" y2="55" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </motion.svg>

      {/* Arrow */}
      <motion.svg
        width="40"
        height="20"
        viewBox="0 0 40 20"
        className="text-accent"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <line x1="0" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" />
        <polyline points="25,5 35,10 25,15" fill="none" stroke="currentColor" strokeWidth="2" />
      </motion.svg>

      {/* Order side */}
      <motion.svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        className="text-accent"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        <rect x="15" y="15" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="47" y="15" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="15" y="47" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="47" y="47" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <circle cx="56" cy="24" r="2" fill="currentColor" />
        <circle cx="24" cy="56" r="2" fill="currentColor" />
        <circle cx="56" cy="56" r="2" fill="currentColor" />
      </motion.svg>
    </div>
  )
}
