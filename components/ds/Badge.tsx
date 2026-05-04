import React from 'react'

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-ink/8 text-ink/60',
}

/**
 * Pill-shaped status badge with variant-based color coding.
 *
 * @param variant - Color scheme: 'success' | 'warning' | 'danger' | 'neutral'
 */
export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`mono inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
