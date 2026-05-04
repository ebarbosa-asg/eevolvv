import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
}

export interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export interface CardContentProps {
  children: React.ReactNode
  className?: string
}

/**
 * Container card with border, shadow, and rounded corners.
 */
export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white border border-rule rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  )
}

/**
 * Header section of a Card — padded with bottom border.
 */
export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-5 py-4 border-b border-rule ${className}`}>
      {children}
    </div>
  )
}

/**
 * Content section of a Card — padded body area.
 */
export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  )
}
