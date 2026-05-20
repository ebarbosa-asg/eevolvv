import type { CSSProperties } from 'react'

type IconProps = { size?: number; style?: CSSProperties; className?: string }

function Icon({ size = 16, style, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={style}
      className={className}
    >
      {children}
    </svg>
  )
}

export function TargetIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </Icon>
  )
}

export function ChartIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="1.5" y="9.5" width="3" height="5" fill="currentColor" opacity="0.6" />
      <rect x="6.5" y="5.5" width="3" height="9" fill="currentColor" />
      <rect x="11.5" y="2.5" width="3" height="12" fill="currentColor" opacity="0.6" />
    </Icon>
  )
}

export function GlobeIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="8" cy="8" rx="2.8" ry="6.5" stroke="currentColor" strokeWidth="1" />
      <line x1="1.5" y1="5.5" x2="14.5" y2="5.5" stroke="currentColor" strokeWidth="1" />
      <line x1="1.5" y1="10.5" x2="14.5" y2="10.5" stroke="currentColor" strokeWidth="1" />
    </Icon>
  )
}

export function GearIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.5 3.5l1.3 1.3M11.2 11.2l1.3 1.3M12.5 3.5l-1.3 1.3M4.8 11.2l-1.3 1.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function ClipboardIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="3.5" y="2.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 2.5V4h4V2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5.5" y1="6.5" x2="10.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5.5" y1="8.8" x2="10.5" y2="8.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5.5" y1="11" x2="8.5" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Icon>
  )
}

export function ClockIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function BoxIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M2 5.5L8 2.5L14 5.5V10.5L8 13.5L2 10.5V5.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 2.5V13.5M2 5.5L8 8.5L14 5.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </Icon>
  )
}

export function ChatIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M2 2.5h12v8.5H8.5L6 13.5V11H2V2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="5" y1="8.5" x2="9" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </Icon>
  )
}

export function PhoneIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path
        d="M3.5 2.5h3l1.5 3.5-2 1.5c.7 1.8 2 3.1 3.8 3.8l1.5-2 3.5 1.5v3c0 .8-.7 1.5-1.5 1.5C5 15 1 11 1 4 1 3.2 1.7 2.5 2.5 2.5H3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function MailIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="1.5" y="3.5" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 4.5L8 9L14.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function BoltIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M9.5 1.5L3 9H8L6.5 14.5L13 7H8L9.5 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
    </Icon>
  )
}

export function CalendarIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="1.5" y="2.5" width="13" height="12" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="5" y1="1" x2="5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="1" x2="11" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="9" width="2" height="2" rx="0.3" fill="currentColor" />
      <rect x="7" y="9" width="2" height="2" rx="0.3" fill="currentColor" opacity="0.5" />
      <rect x="10" y="9" width="2" height="2" rx="0.3" fill="currentColor" opacity="0.5" />
    </Icon>
  )
}

export function MonitorIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="1.5" y="1.5" width="13" height="9.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 14.5H10.5M8 11V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function PlusIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </Icon>
  )
}

export function CheckIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M2.5 8.5L6 12L13.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function ArrowRightIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M2 8H14M9 3.5L14 8L9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function ChevronDownIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function ChevronUpIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3 10L8 5L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}

export function UserIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 14.5C1.5 11.5 4.5 9 8 9C11.5 9 14.5 11.5 14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </Icon>
  )
}

export function RefreshIcon(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M13.5 6.5A6 6 0 1 0 14 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 5V7.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  )
}
