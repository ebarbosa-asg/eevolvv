'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface CountingNumberProps {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}

export function CountingNumber({ 
  value, 
  duration = 2, 
  format = (n) => Math.round(n).toLocaleString(),
  className = ''
}: CountingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest)
      }
    })
    return unsubscribe
  }, [springValue, format])

  return <span ref={ref} className={className}>0</span>
}
