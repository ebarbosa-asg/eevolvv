import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

/**
 * Called by T06. Implemented fully in T06.
 * Stub here to allow T04 webhook router to compile.
 */
export async function createClientRecord(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log('[webhook-handlers] createClientRecord stub — implement in T06', session.id)
}

/**
 * Handle checkout.session.completed
 * Full implementation added by T06.
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  await createClientRecord(session)
}

/**
 * Handle invoice.payment_succeeded
 * Updates subscription status to active.
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
): Promise<void> {
  if (!supabase) return
  // Access subscription ID from invoice metadata or parent (Stripe API 2026+)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawInvoice = invoice as Record<string, any>
  const subscriptionId: string | undefined =
    rawInvoice.subscription_id ??
    (typeof rawInvoice.subscription === 'string' ? rawInvoice.subscription : rawInvoice.subscription?.id)
  if (!subscriptionId) return
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('stripe_subscription_id', subscriptionId)
  if (error) console.error('[webhook-handlers] payment_succeeded update error:', error.message)
}

/**
 * Handle invoice.payment_failed
 * Full dunning implementation added by T18.
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  console.log('[webhook-handlers] handleInvoicePaymentFailed stub — implement in T18', invoice.id)
}

/**
 * Handle customer.subscription.updated
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  if (!supabase) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSub = subscription as Record<string, any>
  // current_period_end may be unix timestamp (number) or ISO string depending on API version
  const periodEnd = rawSub.current_period_end
  const periodEndIso = typeof periodEnd === 'number'
    ? new Date(periodEnd * 1000).toISOString()
    : typeof periodEnd === 'string' ? periodEnd : null
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      ...(periodEndIso ? { current_period_end: periodEndIso } : {}),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id)
  if (error) console.error('[webhook-handlers] subscription_updated error:', error.message)
}

/**
 * Handle customer.subscription.deleted
 * Full implementation added by T18.
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('[webhook-handlers] handleSubscriptionDeleted stub — implement in T18', subscription.id)
}
