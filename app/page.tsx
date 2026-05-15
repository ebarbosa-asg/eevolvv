'use client'

import { HeroSection } from '@/components/sections/hero-section'
import { PainCalendar } from '@/components/sections/pain-calendar'
import { SolutionSteps } from '@/components/sections/solution-steps'
import { IndustrySelector } from '@/components/sections/industry-selector'
import { SocialProof } from '@/components/sections/social-proof'
import { ROICalculator } from '@/components/sections/roi-calculator'
import { FinalCTA } from '@/components/sections/final-cta'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <HeroSection />
      <PainCalendar />
      <div id="how-it-works">
        <SolutionSteps />
      </div>
      <div id="industries">
        <IndustrySelector />
      </div>
      <SocialProof />
      <div id="pricing">
        <ROICalculator />
      </div>
      <FinalCTA />
      <Footer />
    </main>
  )
}
