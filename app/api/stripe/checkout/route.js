import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { utilisateurConnecte } from '@/lib/acces'

// Seuls les deux prix de Prépa FPC sont acceptés, choisis ici côté serveur.
// Avant, le navigateur envoyait l'identifiant du prix : tout autre prix du compte Stripe (partagé avec
// d'autres sites) passait en « paiement annuel » et donnait un an d'accès.
function prixDuPlan(plan) {
  if (plan === 'monthly') return process.env.STRIPE_PRICE_MONTHLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
  if (plan === 'yearly') return process.env.STRIPE_PRICE_YEARLY || process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY
  return null
}

export async function POST(req) {
  try {
    // Identité tirée de la session vérifiée, jamais du corps de la requête
    const acces = await utilisateurConnecte(req)
    if (acces.erreur) return acces.erreur
    const userId = acces.user.id
    const userEmail = acces.user.email
    if (!userEmail) return NextResponse.json({ error: 'Adresse e-mail introuvable sur votre compte.' }, { status: 400 })

    const { plan } = await req.json()
    const priceId = prixDuPlan(plan)
    if (!priceId) return NextResponse.json({ error: 'Offre inconnue.' }, { status: 400 })
    const isRecurring = plan === 'monthly'

    // Adresse du site prise sur la requête elle-même, pas sur l'en-tête Origin (falsifiable par un appel direct)
    const site = new URL(req.url).origin

    // Client Stripe créé après les contrôles d'accès
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    // Créer ou récupérer un customer Stripe avec pays France pour la TVA
    const existingCustomers = await stripe.customers.list({ email: userEmail, limit: 1 })
    let customer
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
        address: { country: 'FR' }
      })
    }

    const sessionParams = {
      customer: customer.id,
      mode: isRecurring ? 'subscription' : 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId, plan: isRecurring ? 'monthly' : 'yearly' },
      automatic_tax: { enabled: true },
      // Les clients existants du compte partage n'ont pas toujours d'adresse :
      // on enregistre celle saisie dans Checkout (requis par automatic_tax)
      customer_update: { address: 'auto' },
      success_url: `${site}/dashboard?success=true`,
      cancel_url: `${site}/dashboard?tab=abonnement&canceled=true`,
    }

    // Transférer les metadata vers le payment_intent (annuel) ou la subscription (mensuel)
    if (isRecurring) {
      sessionParams.subscription_data = { metadata: { userId, plan: 'monthly' } }
    } else {
      sessionParams.payment_intent_data = { metadata: { userId, plan: 'yearly' } }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    // Message générique : le détail Stripe reste dans les logs
    return NextResponse.json({ error: 'Le paiement n\'a pas pu démarrer. Réessayez dans quelques instants.' }, { status: 500 })
  }
}
