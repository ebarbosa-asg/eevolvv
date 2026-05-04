import React from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

/**
 * Styled textarea using design system tokens. Vertically resizable.
 *
 * @param error - When true, applies red error border and ring.
 */
export function Textarea({ error = false, className = '', ...props }: TextareaProps) {
  const baseClasses =
    'w-full bg-paper border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink/40 transition-colors focus:outline-none focus:ring-1 resize-y min-h-[80px]'

  const stateClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-rule focus:border-accent focus:ring-accent'

  return (
    <textarea
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
