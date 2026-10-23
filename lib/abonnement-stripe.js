// lib/abonnement-stripe.js — accès Premium vu depuis Stripe (source de vérité), côté serveur uniquement.
// Sert à refuser un deuxième paiement quand un abonnement court déjà, même si la table subscriptions de
// Supabase est en retard sur Stripe (renouvellement mensuel non enregistré par le webhook, par exemple).
// Compte Stripe partagé avec d'autres sites : on ne retient que les objets créés par le paiement
// Prépa FPC (metadata.userId = l'utilisateur, sans metadata.site).
const STATUTS_ACTIFS = ['active', 'trialing', 'past_due']

// Fin de la période payée d'un abonnement : portée par ses lignes depuis l'API Stripe 2025-03-31,
// à la racine de l'objet avant
export function finDePeriode(abonnement) {
  const secondes = abonnement.items?.data?.[0]?.current_period_end ?? abonnement.current_period_end
  return secondes ? new Date(secondes * 1000) : null
}

// Abonnement d'une facture : invoice.subscription avant l'API 2025-03-31, invoice.parent.subscription_details après
export function idAbonnementFacture(facture) {
  const s = facture.subscription ?? facture.parent?.subscription_details?.subscription
  return typeof s === 'string' ? s : s?.id || null
}

// Renvoie l'accès Premium en cours ({ plan, stripe_customer_id, stripe_subscription_id, fin }) ou null.
// exclure : identifiant d'abonnement à ignorer (celui qui vient d'être résilié).
export async function accesPremiumStripe(stripe, { userId, email = null, exclure = null }) {
  const estANous = (o) => o.metadata?.userId === userId && !o.metadata?.site

  // Mensuel : abonnements des clients Stripe à cette adresse (lecture immédiate), complétés par une
  // recherche sur la métadonnée (tous clients confondus, mais indexée avec un léger décalage)
  const trouves = new Map()
  if (email) {
    const clients = await stripe.customers.list({ email, limit: 10 })
    for (const client of clients.data) {
      const abonnements = await stripe.subscriptions.list({ customer: client.id, status: 'all', limit: 20 })
      for (const s of abonnements.data) trouves.set(s.id, s)
    }
  }
  try {
    const res = await stripe.subscriptions.search({ query: `metadata['userId']:'${userId}'`, limit: 20 })
    for (const s of res.data) if (!trouves.has(s.id)) trouves.set(s.id, s)
  } catch (err) {
    console.error('Recherche Stripe des abonnements indisponible :', err.message)
  }
  const abonnement = [...trouves.values()].find(s => s.id !== exclure && estANous(s) && STATUTS_ACTIFS.includes(s.status))
  if (abonnement) {
    let fin = finDePeriode(abonnement)
    if (!fin) { fin = new Date(); fin.setMonth(fin.getMonth() + 1) }
    return { plan: 'monthly', stripe_customer_id: abonnement.customer, stripe_subscription_id: abonnement.id, fin }
  }

  // Annuel : paiement unique qui ouvre un an d'accès (métadonnées posées par payment_intent_data)
  try {
    const res = await stripe.paymentIntents.search({ query: `metadata['userId']:'${userId}' AND metadata['plan']:'yearly' AND status:'succeeded'`, limit: 10 })
    const paiement = res.data.filter(estANous).sort((a, b) => b.created - a.created)[0]
    if (paiement) {
      const fin = new Date(paiement.created * 1000)
      fin.setFullYear(fin.getFullYear() + 1)
      if (fin > new Date()) return { plan: 'yearly', stripe_customer_id: paiement.customer, stripe_subscription_id: null, fin }
    }
  } catch (err) {
    console.error('Recherche Stripe des paiements annuels indisponible :', err.message)
  }
  return null
}

// Écrit l'accès dans la table subscriptions (une ligne par utilisateur), avec le client Supabase admin
export function enregistrerAcces(supabaseAdmin, userId, acces) {
  return supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: acces.stripe_customer_id,
    stripe_subscription_id: acces.stripe_subscription_id,
    plan: acces.plan,
    status: 'active',
    current_period_end: acces.fin.toISOString(),
  }, { onConflict: 'user_id' })
}
