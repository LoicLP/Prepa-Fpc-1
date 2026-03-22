import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      // Paiement unique (annuel) ou premier paiement abonnement
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata.userId
        const plan = session.metadata.plan

        if (plan === 'yearly') {
          // Paiement unique — premium pour 1 an
          const expiresAt = new Date()
          expiresAt.setFullYear(expiresAt.getFullYear() + 1)

          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            plan: 'yearly',
            status: 'active',
            current_period_end: expiresAt.toISOString(),
          }, { onConflict: 'user_id' })
        }

        if (plan === 'monthly' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          await supabaseAdmin.from('subscriptions').upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan: 'monthly',
            status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, { onConflict: 'user_id' })
        }
        break
      }

      // Renouvellement mensuel réussi
      case 'invoice.paid': {
        const invoice = event.data.object
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
          await supabaseAdmin.from('subscriptions').update({
            status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }).eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }

      // Annulation abonnement mensuel
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        await supabaseAdmin.from('subscriptions').update({
          status: 'canceled',
        }).eq('stripe_subscription_id', subscription.id)
        break
      }

      // Paiement échoué
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        if (invoice.subscription) {
          await supabaseAdmin.from('subscriptions').update({
            status: 'past_due',
          }).eq('stripe_subscription_id', invoice.subscription)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
