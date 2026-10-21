// lib/acces.js — contrôles d'accès faits CÔTÉ SERVEUR dans les routes API
// Avant : les routes faisaient confiance au navigateur (aucune session vérifiée, blocage « essai expiré »
// seulement dans les pages), donc n'importe qui pouvait appeler l'IA en boucle aux frais du site.
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const DUREE_ESSAI_MS = 7 * 24 * 60 * 60 * 1000

// Identifie l'utilisateur à partir du jeton de session Supabase envoyé par la page
// (en-tête « Authorization: Bearer <access_token> », voir lib/entetes-auth.js).
// Renvoie { user, supabase } — supabase agit avec les droits de cet utilisateur (RLS) — ou { erreur } (réponse 401).
export async function utilisateurConnecte(request) {
  const entete = request.headers.get('authorization') || ''
  const jeton = entete.startsWith('Bearer ') ? entete.slice(7).trim() : ''
  if (!jeton) {
    return { erreur: NextResponse.json({ error: 'Connectez-vous pour continuer.' }, { status: 401 }) }
  }
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jeton}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  })
  const { data, error } = await supabase.auth.getUser(jeton)
  if (error || !data?.user) {
    return { erreur: NextResponse.json({ error: 'Votre session a expiré : reconnectez-vous.' }, { status: 401 }) }
  }
  return { user: data.user, supabase }
}

// Exercices (routes qui appellent l'IA) : compte connecté ET essai de 7 jours en cours OU abonnement actif.
// Même règle que les pages, mais impossible à contourner en appelant la route directement.
export async function verifierAccesExercices(request) {
  const res = await utilisateurConnecte(request)
  if (res.erreur) return res
  const { user, supabase } = res

  if (Date.now() - new Date(user.created_at).getTime() < DUREE_ESSAI_MS) return res

  const { data: abonnement } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()
  if (abonnement && new Date(abonnement.current_period_end) > new Date()) return res

  return { erreur: NextResponse.json({ error: 'Votre essai gratuit est terminé : passez Premium pour continuer.', acces: 'expire' }, { status: 403 }) }
}
