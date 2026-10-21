// lib/entetes-auth.js — joint le jeton de session Supabase aux appels des routes API protégées
// (les routes le vérifient côté serveur avec lib/acces.js)
import { supabase } from './supabase'

export async function entetesAuth(autres = {}) {
  const { data: { session } } = await supabase.auth.getSession()
  return session ? { ...autres, Authorization: `Bearer ${session.access_token}` } : autres
}
