import React from 'react'

export type TerminalLineType = 'primary' | 'sub' | 'comment'

export interface TerminalLine {
  type?: TerminalLineType
  key?: string
  value: string
}

export interface TerminalBlockProps {
  lines: TerminalLine[]
  className?: string
}

/**
 * Renders a terminal log block with `→` and `↳` prefixed lines.
 * Matches the eevolvv terminal log style: dark-bordered mono block.
 *
 * @param lines     - Array of TerminalLine objects to render
 * @param className - Optional additional class names for the container
 */
export function TerminalBlock({ lines, className = '' }: TerminalBlockProps) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(20,20,19,0.055)',
        border: '1px solid var(--rule)',
        borderLeft: '3px solid var(--accent)',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: '13px',
        lineHeight: '1.9',
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
      }}
    >
      {lines.map((line, i) => {
        const type = line.type ?? 'primary'

        if (type === 'comment') {
          return (
            <div key={i} style={{ opacity: 0.3 }}>
              {`// ${line.value}`}
            </div>
          )
        }

        if (type === 'sub') {
          return (
            <div key={i} style={{ opacity: 0.6, paddingLeft: '1.25em' }}>
              {'↳ '}
              {line.value}
            </div>
          )
        }

        // primary
        return (
          <div key={i}>
            <span style={{ color: 'var(--accent)' }}>{'→ '}</span>
            {line.key && (
              <span style={{ fontWeight: 600 }}>{line.key}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            )}
            {line.value}
          </div>
        )
      })}
    </div>
  )
}
