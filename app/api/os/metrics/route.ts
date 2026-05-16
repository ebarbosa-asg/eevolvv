import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Calculate MRR from Stripe
  let mrr = 0
  let clientCount = 0
  
  if (stripe) {
    try {
      const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 100 })
      clientCount = subscriptions.data.length
      mrr = subscriptions.data.reduce((sum, sub) => {
        const amount = sub.items.data[0]?.price?.unit_amount || 0
        const interval = sub.items.data[0]?.price?.recurring?.interval
        if (interval === 'year') return sum + (amount / 12) / 100
        return sum + amount / 100
      }, 0)
    } catch (err) {
      console.error('[metrics] Stripe error:', err)
    }
  }

  // Get lead funnel from Supabase
  const leadFunnel = { cold: 0, contacted: 0, nurtured: 0, qualified: 0, closed: 0 }
  
  if (supabase) {
    try {
      const { data: clients } = await supabase
        .from('clients')
        .select('stage')
        .in('stage', ['cold', 'contacted', 'nurtured', 'qualified', 'closed'])
      
      if (clients) {
        clients.forEach((c) => {
          const stage = c.stage as keyof typeof leadFunnel
          if (stage in leadFunnel) leadFunnel[stage]++
        })
      }
    } catch (err) {
      console.error('[metrics] Supabase error:', err)
    }
  }

  // Get top clients by revenue
  const topClients: Array<{ id: string; business_name: string; email: string; mrr: number }> = []
  
  if (stripe && supabase) {
    try {
      const subscriptions = await stripe.subscriptions.list({ status: 'active', limit: 10 })
      for (const sub of subscriptions.data) {
        const email = sub.customer && typeof sub.customer === 'object' ? sub.customer.email : null
        if (!email) continue
        
        const amount = sub.items.data[0]?.price?.unit_amount || 0
        const interval = sub.items.data[0]?.price?.recurring?.interval
        const monthlyAmount = interval === 'year' ? (amount / 12) / 100 : amount / 100
        
        const { data: client } = await supabase
          .from('clients')
          .select('id, business_name, email')
          .eq('email', email)
          .maybeSingle()
        
        if (client) {
          topClients.push({
            id: client.id,
            business_name: client.business_name || 'Untitled',
            email: client.email,
            mrr: Math.round(monthlyAmount),
          })
        }
      }
    } catch (err) {
      console.error('[metrics] Top clients error:', err)
    }
  }

  return NextResponse.json({
    mrr: Math.round(mrr),
    clientCount,
    leadFunnel,
    topClients: topClients.sort((a, b) => b.mrr - a.mrr),
  })
}
