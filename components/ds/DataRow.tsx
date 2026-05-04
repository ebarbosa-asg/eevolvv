import React from 'react'

export interface DataRowProps {
  label: string
  value: React.ReactNode
  className?: string
}

/**
 * Renders a horizontal label + value pair for metadata, status displays, and key-value lists.
 *
 * @param label - Short uppercase descriptor on the left
 * @param value - Content on the right — accepts strings or React nodes (e.g. Badge)
 */
export function DataRow({ label, value, className = '' }: DataRowProps) {
  return (
    <div
      className={`flex items-baseline justify-between py-2 border-b border-rule last:border-0 ${className}`}
    >
      <span className="mono text-[11px] uppercase tracking-[0.12em] text-ink/50 flex-shrink-0 mr-4">
        {label}
      </span>
      <span className="text-sm text-ink font-medium text-right">{value}</span>
    </div>
  )
}
