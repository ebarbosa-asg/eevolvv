import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'AI Automation for Gyms & Fitness Studios — eevolvv',
  description: 'CrossFit boxes, BJJ academies, and fitness studios recover 15–25 hrs/week and cut member churn 25–35% with eevolvv AI automation. Free audit in 10 minutes.',
  keywords: 'gym automation, fitness studio AI, crossfit automation, BJJ gym software, member retention automation, gym management AI, fitness business automation',
  openGraph: {
    title: 'Stop Running Your Gym on Ghost Work — eevolvv',
    description: 'Free AI diagnostic reveals exactly where your fitness studio is losing hours and members. CrossFit, BJJ, MMA, yoga — built for all of them.',
    url: 'https://eevolvv.com/fitness',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/fitness',
  },
}

export default function FitnessPage() {
  return <VerticalPage data={{...VERTICALS['fitness']}} />
}
