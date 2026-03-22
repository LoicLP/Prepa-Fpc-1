import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { priceId, userId, userEmail } = await req.json()

    if (!priceId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 })
    }

    const isRecurring = priceId === process.env.STRIPE_PRICE_MONTHLY

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, plan: isRecurring ? 'monthly' : 'yearly' },
      success_url: `${req.headers.get('origin')}/dashboard?tab=abonnement&success=true`,
      cancel_url: `${req.headers.get('origin')}/dashboard?tab=abonnement&canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
