import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const tier = url.searchParams.get("tier") || "core"

  const names = {
    seed: "Agent One ($499/mo)",
    core: "Agent Three ($999/mo)",
    evolve: "Agent Five ($1,999/mo)",
  }
  const name = names[tier as keyof typeof names] || "eevolvv"

  const key = process.env.STRIPE_SECRET_KEY
  if (key) {
    try {
      const { default: Stripe } = await import("stripe")
      const s = new Stripe(key)
      const priceId = process.env["STRIPE_PRICE_" + tier.toUpperCase()]
      if (priceId) {
        const session = await s.checkout.sessions.create({
          mode: "subscription",
          line_items: [{ price: priceId, quantity: 1 }],
          success_url: "https://eevolvv.com/onboard/success?id={CHECKOUT_SESSION_ID}",
          cancel_url: "https://eevolvv.com/pricing",
        })
        return NextResponse.redirect(session.url!, 303)
      }
    } catch {
      // no stripe
    }
  }

  const body = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'><title>eevolvv checkout</title></head>"
    + "<body style='font-family:sans-serif;text-align:center;padding:80px'>"
    + "<h1>" + name + "</h1>"
    + "<p>Email hello@eevolvv.com to get started.</p>"
    + "<a href='/pricing' style='color:#000'>Back to pricing</a>"
    + "</body></html>"

  return new Response(body, {
    headers: { "Content-Type": "text/html" },
  })
}
