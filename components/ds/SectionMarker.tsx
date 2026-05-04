import React from 'react'

export interface SectionMarkerProps {
  num: string
  label: string
  className?: string
}

/**
 * Renders the `§ {num} · {label}` section marker pattern used throughout eevolvv.
 *
 * @param num   - Section number, e.g. "01", "02"
 * @param label - Section label, e.g. "OVERVIEW", "CLIENTS"
 */
export function SectionMarker({ num, label, className = '' }: SectionMarkerProps) {
  return (
    <p
      className={`mono text-accent uppercase ${className}`}
      style={{ fontSize: '11px', letterSpacing: '0.2em' }}
    >
      § {num} · {label}
    </p>
  )
}
