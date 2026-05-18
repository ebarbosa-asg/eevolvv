import { redirect } from 'next/navigation'

/**
 * /extract was a half-built "boil the ocean" page with no clear product or
 * price. Per the May 2026 conversion audit, redirect to /pricing — the page
 * that actually takes money — until/unless this becomes a real productized
 * offer.
 */
export default function ExtractRedirect() {
  redirect('/pricing')
}
