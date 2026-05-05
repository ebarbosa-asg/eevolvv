import { GhostGate } from './GhostGate'

export const metadata = {
  title: 'Ghost Locker · eevolvv Internal',
  robots: { index: false, follow: false },
}

export default function GhostLayout({ children }: { children: React.ReactNode }) {
  return <GhostGate>{children}</GhostGate>
}
