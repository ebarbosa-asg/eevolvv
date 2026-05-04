import React from 'react'

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

/**
 * Form field label in JetBrains Mono, uppercase, muted ink.
 */
export function Label({ children, className = '', ...props }: LabelProps) {
  return (
    <label
      className={`mono block text-[11px] font-medium uppercase tracking-[0.12em] text-ink/60 mb-1 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}
