import type { Metadata } from 'next'
import { VERTICALS } from '@/lib/vertical-data'
import VerticalPage from '@/components/VerticalPage'

export const metadata: Metadata = {
  title: 'Website and Automation for Small Business — eevolvv',
  description: 'Small business website plus AI automation: conversion-ready site, form routing, follow-up, review requests.',
  openGraph: {
    title: 'Website and Automation for Small Business — eevolvv',
    description: 'Small business website plus AI automation: conversion-ready site, form routing, follow-up, review requests.',
    url: 'https://eevolvv.com/website-and-automation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://eevolvv.com/website-and-automation',
  },
}

export default function WebsiteAndAutomationPage() {
  return <VerticalPage data={{...VERTICALS['website-and-automation']}} />
}
