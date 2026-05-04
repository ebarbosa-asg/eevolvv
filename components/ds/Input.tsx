import React from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

/**
 * Styled text input using design system tokens.
 *
 * @param error - When true, applies red error border and ring.
 */
export function Input({ error = false, className = '', ...props }: InputProps) {
  const baseClasses =
    'w-full bg-paper border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink/40 transition-colors focus:outline-none focus:ring-1'

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-rule focus:border-accent focus:ring-accent'

  return (
    <input
      className={`${baseClasses} ${stateClasses} ${className}`}
      style={
        !error
          ? ({ '--tw-ring-color': 'var(--accent)' } as React.CSSProperties)
          : undefined
      }
      {...props}
    />
  )
}
