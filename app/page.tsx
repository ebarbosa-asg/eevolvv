'use client'

import './homepage-v3.css'
import SiteHeader from '@/components/sections/site-header'
import SiteFooter from '@/components/sections/site-footer'
import HeroV3 from '@/components/sections/hero-v3'
import CapabilityTriptych from '@/components/sections/capability-triptych'
import CTAV3 from '@/components/sections/cta-v3'

export default function Home() {
  return (
    <main style={{ background: 'var(--paper)', color: 'var(--ink)', overflowX: 'hidden' }}>
      <SiteHeader />
      <HeroV3 />
      <CapabilityTriptych />
      <CTAV3 />
      <SiteFooter />
    </main>
  )
}