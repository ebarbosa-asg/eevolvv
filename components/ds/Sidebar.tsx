'use client'

import React from 'react'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
}

export interface SidebarProps {
  items: SidebarItem[]
  collapsed?: boolean
  onToggle?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * Collapsible left navigation sidebar.
 *
 * @param items     - Nav items with icon, label, and optional href/onClick/active state.
 * @param collapsed - When true, renders icon-only (w-14). When false, full width (w-60).
 * @param onToggle  - Callback for the collapse/expand toggle button.
 * @param header    - Optional content rendered above the nav items.
 * @param footer    - Optional content rendered at the very bottom.
 */
export function Sidebar({
  items,
  collapsed = false,
  onToggle,
  header,
  footer,
}: SidebarProps) {
  return (
    <div
      className={`flex flex-col bg-ink text-paper h-full transition-all duration-200 ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Optional header slot */}
      {header && (
        <div className={`flex-shrink-0 ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
          {header}
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 flex flex-col py-2 overflow-y-auto overflow-x-hidden">
        {items.map((item) => {
          const activeClasses = 'bg-accent/20 text-accent'
          const inactiveClasses = 'text-paper/60 hover:text-paper hover:bg-paper/8'
          const itemClasses = `flex items-center gap-3 px-3 py-2.5 rounded-lg mx-2 text-sm font-medium transition-colors cursor-pointer ${
            item.active ? activeClasses : inactiveClasses
          }`

          const content = (
            <>
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </>
          )

          if (item.href) {
            return (
              <a key={item.id} href={item.href} className={itemClasses}>
                {content}
              </a>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className={itemClasses}
            >
              {content}
            </button>
          )
        })}

        {/* Collapse/expand toggle */}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center justify-center mx-2 mt-2 p-2 rounded-lg text-paper/40 hover:text-paper hover:bg-paper/8 transition-colors cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronIcon collapsed={collapsed} />
          </button>
        )}
      </nav>

      {/* Optional footer slot */}
      {footer && (
        <div className={`flex-shrink-0 border-t border-paper/8 ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`}>
          {footer}
        </div>
      )}
    </div>
  )
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
    >
      <path
        d="M10 12L6 8L10 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
