import React from 'react'

export interface KPIStatProps {
  value: string | number
  label: string
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

/**
 * Renders a large display number with a small mono label — the standard KPI metric display.
 *
 * @param value  - The metric value to display
 * @param label  - Short uppercase descriptor shown below the value
 * @param trend  - Optional trend indicator: 'up' (green ↑), 'down' (red ↓), or 'neutral'
 */
export function KPIStat({ value, label, trend, className = '' }: KPIStatProps) {
  const trendIcon =
    trend === 'up' ? (
      <span className="text-green-600 mr-1">↑</span>
    ) : trend === 'down' ? (
      <span className="text-red-500 mr-1">↓</span>
    ) : null

  return (
    <div className={className}>
      <div className="text-4xl font-semibold text-ink tracking-tight">{value}</div>
      <div className="mono text-[11px] uppercase tracking-[0.15em] text-ink/50 mt-1">
        {trendIcon}
        {label}
      </div>
    </div>
  )
}
