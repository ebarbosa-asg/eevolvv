import React from 'react'
import { type BadgeProps, type BadgeVariant } from './Badge'

export interface StatusPillProps extends BadgeProps {}

const pillVariantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-ink/8 text-ink/60',
}

const dotClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  neutral: 'bg-ink/40',
}

/**
 * Status pill badge with a colored dot indicator prepended.
 *
 * @param variant - Color scheme: 'success' | 'warning' | 'danger' | 'neutral'
 */
export function StatusPill({ variant = 'neutral', children, className = '' }: StatusPillProps) {
  return (
    <span
      className={`mono inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${pillVariantClasses[variant]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0 ${dotClasses[variant]}`}
        aria-hidden="true"
      />
      {children}
    </span>
  )
}
