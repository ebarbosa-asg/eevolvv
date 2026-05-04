import React from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-gradient rounded-lg px-5 py-2.5 text-sm font-medium',
  secondary:
    'bg-paper text-ink border border-rule rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors',
  ghost: 'bg-transparent text-accent px-5 py-2.5 text-sm font-medium hover:underline',
  danger:
    'bg-red-600 text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-red-700 transition-colors',
}

const sizeOverrides: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: '',
  lg: 'px-6 py-3 text-base',
}

/**
 * Primary interactive button component.
 *
 * @param variant - Visual style: 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param size    - Size override: 'sm' | 'md' | 'lg'
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = variantClasses[variant]
  const sizeClass = sizeOverrides[size]
  const combined = [base, sizeClass, className].filter(Boolean).join(' ')

  return (
    <button className={combined} {...props}>
      {children}
    </button>
  )
}
