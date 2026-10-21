'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { LayoutDashboard, ChartNoAxesColumn, History, CircleUserRound, BadgeCheck, LogOut, Stethoscope, CircleX, CreditCard, Lightbulb, MessageCircle, CircleHelp, Flame, TrendingUp, TrendingDown, Footprints, CalendarCheck, Dumbbell, Medal, BookOpen, GraduationCap, Star, Puzzle, Trophy, Lock, Check } from 'lucide-react'


const menuItems = [
  { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
  { id: 'progression', label: 'Mes stats', icon: ChartNoAxesColumn },
  { id: 'historique', label: 'Historique', icon: History },
  { id: 'profil', label: 'Compte', icon: CircleUserRound },
  { id: 'abonnement', label: 'Devenir Premium', icon: BadgeCheck, premium: true }
]

// Astuces affichées en alternance sous « Bonjour … » (75 caractères max pour tenir sur une ligne)
const TIPS = [
  'Débit en gouttes/min = volume (mL) × 20 ÷ durée (min).',
  'Durée de perfusion (h) = volume (mL) ÷ débit (mL/h).',
  'Une solution à 5 % contient 5 g pour 100 mL, pas 5 g pour toute la poche.',
  'Hausse de 20 % : multipliez par 1,20. Baisse de 20 % : par 0,80.',
  '+10 % puis −10 % ne ramène pas au prix de départ : on perd 1 %.',
  'Pour retrouver un prix avant hausse, divisez : ne retirez pas le %.',
  'Les durées sont en base 60 : 1 h 25 = 85 min, pas 125.',
  'Vitesse moyenne : distance totale ÷ temps total, jamais (v1 + v2) ÷ 2.',
  'Sans calculatrice, posez vos divisions : elles pèsent lourd à l\'épreuve.',
  'Oral : entraînez-vous à présenter votre parcours sans notes.',
  'Faites un examen blanc par semaine pour vous habituer au chrono.'
]

// Clé de jour locale AAAA-MM-JJ (avec zéros, pour comparer les jours sans ambiguïté)
const cleJour = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Jours d'affilée avec au moins un exercice (la série tient si le dernier exercice date d'aujourd'hui ou d'hier)
function calcStreak(historique) {
  if (!historique.length) return 0
  const jours = new Set(historique.map(h => cleJour(new Date(h.created_at))))
  const d = new Date()
  if (!jours.has(cleJour(d))) d.setDate(d.getDate() - 1)
  let streak = 0
  while (jours.has(cleJour(d)) && streak < 365) { streak++; d.setDate(d.getDate() - 1) }
  return streak
}

// Phrase sous « Bonjour … » d'après l'activité réelle du candidat : { cle, texte } ou null
function phraseAccueil(historique, { isPremium, trialDays }) {
  if (!isPremium && trialDays === 0) return { cle: 'essai-termine', texte: 'Votre essai est terminé : passez Premium pour reprendre l\'entraînement.' }
  if (historique.length === 0) return { cle: 'aucun-exercice', texte: 'Commencez par un examen blanc pour situer votre niveau.' }
  const debutJour = new Date(); debutJour.setHours(0, 0, 0, 0)
  const aujourdhui = historique.filter(h => new Date(h.created_at) >= debutJour).length
  if (aujourdhui === 1) return { cle: 'jour-1', texte: 'Déjà un exercice aujourd\'hui, bien joué. On en fait un deuxième ?' }
  if (aujourdhui > 1) return { cle: `jour-${aujourdhui}`, texte: `Déjà ${aujourdhui} exercices aujourd'hui, belle régularité !` }
  const streak = calcStreak(historique)
  if (streak >= 2) return { cle: 'serie', texte: `${streak} jours d'affilée : un exercice aujourd'hui et la série continue.` }
  const dernier = new Date(Math.max(...historique.map(h => new Date(h.created_at).getTime()))); dernier.setHours(0, 0, 0, 0)
  const jours = Math.round((debutJour - dernier) / 86400000)
  if (jours >= 3) return { cle: 'inactif', texte: `Dernier exercice il y a ${jours} jours. On reprend en douceur ?` }
  if (!isPremium && trialDays <= 2) return { cle: 'essai-fin', texte: `Plus que ${trialDays} jour${trialDays > 1 ? 's' : ''} d'essai : tentez un examen blanc complet.` }
  // Point faible : maths ou rédaction, au moins 2 notes, moyenne sous 12/20
  const parType = {}
  historique.filter(h => h.note != null && h.note_max && (h.type === 'Maths' || h.type === 'Rédaction')).forEach(h => { (parType[h.type] ||= []).push(h.note / h.note_max * 20) })
  const faible = Object.entries(parType).filter(([, v]) => v.length >= 2).map(([t, v]) => [t, v.reduce((s, x) => s + x, 0) / v.length]).sort((a, b) => a[1] - b[1])[0]
  if (faible && faible[1] < 12) return { cle: `faible-${faible[0]}`, texte: `Point à travailler : ${faible[0] === 'Maths' ? 'les maths' : 'la rédaction'}, ${faible[1].toFixed(1).replace('.', ',')}/20 de moyenne.` }
  return null
}

// Une même phrase n'est affichée qu'une fois par jour sur ce navigateur ; les fois suivantes, astuces seules
function phraseDuJour(candidate) {
  if (!candidate) return null
  const jour = cleJour(new Date())
  let vues = { jour, cles: [] }
  try { const s = JSON.parse(localStorage.getItem('dash_phrases_vues') || 'null'); if (s && s.jour === jour && Array.isArray(s.cles)) vues = s } catch {}
  if (vues.cles.includes(candidate.cle)) return null
  try { localStorage.setItem('dash_phrases_vues', JSON.stringify({ jour, cles: [...vues.cles, candidate.cle] })) } catch {}
  return candidate.texte
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div></div>}>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(searchParams.get('tab') || 'dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [trialDays, setTrialDays] = useState(7)
  const [isPremium, setIsPremium] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState(null)
  const [subscriptionEnd, setSubscriptionEnd] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  // Ligne sous « Bonjour … » : avance d'un cran toutes les 10 s (voir le calcul des emplacements plus bas)
  const [tipTick, setTipTick] = useState(0)
  // Les astuces reprennent là où la visite précédente s'est arrêtée (sinon au hasard)
  const [tipStart] = useState(() => {
    try { const n = parseInt(localStorage.getItem('dash_tip_next'), 10); if (n >= 0 && n < TIPS.length) return n } catch {}
    return Math.floor(Math.random() * TIPS.length)
  })
  // Phrase d'accueil : undefined = pas encore décidée, null = aucune, sinon le texte
  const [phrase, setPhrase] = useState(undefined)
  const phraseDecidedRef = useRef(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [showReviewPopup, setShowReviewPopup] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSending, setReviewSending] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)
  const [showSupportPopup, setShowSupportPopup] = useState(false)
  const [showBlockPopup, setShowBlockPopup] = useState(false)
  const [supportCategory, setSupportCategory] = useState('')
  const [supportMessage, setSupportMessage] = useState('')
  const [supportFile, setSupportFile] = useState(null)
  const [supportSending, setSupportSending] = useState(false)
  const [supportSent, setSupportSent] = useState(false)

  const [newLastName, setNewLastName] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileMsg, setProfileMsg] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [historique, setHistorique] = useState([])
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [selectedDay, setSelectedDay] = useState(null)
  // Mes stats : période du graphique, épreuves masquées dans la légende, point survolé
  const [statsPeriode, setStatsPeriode] = useState('tout')
  const [statsMasques, setStatsMasques] = useState([])
  const [statsSurvol, setStatsSurvol] = useState(null)

  async function fetchHistorique(userId) {
    const { data } = await supabase
      .from('historique')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (data) setHistorique(data)
    return data || []
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/auth'; return }
      setUser(session.user)
      setNewFirstName(session.user?.user_metadata?.first_name || '')
      setNewLastName(session.user?.user_metadata?.last_name || '')
      const histPromise = fetchHistorique(session.user.id)
      // Fetch subscription puis calcul trial
      const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', session.user.id).eq('status', 'active').single()
      const hasSub = !!(sub && new Date(sub.current_period_end) > new Date())
      if (hasSub) {
        setIsPremium(true)
        setSubscriptionPlan(sub.plan)
        setSubscriptionEnd(sub.current_period_end)
      }
      // Calcul trial
      const created = new Date(session.user.created_at)
      const now = new Date()
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24))
      const trial = Math.max(0, 7 - diffDays)
      setTrialDays(trial)
      setLoading(false)
      // Phrase d'accueil décidée une seule fois par chargement (le ref évite le double appel du mode strict en dev)
      histPromise.then(data => {
        if (phraseDecidedRef.current) return
        phraseDecidedRef.current = true
        setPhrase(phraseDuJour(phraseAccueil(data, { isPremium: hasSub, trialDays: trial })))
      })
      // Afficher la pop-up de succès après paiement
      if (searchParams.get('success') === 'true') {
        setShowSuccessPopup(true)
        window.history.replaceState({}, '', '/dashboard')
      }
      // Vérification des emails de relance (fire-and-forget)
      fetch('/api/emails/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      }).catch(() => {})
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) window.location.href = '/auth'
      else setUser(session.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleCheckout(plan) {
    setCheckoutLoading(true)
    try {
      const priceId = plan === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutLoading(false)
    }
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      console.error('Portal error:', err)
    }
  }

  useEffect(() => {
    if (phrase === undefined) return
    const hasPhrase = typeof phrase === 'string'
    const last = (hasPhrase ? 1 : 0) + TIPS.length - 1
    const t = Math.min(tipTick, last)
    // Mémoriser l'astuce suivante pour que la prochaine visite ne reprenne pas les mêmes
    if (!(hasPhrase && t === 0)) { try { localStorage.setItem('dash_tip_next', String((tipStart + t - (hasPhrase ? 1 : 0) + 1) % TIPS.length)) } catch {} }
    if (tipTick >= last) return
    const id = setTimeout(() => setTipTick(x => x + 1), 10000)
    return () => clearTimeout(id)
  }, [phrase, tipTick, tipStart])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  async function updateProfile(e) {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg('')
    const updates = { data: { first_name: newFirstName, last_name: newLastName } }
    if (newPassword) updates.password = newPassword
    const { error } = await supabase.auth.updateUser(updates)
    setProfileSaving(false)
    if (error) setProfileMsg('Erreur : ' + error.message)
    else { setProfileMsg('Profil correctement mis à jour !'); setNewPassword(''); setTimeout(() => setProfileMsg(''), 5000) }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div></div>
  }

  const firstName = user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilisateur'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'
  const email = user?.email || ''
  const createdAt = new Date(user?.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const stats = { qcm: 0, score: '-', calculs: 0, redactions: 0 }

  const streak = calcStreak(historique)

  // Ligne sous « Bonjour … » : la phrase d'accueil (si elle existe) puis chaque astuce une seule fois, dans l'ordre.
  // Deux emplacements se relaient en fondu (A aux crans pairs, B aux crans impairs) ; le texte d'un emplacement
  // n'est mis à jour qu'au moment où il réapparaît, jamais pendant son fondu de sortie. Arrivé au bout, tout s'arrête.
  const hasPhrase = typeof phrase === 'string'
  const nbItems = (hasPhrase ? 1 : 0) + TIPS.length
  const lineTick = Math.min(tipTick, nbItems - 1)
  const showTip = lineTick % 2 === 1
  const itemA = lineTick - (lineTick % 2)
  const itemB = lineTick % 2 === 1 ? lineTick : Math.min(lineTick === 0 ? 1 : lineTick - 1, nbItems - 1)
  const astuce = tip => <><span className="inline-block text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 px-1.5 py-px rounded-md mr-1.5 align-[1px]">Astuce</span>{tip}</>
  const ligne = i => phrase === undefined ? '' : (hasPhrase && i === 0 ? phrase : astuce(TIPS[(tipStart + i - (hasPhrase ? 1 : 0)) % TIPS.length]))

  // Objectif semaine : exercices faits cette semaine (lundi à dimanche)
  const getWeekData = () => {
    const today = new Date()
    const dayOfWeek = (today.getDay() + 6) % 7 // 0=lundi
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek)
    monday.setHours(0, 0, 0, 0)
    const weekExercises = historique.filter(h => new Date(h.created_at) >= monday)
    const daysWithExercise = new Set()
    weekExercises.forEach(h => {
      const d = new Date(h.created_at)
      daysWithExercise.add((d.getDay() + 6) % 7)
    })
    return { count: weekExercises.length, daysWithExercise }
  }
  const weekData = getWeekData()
  const weekProgress = Math.min(100, (weekData.count / 5) * 100)
  const weekGoalReached = weekData.count >= 5

  // Objectif mois : 20 exercices sur les 30 derniers jours (glissant)
  const getMonthData = () => {
    const today = new Date()
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(today.getDate() - 30)
    thirtyDaysAgo.setHours(0, 0, 0, 0)
    const monthExercises = historique.filter(h => new Date(h.created_at) >= thirtyDaysAgo)
    return { count: monthExercises.length }
  }
  const monthData = getMonthData()
  const monthProgress = Math.min(100, (monthData.count / 20) * 100)

  // Moyenne générale (ramenée sur 10) — exclure Spécifique
  const notesAll = historique.filter(h => h.note != null && h.note_max && h.type !== 'Spécifique')
  const moyenneGenerale = notesAll.length > 0 ? parseFloat((notesAll.reduce((sum, h) => sum + (h.note / h.note_max) * 20, 0) / notesAll.length).toFixed(1)) : null
  // Tendance : comparer moyenne avec et sans le dernier exercice
  const moyenneTendance = (() => {
    if (notesAll.length < 2) return null
    const sorted = [...notesAll].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    const withoutLast = sorted.slice(1)
    const moyennePrecedente = withoutLast.reduce((sum, h) => sum + (h.note / h.note_max) * 20, 0) / withoutLast.length
    return moyenneGenerale > moyennePrecedente ? 'up' : moyenneGenerale < moyennePrecedente ? 'down' : null
  })()
  const categories = [
    { name: 'Calculs de dose', color: 'bg-red-500', progress: 0 },
    { name: 'Pourcentages', color: 'bg-purple-500', progress: 0 },
    { name: 'Produit en croix', color: 'bg-amber-500', progress: 0 },
    { name: 'Calcul mental', color: 'bg-blue-500', progress: 0 },
    { name: 'Équations', color: 'bg-emerald-500', progress: 0 },
    { name: 'Conversions', color: 'bg-orange-500', progress: 0 }
  ]

  function navigateTo(id) { setPage(id); setSidebarOpen(false) }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex" style={{fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Sora:wght@500;600;700&display=swap" rel="stylesheet" />

      {sidebarOpen && <div className="fixed top-14 lg:top-0 inset-x-0 bottom-0 bg-black/30 z-[45] lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* SIDEBAR FLOTTANTE */}
      <div className={`fixed top-14 lg:top-0 bottom-0 left-0 z-50 flex items-start lg:items-center pl-0 lg:pl-3 py-0 lg:py-5 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <aside className="w-[84px] bg-white rounded-none rounded-br-2xl lg:rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 border-t-0 lg:border-t flex flex-col items-center py-5 h-full lg:h-[calc(100vh-2.5rem)]" style={{fontFamily: "'Sora', 'DM Sans', sans-serif"}}>
          <a href="/" className="mb-4">
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
              <Stethoscope size={20} strokeWidth={2.5} />
            </div>
          </a>
          <div className="w-7 h-px bg-slate-200 mb-3"></div>

          <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-1.5">
            {menuItems.filter(item => !item.premium || !isPremium).map(item => (
              <button key={item.id} onClick={() => navigateTo(item.id)} className={`relative w-full flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[11px] font-semibold transition-all cursor-pointer text-center group ${item.premium ? (page === item.id ? 'bg-amber-50 text-amber-600' : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600') : (page === item.id ? 'bg-red-50 text-red-600' : 'text-slate-900 hover:bg-red-50 hover:text-red-600')}`}>
                {page === item.id && <span className={`absolute -left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-full ${item.premium ? 'bg-amber-400' : 'bg-red-600'}`}></span>}
                {item.premium ? (
                  <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <item.icon size={18} strokeWidth={2} />
                  </span>
                ) : (
                  <item.icon size={20} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-125" />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-2 mt-auto pt-3">
            <div className="w-7 h-px bg-slate-200 mb-1"></div>
            <button onClick={() => navigateTo('profil')} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${page === 'profil' ? 'bg-red-600 text-white ring-2 ring-red-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {firstName.charAt(0).toUpperCase()}
            </button>
            <button onClick={handleLogout} className="text-slate-900 hover:text-red-500 transition cursor-pointer p-1">
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>
        </aside>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[102px]">
        {/* Mobile top bar */}
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <a href="/" className="flex items-center">
            <span className="font-black text-lg text-slate-900">Prépa <span className="text-red-600">FPC</span></span>
          </a>
          <div className="w-9"></div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

          {/* Pop-up succès abonnement */}
          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSuccessPopup(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Abonnement activé !</h2>
                <p className="text-slate-500 font-medium mb-6">Félicitations, vous avez désormais accès à toutes les fonctionnalités premium. Bon entraînement !</p>
                <button onClick={() => setShowSuccessPopup(false)} className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer shadow-lg">
                  C'est parti !
                </button>
              </div>
            </div>
          )}

          {/* ===== POPUP AVIS ===== */}
          {showReviewPopup && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewPopup(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
                {reviewSent ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Merci pour votre avis !</h2>
                    <p className="text-slate-500 font-medium mb-6">Votre retour nous aide à améliorer la plateforme.</p>
                    <button onClick={() => setShowReviewPopup(false)} className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer shadow-lg">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-900 px-6 py-5 relative">
                      <button onClick={() => setShowReviewPopup(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                      <h2 className="text-lg font-black text-white pr-8">Évaluez Prépa FPC</h2>
                      <p className="text-slate-400 text-sm font-medium mt-1">Votre avis compte pour nous !</p>
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-bold text-slate-700 mb-3">Quelle note donnez-vous au site ?</p>
                      <div className="flex items-center gap-1 mb-6 justify-center">
                        {[1, 2, 3, 4, 5].map(star => {
                          const full = reviewRating >= star
                          const half = !full && reviewRating >= star - 0.5
                          return (
                            <div key={star} className="relative w-10 h-10 cursor-pointer transition-transform hover:scale-125" style={{WebkitTapHighlightColor: 'transparent'}}>
                              {/* Moitié gauche = demi-étoile */}
                              <div className="absolute inset-0 w-1/2 overflow-hidden z-10" onClick={() => setReviewRating(star - 0.5)}>
                                <svg className={`w-10 h-10 transition-colors ${full || half ? 'text-red-500' : 'text-slate-200'}`} fill={full || half ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                              </div>
                              {/* Moitié droite = étoile pleine */}
                              <div className="absolute inset-0 z-10" style={{clipPath: 'inset(0 0 0 50%)'}} onClick={() => setReviewRating(star)}>
                                <svg className={`w-10 h-10 transition-colors ${full ? 'text-red-500' : 'text-slate-200'}`} fill={full ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                </svg>
                              </div>
                              {/* Fond (contour) */}
                              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            </div>
                          )
                        })}
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-2">Un commentaire ? <span className="font-normal text-slate-400">(optionnel)</span></p>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition h-28"
                        placeholder="Ce que vous aimez, ce qu'on pourrait améliorer..."
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        maxLength={2000}
                      />
                      <button
                        onClick={async () => {
                          if (!reviewRating) return
                          setReviewSending(true)
                          try {
                            const res = await fetch('/api/review', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ rating: reviewRating, comment: reviewComment, email: user?.email })
                            })
                            if (res.ok) setReviewSent(true)
                          } catch {}
                          setReviewSending(false)
                        }}
                        disabled={!reviewRating || reviewSending}
                        className={`w-full mt-4 font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 ${reviewRating ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        {reviewSending ? (
                          <div className="animate-spin w-5 h-5 border-2 border-black/30 border-t-black rounded-full"></div>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                            Envoyer mon avis
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===== POPUP ESSAI EXPIRÉ ===== */}
          {showBlockPopup && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowBlockPopup(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-900 px-6 py-5 relative">
                  <button onClick={() => setShowBlockPopup(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                  <div className="text-3xl mb-2">😢</div>
                  <h2 className="text-lg font-black text-white pr-8">Votre essai gratuit est terminé</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Abonnez-vous pour continuer à vous entraîner.</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-slate-500 font-medium text-sm mb-6">Pour accéder à tous les exercices, QCM, examens blancs et à la préparation orale, souscrivez à un abonnement.</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => { setShowBlockPopup(false); setPage('abonnement') }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg text-sm cursor-pointer">Voir les tarifs</button>
                    <button onClick={() => setShowBlockPopup(false)} className="text-slate-500 font-medium text-sm hover:text-slate-700 transition cursor-pointer">Fermer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== POPUP SUPPORT ===== */}
          {showSupportPopup && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowSupportPopup(false)}>
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
                {supportSent ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Message envoyé !</h2>
                    <p className="text-slate-500 font-medium mb-6">Nous reviendrons vers vous le plus vite possible.</p>
                    <button onClick={() => setShowSupportPopup(false)} className="bg-slate-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition cursor-pointer shadow-lg">Fermer</button>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-900 px-6 py-5 relative">
                      <button onClick={() => setShowSupportPopup(false)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                      <h2 className="text-lg font-black text-white pr-8">Contacter le support</h2>
                      <p className="text-slate-400 text-sm font-medium mt-1">On vous répond rapidement !</p>
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-bold text-slate-700 mb-3">Catégorie <span className="text-red-500">*</span></p>
                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {[
                          { id: 'bug', label: 'Bug', icon: <CircleX size={16} strokeWidth={2} /> },
                          { id: 'abonnement', label: 'Abonnement', icon: <CreditCard size={16} strokeWidth={2} /> },
                          { id: 'suggestion', label: 'Suggestion', icon: <Lightbulb size={16} strokeWidth={2} /> },
                          { id: 'autre', label: 'Autre', icon: <MessageCircle size={16} strokeWidth={2} /> },
                        ].map(cat => (
                          <button key={cat.id} onClick={() => setSupportCategory(cat.id)} className={`p-3 rounded-xl border-2 text-sm font-bold transition cursor-pointer flex items-center gap-2 ${supportCategory === cat.id ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                            {cat.icon} {cat.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm font-bold text-slate-700 mb-2">Votre message</p>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition h-28 mb-4"
                        placeholder="Décrivez votre problème ou votre suggestion..."
                        value={supportMessage}
                        onChange={e => setSupportMessage(e.target.value)}
                        maxLength={5000}
                      />
                      <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700 transition">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed ${supportFile ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-300 hover:border-slate-400'} transition`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            {supportFile ? supportFile.name : 'Ajouter une pièce jointe'}
                          </div>
                          <input type="file" className="hidden" accept="image/*,.pdf,.txt,.doc,.docx" onChange={e => setSupportFile(e.target.files?.[0] || null)} />
                        </label>
                        {supportFile && (
                          <button onClick={() => setSupportFile(null)} className="text-xs text-red-500 hover:text-red-700 font-bold mt-1 cursor-pointer">Retirer</button>
                        )}
                      </div>
                      <button
                        onClick={async () => {
                          if (!supportCategory || !supportMessage.trim()) return
                          setSupportSending(true)
                          try {
                            const formData = new FormData()
                            formData.append('category', supportCategory)
                            formData.append('message', supportMessage)
                            formData.append('email', user?.email || '')
                            if (supportFile) formData.append('file', supportFile)
                            const res = await fetch('/api/support', { method: 'POST', body: formData })
                            if (res.ok) setSupportSent(true)
                          } catch {}
                          setSupportSending(false)
                        }}
                        disabled={!supportCategory || !supportMessage.trim() || supportSending}
                        className={`w-full font-bold text-sm px-6 py-3 rounded-xl transition cursor-pointer shadow-lg flex items-center justify-center gap-2 ${supportCategory && supportMessage.trim() ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                      >
                        {supportSending ? (
                          <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                            Envoyer
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ============ ACCUEIL ============ */}
          {page === 'dashboard' && (
            <div>
              {/* Header + Trial */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{greeting} {firstName} !</h1>
                  <div className="relative h-10 sm:h-5">
                    <p className={`text-slate-500 font-medium text-sm absolute inset-x-0 sm:whitespace-nowrap transition-all duration-500 ${showTip ? 'opacity-0 -translate-y-3' : 'opacity-100 translate-y-0'}`}>{ligne(itemA)}</p>
                    <p className={`text-slate-500 font-medium text-sm absolute inset-x-0 transition-all duration-500 sm:whitespace-nowrap ${showTip ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>{ligne(itemB)}</p>
                  </div>
                </div>
                {isPremium ? (
                  <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 px-4 py-2 rounded-xl flex items-center gap-2 shadow-md shadow-amber-200/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                    <span className="font-black text-sm">Premium {subscriptionPlan === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div onClick={trialDays === 0 ? () => setPage('abonnement') : undefined} className={`${trialDays === 0 ? 'bg-red-50 text-red-600 border border-red-200 cursor-pointer hover:bg-red-100 transition' : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow-md'} px-4 py-2 rounded-xl flex items-center gap-2`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                      <span className="font-black text-sm">{trialDays === 0 ? 'Essai expiré' : `${trialDays}j restant${trialDays > 1 ? 's' : ''}`}</span>
                    </div>
                    <button onClick={() => setPage('abonnement')} className="bg-slate-900 hover:bg-black text-white font-bold text-sm px-4 py-2 rounded-xl transition shadow-md cursor-pointer">Devenir premium</button>
                  </div>
                )}
              </div>

              {/* ENTRAÎNEMENTS */}
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Commencer à m'entraîner</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                <Link href="/specifique" onClick={e => { if (trialDays === 0 && !isPremium) { e.preventDefault(); setShowBlockPopup(true) } }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Entraînement spécifique</h3>
                  <p className="text-xs text-slate-500 flex-1">Tous les types d'exercices de maths avec des explications pour réellement progresser</p>
                  <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md mt-3">Ne compte pas dans la moyenne</span>
                </Link>
                <Link href="/maths" onClick={e => { if (trialDays === 0 && !isPremium) { e.preventDefault(); setShowBlockPopup(true) } }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center text-center relative">
                  <span className="absolute top-2 right-2 text-[9px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md">30 min</span>
                  <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Entraînement mathématiques</h3>
                  <p className="text-xs text-slate-500 flex-1">Conditions similaires à l'examen pour évaluer son niveau basé en partie sur les annales</p>
                  <span className="text-[10px] font-black bg-red-50 text-red-600 px-2 py-0.5 rounded-md mt-3">Note /10</span>
                </Link>
                <Link href="/redaction" onClick={e => { if (trialDays === 0 && !isPremium) { e.preventDefault(); setShowBlockPopup(true) } }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center text-center relative">
                  <span className="absolute top-2 right-2 text-[9px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md">30 min</span>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Entraînement rédactionnel</h3>
                  <p className="text-xs text-slate-500 flex-1">Analyse de texte, dissertations, culture sanitaire basée en partie sur les annales</p>
                  <span className="text-[10px] font-black bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md mt-3">Note /10</span>
                </Link>
                <Link href="/examen" onClick={e => { if (trialDays === 0 && !isPremium) { e.preventDefault(); setShowBlockPopup(true) } }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-yellow-200 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center text-center relative">
                  <span className="absolute top-2 right-2 text-[9px] font-black text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-md">1H</span>
                  <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Examen blanc</h3>
                  <p className="text-xs text-slate-500 flex-1">Conditions réelles, sans calculatrice, vous disposez d'un temps imparti d'1H</p>
                  <span className="text-[10px] font-black bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-md mt-3">Note /20</span>
                </Link>
                <Link href="/oral" onClick={e => { if (trialDays === 0 && !isPremium) { e.preventDefault(); setShowBlockPopup(true) } }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 group flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Questions sur votre parcours</h3>
                  <p className="text-xs text-slate-500 flex-1">Simulations de questions possibles sur votre parcours afin de passer l'examen oral dans les meilleures conditions</p>
                  <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md mt-3">Pas de note</span>
                </Link>
              </div>

              {/* STREAK + MOYENNE + OBJECTIF SEMAINE */}
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Ma progression</h2>
              <div className="grid sm:grid-cols-3 gap-4 mb-10">
                {/* Streak */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <div className="w-9 h-9 relative shrink-0">
                    <svg viewBox="0 0 32 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <clipPath id="dropClip">
                          <path d="M16 2 C16 2 4 18 4 26 C4 33.5 9.5 38 16 38 C22.5 38 28 33.5 28 26 C28 18 16 2 16 2Z"/>
                        </clipPath>
                      </defs>
                      <path d="M16 2 C16 2 4 18 4 26 C4 33.5 9.5 38 16 38 C22.5 38 28 33.5 28 26 C28 18 16 2 16 2Z" fill={streak >= 7 ? '#fef9c3' : '#fee2e2'} stroke={streak >= 7 ? '#facc15' : '#fca5a5'} strokeWidth="1.2"/>
                      <rect clipPath="url(#dropClip)" x="0" y={38 - Math.min(36, Math.max(0, streak * 5))} width="32" height={Math.min(36, Math.max(0, streak * 5))} fill={streak === 0 ? '#fecaca' : streak < 3 ? '#f87171' : streak < 7 ? '#ef4444' : '#dc2626'}/>
                      <ellipse cx="11" cy="24" rx="2.5" ry="3" fill="white" opacity="0.25"/>
                    </svg>
                    {streak >= 7 && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-slate-900 rounded-full flex items-center justify-center font-black text-[9px] shadow-sm border-2 border-white">{streak}</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 mb-1">Ma série</p>
                    <p className="text-2xl font-black text-slate-900">{streak} <span className="text-xs font-bold text-slate-400">jour(s) d'affilée</span></p>
                  </div>
                </div>

                {/* Ma moyenne */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                  <p className="text-sm font-black text-slate-900 mb-1">Ma moyenne générale</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-slate-900">{moyenneGenerale || '—'}<span className="text-2xl font-black text-slate-400">/20</span></p>
                    {moyenneTendance === 'up' && (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"/></svg>
                    )}
                    {moyenneTendance === 'down' && (
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    )}
                  </div>
                </div>

                {/* Objectif semaine / mois / badge */}
                {monthData.count >= 20 ? (
                  <div className="bg-slate-900 p-5 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                    </div>
                    <p className="text-sm font-black text-white">Félicitations pour votre rigueur de travail !</p>
                    <p className="text-xs text-slate-400 font-bold mt-1">{monthData.count} exercices ce mois-ci</p>
                  </div>
                ) : !weekGoalReached ? (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-black text-slate-900">Objectif de la semaine</p>
                      <span className="text-xs font-black text-slate-400">{weekData.count}/5 exercices</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500" style={{width: `${weekProgress}%`}}></div>
                    </div>
                    <div className="flex justify-between">
                      {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${weekData.daysWithExercise.has(i) ? 'bg-red-600 text-white shadow-sm shadow-red-200' : 'bg-slate-100 text-slate-400'}`}>
                            {weekData.daysWithExercise.has(i) ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : day}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-black text-slate-900">Objectif du mois</p>
                      <span className="text-xs font-black text-slate-400">{monthData.count}/20 exercices</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500" style={{width: `${monthProgress}%`}}></div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                      <p className="text-sm font-bold text-emerald-700">Continue comme ça, c'est très bien !</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RACCOURCIS UTILES */}
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Raccourcis utiles</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <a href="/calculs-doses" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-red-200 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2Z"/><path d="M9 7h6"/><path d="M12 7v6"/><path d="M9 17h6"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Formules</p>
                    <p className="text-[10px] text-slate-400 font-medium">Calculs de doses</p>
                  </div>
                </a>
                <a href="/blog" className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Méthodologie</p>
                    <p className="text-[10px] text-slate-400 font-medium">Articles</p>
                  </div>
                </a>
                <button onClick={() => { setShowReviewPopup(true); setReviewRating(0); setReviewComment(''); setReviewSent(false) }} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-200 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-3 cursor-pointer text-left">
                  <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Évaluez le site</p>
                    <p className="text-[10px] text-slate-400 font-medium">Donnez votre avis</p>
                  </div>
                </button>
                <button onClick={() => { setShowSupportPopup(true); setSupportCategory(''); setSupportMessage(''); setSupportFile(null); setSupportSent(false) }} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 group flex items-center gap-3 cursor-pointer text-left">
                  <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <CircleHelp size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Support</p>
                    <p className="text-[10px] text-slate-400 font-medium">Signaler un bug</p>
                  </div>
                </button>
              </div>

              {/* CTA Premium */}
              {!isPremium && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg shadow-slate-900/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2"><span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Plan gratuit</span></div>
                    <h3 className="text-lg font-black text-white mb-1">Passez au niveau supérieur</h3>
                    <p className="text-slate-400 font-medium text-sm">Donnez-vous toutes les chances pour réussir votre concours FPC.</p>
                    <p className="text-slate-500 font-medium text-xs mt-1">QCM, calculs et examens blancs en illimité.</p>
                  </div>
                  <button onClick={() => setPage('abonnement')} className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-amber-950 font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-amber-200/50 shrink-0 text-sm cursor-pointer">Voir les offres</button>
                </div>
              )}
            </div>
          )}

          {/* ============ MES STATS ============ */}
          {page === 'progression' && (() => {
            const JOUR = 86400000
            const fmtNote = n => (Math.round(n * 10) / 10).toString().replace('.', ',')
            const fmtJour = d => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            const debutJour = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }

            // Épreuves notées sur 20 (l'entraînement ciblé est noté sur 10 et suivi à part, l'oral n'est pas noté)
            const EPREUVES = [
              { type: 'Maths', label: 'Maths', couleur: '#ef4444', teinte: 'bg-red-50 text-red-600', href: '/maths' },
              { type: 'Rédaction', label: 'Rédaction', couleur: '#8b5cf6', teinte: 'bg-purple-50 text-purple-600', href: '/redaction' },
              { type: 'Examen', label: 'Examen blanc', couleur: '#eab308', teinte: 'bg-yellow-50 text-yellow-700', href: '/examen' }
            ]
            const couleurType = Object.fromEntries(EPREUVES.map(e => [e.type, e.couleur]))
            const labelType = Object.fromEntries(EPREUVES.map(e => [e.type, e.label]))
            const sur20 = h => (h.note / h.note_max) * 20
            const notees = historique.filter(h => h.note != null && h.note_max && couleurType[h.type]).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

            // ----- Graphique des notes -----
            const depuis = statsPeriode === 'tout' ? null : Date.now() - (statsPeriode === '30' ? 30 : 90) * JOUR
            const points = notees.filter(h => !statsMasques.includes(h.type) && (!depuis || new Date(h.created_at) >= depuis)).map(h => ({ n: sur20(h), type: h.type, date: h.created_at }))
            const W = 760, H = 260, G = 38, D = 18, HT = 18, B = 30
            const pw = W - G - D, ph = H - HT - B
            const px = i => G + (points.length <= 1 ? pw / 2 : (i / (points.length - 1)) * pw)
            const py = n => HT + ((20 - n) / 20) * ph
            // Moyenne glissante sur les 3 dernières notes, tracée en courbe lissée
            const glissante = points.map((p, i) => { const s = points.slice(Math.max(0, i - 2), i + 1); return s.reduce((t, x) => t + x.n, 0) / s.length })
            const courbe = (() => {
              if (glissante.length < 2) return ''
              const pts = glissante.map((n, i) => [px(i), py(n)])
              const r = v => Math.round(v * 10) / 10
              let d = `M ${r(pts[0][0])} ${r(pts[0][1])}`
              for (let i = 0; i < pts.length - 1; i++) {
                const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2
                d += ` C ${r(p1[0] + (p2[0] - p0[0]) / 6)} ${r(p1[1] + (p2[1] - p0[1]) / 6)}, ${r(p2[0] - (p3[0] - p1[0]) / 6)} ${r(p2[1] - (p3[1] - p1[1]) / 6)}, ${r(p2[0])} ${r(p2[1])}`
              }
              return d
            })()
            const moyennePeriode = points.length ? points.reduce((t, p) => t + p.n, 0) / points.length : null
            const tendance = (() => {
              if (points.length < 4) return null
              const der = points.slice(-3), av = points.slice(-6, -3)
              return Math.round((der.reduce((t, p) => t + p.n, 0) / der.length - av.reduce((t, p) => t + p.n, 0) / av.length) * 10) / 10
            })()
            const ticksX = points.length > 1 ? [...new Set([0, Math.round((points.length - 1) / 2), points.length - 1])] : points.length ? [0] : []
            const survol = statsSurvol != null && points[statsSurvol] ? statsSurvol : null

            // ----- Chiffres clés -----
            const totalExos = historique.length
            const totalMin = historique.reduce((s, h) => s + (h.duration_minutes || 0), 0)
            const lundi = (() => { const d = debutJour(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d })()
            const examensNotes = historique.filter(h => h.type === 'Examen' && h.note != null && h.note_max)
            const meilleurExamen = examensNotes.length ? examensNotes.reduce((a, b) => sur20(b) > sur20(a) ? b : a) : null
            const parJour = {}
            historique.forEach(h => { const k = debutJour(new Date(h.created_at)).getTime(); parJour[k] = (parJour[k] || 0) + 1 })
            // Meilleure série de jours d'affilée (les diplômes de régularité restent acquis même si la série s'arrête)
            const meilleureSerie = (() => {
              const jours = Object.keys(parJour).map(Number).sort((a, b) => a - b)
              let best = 0, cur = 0, prev = null
              for (const x of jours) { cur = prev != null && Math.round((x - prev) / JOUR) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = x }
              return best
            })()

            // ----- Diplômes -----
            const serieRef = Math.max(streak, meilleureSerie)
            const has2020 = historique.some(h => h.note != null && h.note_max && h.note >= h.note_max)
            const typesManquants = ['Maths', 'Rédaction', 'Oral'].filter(t => !historique.some(h => h.type === t))
            const UNITES = { jours: ['jour', 'jours'], exercices: ['exercice', 'exercices'] }
            // Date d'obtention de chaque diplôme, retrouvée dans l'historique
            const chrono = [...historique].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            const joursTries = Object.keys(parJour).map(Number).sort((a, b) => a - b)
            const dateSerie = n => { let cur = 0, prev = null; for (const x of joursTries) { cur = prev != null && Math.round((x - prev) / JOUR) === 1 ? cur + 1 : 1; prev = x; if (cur >= n) return x } return null }
            const premiereFois = t => chrono.find(h => h.type === t)?.created_at
            const DATES = {
              'premier-pas': chrono[0]?.created_at, studieux: chrono[9]?.created_at, expert: chrono[49]?.created_at,
              regulier: dateSerie(3), assidu: dateSerie(5), marathonien: dateSerie(7), infatigable: dateSerie(14), pret: dateSerie(30),
              perfectionniste: chrono.find(h => h.note != null && h.note_max && h.note >= h.note_max)?.created_at,
              polyvalent: typesManquants.length ? null : Math.max(...['Maths', 'Rédaction', 'Oral'].map(t => new Date(premiereFois(t)).getTime()))
            }
            // val : ce qui débloque le diplôme (record pour les séries) ; prog : où en est le candidat pour l'obtenir
            // (pour les séries, la série en cours, puisqu'il faut enchaîner les jours à partir de maintenant)
            const badges = [
              { id: 'premier-pas', label: 'Premier pas', desc: '1er exercice terminé', Icon: Footprints, val: totalExos, cible: 1, unite: 'exercices' },
              { id: 'regulier', label: 'Régulier', desc: '3 jours d\'affilée', Icon: CalendarCheck, val: serieRef, prog: streak, cible: 3, unite: 'jours' },
              { id: 'assidu', label: 'Assidu', desc: '5 jours d\'affilée', Icon: Dumbbell, val: serieRef, prog: streak, cible: 5, unite: 'jours' },
              { id: 'marathonien', label: 'Marathonien', desc: '7 jours d\'affilée', Icon: Medal, val: serieRef, prog: streak, cible: 7, unite: 'jours' },
              { id: 'studieux', label: 'Studieux', desc: '10 exercices terminés', Icon: BookOpen, val: totalExos, cible: 10, unite: 'exercices' },
              { id: 'infatigable', label: 'Infatigable', desc: '14 jours d\'affilée', Icon: Flame, val: serieRef, prog: streak, cible: 14, unite: 'jours' },
              { id: 'expert', label: 'Expert', desc: '50 exercices terminés', Icon: GraduationCap, val: totalExos, cible: 50, unite: 'exercices' },
              { id: 'perfectionniste', label: 'Perfectionniste', desc: 'Obtenir 20/20', Icon: Star, val: has2020 ? 1 : 0, cible: 1 },
              { id: 'polyvalent', label: 'Polyvalent', desc: 'Maths + Rédaction + Oral', Icon: Puzzle, val: 3 - typesManquants.length, cible: 3 },
              { id: 'pret', label: 'Prêt pour le concours', desc: '30 jours d\'affilée', Icon: Trophy, val: serieRef, prog: streak, cible: 30, unite: 'jours' }
            ].map(b => {
              const prog = Math.min(b.cible, b.prog ?? b.val)
              const r = b.cible - prog
              const reste = b.id === 'perfectionniste' ? 'Visez un 20/20'
                : b.id === 'polyvalent' ? `Manque : ${typesManquants.join(', ')}`
                : `Plus que ${r} ${UNITES[b.unite][r > 1 ? 1 : 0]}`
              return { ...b, unlocked: b.val >= b.cible, prog, reste, date: DATES[b.id] ? new Date(DATES[b.id]) : null }
            })
            const unlockedCount = badges.filter(b => b.unlocked).length
            const prochain = badges.filter(b => !b.unlocked).sort((a, b) => (b.prog / b.cible) - (a.prog / a.cible))[0]

            // ----- Par épreuve -----
            const repartition = [...EPREUVES, { type: 'Oral', label: 'Oral', couleur: '#10b981' }, { type: 'Spécifique', label: 'Entraînement ciblé', couleur: '#3b82f6' }]
              .map(e => ({ ...e, n: historique.filter(h => h.type === e.type).length })).filter(e => e.n > 0)
            const NOTIONS = ['Produit en croix', 'Pourcentages', 'Conversions & opérations', 'Équations et problèmes']
            const cibles = NOTIONS.map(nom => {
              const s = historique.filter(h => h.type === 'Spécifique' && h.label === nom).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              return { nom, series: s.length, dernier: s[0] && s[0].note_max ? { note: s[0].note, max: s[0].note_max } : null }
            })

            // ----- Régularité : 16 semaines, une colonne par semaine (lundi en haut) -----
            const NB_SEM = 16
            const debutGrille = new Date(lundi); debutGrille.setDate(debutGrille.getDate() - (NB_SEM - 1) * 7)
            const maintenant = new Date()
            const cases = Array.from({ length: NB_SEM * 7 }, (_, i) => { const d = new Date(debutGrille); d.setDate(d.getDate() + i); return { d, n: parJour[d.getTime()] || 0, futur: d > maintenant } })
            const joursActifs16 = cases.filter(c => c.n > 0).length
            const moisSemaine = Array.from({ length: NB_SEM }, (_, w) => {
              const sem = cases.slice(w * 7, w * 7 + 7)
              const premier = sem.find(c => c.d.getDate() === 1)
              if (w === 0 && !premier) return sem[0].d.toLocaleDateString('fr-FR', { month: 'short' })
              return premier ? premier.d.toLocaleDateString('fr-FR', { month: 'short' }) : ''
            })
            const couleurCase = n => n === 0 ? '#f1f5f9' : n === 1 ? '#fecaca' : n === 2 ? '#f87171' : '#dc2626'
            const grille = [<span key="coin"></span>, ...moisSemaine.map((m, w) => <span key={`m${w}`} className="text-[10px] font-bold text-slate-400 leading-none h-3.5 whitespace-nowrap">{m}</span>)]
            for (let j = 0; j < 7; j++) {
              grille.push(<span key={`l${j}`} className="text-[10px] font-bold text-slate-400 leading-none flex items-center pr-1">{['L', '', 'M', '', 'V', '', ''][j]}</span>)
              for (let w = 0; w < NB_SEM; w++) {
                const c = cases[w * 7 + j]
                grille.push(<span key={`c${w}-${j}`} title={c.futur ? '' : `${c.n} exercice${c.n > 1 ? 's' : ''} · ${c.d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}`} className="aspect-square rounded-[4px]" style={{ backgroundColor: c.futur ? 'transparent' : couleurCase(c.n) }}></span>)
              }
            }

            // Carte d'un diplôme (obtenu ou à obtenir), utilisée dans le chemin des diplômes et le bandeau du haut
            const carteDiplome = b => {
              const BIcon = b.Icon
              // Diplôme obtenu : médaille avec rubans et sceau doré, mention « Diplôme obtenu » et date d'obtention
              if (b.unlocked) return (
                <div key={b.id} className="w-full rounded-2xl border-[3px] border-red-600 bg-white shadow-sm shadow-red-100 p-4 flex flex-col items-center text-center">
                  <span className="relative mb-4" aria-hidden="true">
                    <span className="absolute top-8 left-1/2 w-3.5 h-6 bg-red-700 origin-top -translate-x-[115%] rotate-[22deg] [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"></span>
                    <span className="absolute top-8 left-1/2 w-3.5 h-6 bg-red-700 origin-top translate-x-[15%] -rotate-[22deg] [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]"></span>
                    <span className="relative w-12 h-12 rounded-full grid place-items-center bg-red-600 text-white ring-4 ring-red-100"><BIcon size={22} strokeWidth={1.8} /></span>
                    <span className="absolute -bottom-0.5 -right-1 w-5 h-5 rounded-full bg-amber-400 text-amber-950 grid place-items-center ring-2 ring-white"><Check size={11} strokeWidth={3.2} /></span>
                  </span>
                  <p className="text-xs font-black leading-tight text-slate-900">{b.label}</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{b.desc}</p>
                  <span className="mt-auto pt-3 flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-red-700"><BadgeCheck size={13} strokeWidth={2.2} />Diplôme obtenu</span>
                    {b.date && <span className="text-[10px] font-semibold text-slate-400">le {fmtJour(b.date)}</span>}
                  </span>
                </div>
              )
              // Diplôme à obtenir : carte blanche, icône en couleur avec cadenas, ce qu'il reste à faire en évidence
              return (
                <div key={b.id} className="w-full relative rounded-2xl border border-slate-200 hover:border-red-200 bg-white p-4 flex flex-col items-center text-center transition">
                  <span className="relative w-12 h-12 rounded-full grid place-items-center mb-2.5 bg-red-50 text-red-500">
                    <BIcon size={22} strokeWidth={1.8} />
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-slate-900 text-white grid place-items-center ring-2 ring-white" title="À débloquer"><Lock size={10} strokeWidth={2.5} /></span>
                  </span>
                  <p className="text-xs font-black leading-tight text-slate-900">{b.label}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{b.desc}</p>
                  <div className="w-full mt-auto pt-3">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-black text-red-600 text-left leading-tight">{b.reste}</span>
                      <span className="text-[10px] font-black text-white bg-red-600 rounded-md px-1.5 py-0.5 tabular-nums shrink-0 whitespace-nowrap" title={`${b.prog}/${b.cible}`}>{Math.round((1 - b.prog / b.cible) * 100)} % restant</span>
                    </div>
                    <div className="h-2 bg-red-50 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: `${b.prog > 0 ? Math.max(6, (b.prog / b.cible) * 100) : 0}%` }}></div></div>
                  </div>
                </div>
              )
            }

            return (
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-8">Mes stats</h1>

              {historique.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center mb-8">
                  <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg></div>
                  <h3 className="font-black text-slate-900 text-lg mb-2">Commencez à vous entraîner</h3>
                  <p className="text-slate-500 font-medium text-sm mb-6">Vos statistiques apparaîtront ici dès votre premier entraînement.</p>
                  <a href="/maths" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm">Lancer un exercice <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg></a>
                </div>
              ) : (
                <>
                  {/* ----- Chiffres clés : bandeau posé sur le fond, sans cartes ----- */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 mb-8">
                    <div className="pr-4 lg:pr-6 text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-red-600">Total exercices</p>
                      <p className="text-4xl font-black text-slate-900 tabular-nums leading-none mt-2">{totalExos}</p>
                    </div>
                    <div className="pl-4 lg:px-6 border-l border-slate-200 text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">Temps total</p>
                      <p className="text-4xl font-black text-slate-900 tabular-nums leading-none mt-2">{totalMin < 60 ? <>{totalMin}<span className="text-xl text-slate-400"> min</span></> : <>{Math.floor(totalMin / 60)}<span className="text-xl text-slate-400">h</span>{totalMin % 60 ? String(totalMin % 60).padStart(2, '0') : ''}</>}</p>
                    </div>
                    <div className="pr-4 lg:px-6 lg:border-l lg:border-slate-200 text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-yellow-600">Meilleure note examen</p>
                      <p className={`text-4xl font-black tabular-nums leading-none mt-2 ${meilleurExamen ? (sur20(meilleurExamen) < 8 ? 'text-red-600' : 'text-slate-900') : 'text-slate-300'}`}>{meilleurExamen ? <>{fmtNote(sur20(meilleurExamen))}<span className="text-xl text-slate-400">/20</span></> : '—'}</p>
                      {!meilleurExamen && <p className="text-xs text-slate-400 font-semibold mt-1.5">Pas encore d&apos;examen blanc</p>}
                    </div>
                    <div className="pl-4 lg:pl-6 border-l border-slate-200 min-w-0 text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-emerald-600">Prochain diplôme</p>
                      {prochain ? (
                        <div className="mt-3 max-w-[220px] mx-auto flex">{carteDiplome(prochain)}</div>
                      ) : (
                        <>
                          <p className="text-xl font-black text-slate-900 leading-tight mt-2.5">Tous obtenus</p>
                          <p className="text-xs text-slate-400 font-semibold mt-1.5">La collection est complète.</p>
                        </>
                      )}
                    </div>
                  </div>
                  {/* ----- Mes notes sur 20 ----- */}
                  <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Mes notes sur 20</h2>
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                          <span className="text-4xl font-black text-slate-900 tabular-nums leading-none">{moyennePeriode != null ? fmtNote(moyennePeriode) : '—'}<span className="text-lg text-slate-400">/20</span></span>
                          {tendance != null && (
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${tendance > 0 ? 'bg-emerald-50 text-emerald-700' : tendance < 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                              {tendance > 0 ? <TrendingUp size={14} strokeWidth={2.2} /> : tendance < 0 ? <TrendingDown size={14} strokeWidth={2.2} /> : null}
                              {tendance > 0 ? '+' : ''}{fmtNote(tendance)} sur vos 3 dernières notes
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-semibold mt-2">Moyenne de la période · {points.length} note{points.length > 1 ? 's' : ''}</p>
                      </div>
                      <div className="flex flex-col items-start lg:items-end gap-2">
                        <div className="inline-flex bg-slate-100 rounded-xl p-1" role="group" aria-label="Période affichée">
                          {[['30', '30 jours'], ['90', '3 mois'], ['tout', 'Tout']].map(([v, l]) => (
                            <button key={v} type="button" aria-pressed={statsPeriode === v} onClick={() => { setStatsPeriode(v); setStatsSurvol(null) }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${statsPeriode === v ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {EPREUVES.map(e => {
                            const off = statsMasques.includes(e.type)
                            return (
                              <button key={e.type} type="button" aria-pressed={!off} onClick={() => { setStatsMasques(m => off ? m.filter(t => t !== e.type) : [...m, e.type]); setStatsSurvol(null) }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold transition cursor-pointer ${off ? 'border-slate-200 text-slate-400 bg-white line-through' : 'border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100'}`}>
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: off ? '#cbd5e1' : e.couleur }}></span>{e.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none" role="img" aria-label="Courbe de vos notes sur 20, avec la zone éliminatoire sous 8 sur 20">
                        <rect x={G} y={py(8)} width={pw} height={py(0) - py(8)} fill="#fef2f2" />
                        {[5, 10, 15, 20].map(v => <line key={v} x1={G} x2={W - D} y1={py(v)} y2={py(v)} stroke="#f1f5f9" />)}
                        <line x1={G} x2={W - D} y1={py(8)} y2={py(8)} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5 4" />
                        {[0, 5, 8, 10, 15, 20].map(v => <text key={v} x={G - 8} y={py(v) + 4} textAnchor="end" fontSize="11" fontWeight={v === 8 ? 800 : 600} fill={v === 8 ? '#ef4444' : '#94a3b8'}>{v}</text>)}
                        <text x={W - D - 6} y={py(0) - 8} textAnchor="end" fontSize="11" fontWeight="700" fill="#ef4444">Zone éliminatoire · moins de 8/20</text>
                        {courbe && <path d={courbe} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />}
                        {points.map((p, i) => (
                          <circle key={i} cx={px(i)} cy={py(p.n)} r={survol === i ? 8 : i === points.length - 1 ? 7 : 5.5} fill={couleurType[p.type]} stroke="#fff" strokeWidth="2.5" style={{ cursor: 'pointer', transition: 'r 0.15s' }} onMouseEnter={() => setStatsSurvol(i)} onMouseLeave={() => setStatsSurvol(null)} onClick={() => setStatsSurvol(survol === i ? null : i)} />
                        ))}
                        {ticksX.map(i => <text key={i} x={px(i)} y={H - 8} textAnchor={points.length === 1 ? 'middle' : i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'} fontSize="11" fontWeight="600" fill="#94a3b8">{fmtJour(points[i].date)}</text>)}
                      </svg>
                      {survol != null && (() => {
                        const p = points[survol]
                        const xPct = (px(survol) / W) * 100
                        return (
                          <div className="absolute pointer-events-none bg-slate-900 text-white rounded-xl px-3 py-2 shadow-lg whitespace-nowrap" style={{ left: `${xPct}%`, top: `${(py(p.n) / H) * 100}%`, transform: `translate(-${Math.min(85, Math.max(15, xPct))}%, calc(-100% - 14px))` }}>
                            <p className="text-[11px] font-semibold text-slate-400">{fmtJour(p.date)} · {labelType[p.type]}</p>
                            <p className="text-sm font-black tabular-nums">{fmtNote(p.n)}/20</p>
                          </div>
                        )
                      })()}
                      {points.length === 0 && <div className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-400">Aucune note sur cette période</div>}
                    </div>
                    <p className="text-xs text-slate-400 font-semibold mt-3 flex items-center gap-2"><span className="inline-block w-5 h-[3px] bg-slate-900 rounded-full"></span>Moyenne glissante sur vos 3 dernières notes · survolez un point pour le détail</p>
                  </section>

                  {/* ----- Par épreuve ----- */}
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Par épreuve</h2>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-8">
                    <p className="text-sm font-bold text-slate-900 mb-3">Répartition de vos {totalExos} exercice{totalExos > 1 ? 's' : ''}</p>
                    <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
                      {repartition.map(e => <span key={e.type} title={`${e.label} : ${e.n}`} style={{ width: `${(e.n / totalExos) * 100}%`, backgroundColor: e.couleur }}></span>)}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                      {repartition.map(e => <span key={e.type} className="text-xs font-semibold text-slate-600 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: e.couleur }}></span>{e.label} <b className="text-slate-900 tabular-nums">{e.n}</b></span>)}
                    </div>
                  </div>
                  {/* ----- Régularité + entraînement ciblé ----- */}
                  <div className="grid lg:grid-cols-5 gap-4 mb-8">
                    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Régularité</h2>
                        <span className="text-xs text-slate-400 font-semibold">{joursActifs16} jour{joursActifs16 > 1 ? 's' : ''} actif{joursActifs16 > 1 ? 's' : ''} sur 16 semaines</span>
                      </div>
                      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `auto repeat(${NB_SEM}, minmax(0, 1fr))` }}>{grille}</div>
                      <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] font-bold text-slate-400">
                        Moins {[0, 1, 2, 3].map(n => <span key={n} className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: couleurCase(n) }}></span>)} Plus
                      </div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Entraînement ciblé</h2>
                        <span className="text-xs text-slate-400 font-semibold">dernier score</span>
                      </div>
                      {cibles.map(c => {
                        const ratio = c.dernier ? c.dernier.note / c.dernier.max : 0
                        return (
                          <div key={c.nom} className="py-2.5 border-t border-slate-100 first:border-t-0">
                            <div className="flex items-center justify-between gap-2 text-sm font-bold">
                              <span className="text-slate-700 truncate">{c.nom}</span>
                              <span className={`tabular-nums ${c.dernier ? 'text-slate-900' : 'text-slate-300'}`}>{c.dernier ? `${c.dernier.note}/${c.dernier.max}` : '—'}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden"><div className={`h-full rounded-full ${ratio < 0.5 ? 'bg-red-400' : 'bg-blue-500'}`} style={{ width: `${ratio * 100}%` }}></div></div>
                            <p className="text-[11px] text-slate-400 font-semibold mt-1">{c.series ? `${c.series} série${c.series > 1 ? 's' : ''} faite${c.series > 1 ? 's' : ''}` : 'Jamais tentée'}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* ----- Diplômes ----- */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900">Diplômes</h2>
                  <span className="text-xs text-slate-400 font-semibold">{unlockedCount}/{badges.length} débloqués</span>
                </div>
                {(() => {
                  const carte = carteDiplome

                  // Chemin des diplômes, du plus simple au plus exigeant : grille en serpentin (une ligne de gauche
                  // à droite, la suivante de droite à gauche) sur 2, 3 puis 5 colonnes selon la largeur d'écran.
                  // Le trait est plein entre deux diplômes obtenus, pointillé gris ensuite.
                  const ORDRE = ['premier-pas', 'regulier', 'polyvalent', 'studieux', 'assidu', 'marathonien', 'perfectionniste', 'infatigable', 'expert', 'pret']
                  const chemin = ORDRE.map(id => badges.find(b => b.id === id)).filter(Boolean)
                  const placer = C => chemin.map((_, i) => {
                    const r = Math.floor(i / C), p = i % C
                    return { r: r + 1, c: (r % 2 === 0 ? p : C - 1 - p) + 1, dir: i === chemin.length - 1 ? null : Math.floor((i + 1) / C) !== r ? 'bas' : r % 2 === 0 ? 'droite' : 'gauche' }
                  })
                  const DIR = {
                    droite: 'left:100%;right:auto;top:50%;bottom:auto;width:var(--gx);height:0;border-top-width:3px;border-left-width:0;transform:translateY(-50%)',
                    gauche: 'right:100%;left:auto;top:50%;bottom:auto;width:var(--gx);height:0;border-top-width:3px;border-left-width:0;transform:translateY(-50%)',
                    bas: 'top:100%;bottom:auto;left:50%;right:auto;height:var(--gy);width:0;border-left-width:3px;border-top-width:0;transform:translateX(-50%)'
                  }
                  const css = [[2, ''], [3, '(min-width: 640px)'], [5, '(min-width: 1024px)']].map(([C, mq]) => {
                    const regles = `.ch-grille{grid-template-columns:repeat(${C},minmax(0,1fr))}` + placer(C).map((p, i) => `.ch-${i}{grid-row:${p.r};grid-column:${p.c}}` + (p.dir ? `.ch-${i} .ch-lien{${DIR[p.dir]}}` : '')).join('')
                    return mq ? `@media ${mq}{${regles}}` : regles
                  }).join('')
                  return (
                    <>
                      <style>{css}</style>
                      <div className="ch-grille grid gap-x-6 gap-y-8" style={{ '--gx': '1.5rem', '--gy': '2rem' }}>
                        {chemin.map((b, i) => {
                          const suivant = chemin[i + 1]
                          const lien = !suivant ? null : b.unlocked && suivant.unlocked ? 'border-solid border-red-500' : 'border-dashed border-slate-300'
                          return (
                            <div key={b.id} className={`ch-${i} relative flex`}>
                              {lien && <span aria-hidden="true" className={`ch-lien absolute ${lien}`}></span>}
                              {carte(b)}
                            </div>
                          )
                        })}
                      </div>
                    </>
                  )
                })()}
              </div>
            </div>
          )})()}

          {/* ============ MON HISTORIQUE ============ */}
          {page === 'historique' && (() => {

            const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

            const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
            const firstDayOfWeek = (new Date(calYear, calMonth, 1).getDay() + 6) % 7

            // Filtrer l'historique pour le mois affiché
            const monthHistory = historique.filter(h => {
              const d = new Date(h.created_at)
              return d.getMonth() === calMonth && d.getFullYear() === calYear
            }).map(h => {
              const d = new Date(h.created_at)
              return {
                ...h,
                day: d.getDate(),
                time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
              }
            })

            const exercisesByDay = {}
            monthHistory.forEach(h => {
              if (!exercisesByDay[h.day]) exercisesByDay[h.day] = []
              exercisesByDay[h.day].push(h)
            })

            const getTypeColor = (type) => {
              if (type === 'Maths') return 'red'
              if (type === 'Rédaction') return 'purple'
              if (type === 'Examen') return 'yellow'
              if (type === 'Oral') return 'emerald'
              return 'blue'
            }

            const getTypesForDay = (day) => {
              const items = exercisesByDay[day] || []
              return [...new Set(items.map(i => i.type))]
            }

            // Stats
            const totalExercices = historique.length
            const notes = historique.filter(h => h.note != null && h.note_max && h.type !== 'Spécifique')
            const moyenne = notes.length > 0 ? parseFloat((notes.reduce((sum, h) => sum + (h.note / h.note_max) * 20, 0) / notes.length).toFixed(1)) : null
            const meilleur = notes.length > 0 ? parseFloat(Math.max(...notes.map(h => (h.note / h.note_max) * 20)).toFixed(1)) : null
            const totalMinutes = historique.reduce((sum, h) => sum + (h.duration_minutes || 0), 0)
            const totalH = Math.floor(totalMinutes / 60)
            const totalM = totalMinutes % 60

            const prevMonth = () => {
              if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
              else setCalMonth(calMonth - 1)
              setSelectedDay(null)
            }
            const nextMonth = () => {
              if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
              else setCalMonth(calMonth + 1)
              setSelectedDay(null)
            }

            const dayItems = selectedDay ? (exercisesByDay[selectedDay] || []) : []

            return (
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Mon historique</h1>
              <p className="text-slate-500 font-medium text-sm mb-8">Retrouvez vos entraînements passés.</p>

              {/* Stats rapides */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{totalExercices}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Exercices faits</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{moyenne || '—'}<span className="text-sm text-slate-400">/20</span></p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Moyenne</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{meilleur || '—'}<span className="text-sm text-slate-400">/20</span></p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Meilleur score</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{totalMinutes < 60 ? `${totalMinutes} min` : `${totalH}h${totalM > 0 ? String(totalM).padStart(2, '0') : ''}`}</p>
                    <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Temps total</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Calendrier */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:w-[420px] shrink-0">
                  {/* Navigation mois */}
                  <div className="flex items-center justify-between mb-6">
                    <button onClick={prevMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer">
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <h3 className="font-black text-slate-900">{monthNames[calMonth]} {calYear}</h3>
                    <button onClick={nextMonth} className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer">
                      <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6"/></svg>
                    </button>
                  </div>

                  {/* Jours de la semaine */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider py-1">{d}</div>
                    ))}
                  </div>

                  {/* Grille des jours */}
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1
                      const types = getTypesForDay(day)
                      const hasExercises = types.length > 0
                      const isSelected = selectedDay === day
                      const today = new Date()
                      const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                      const dayOfWeek = (new Date(calYear, calMonth, day).getDay())
                      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                      const signupDate = new Date(user?.created_at)
                      const isSignupDay = day === signupDate.getDate() && calMonth === signupDate.getMonth() && calYear === signupDate.getFullYear()

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDay(isSelected ? null : day)}
                          className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-bold transition cursor-pointer relative
                            ${isSelected ? 'bg-red-600 text-white' : isSignupDay ? 'bg-yellow-50 text-yellow-600 border border-yellow-300' : isToday ? 'bg-red-50 text-red-600 border border-red-200' : hasExercises ? 'bg-slate-50 hover:bg-slate-100 text-slate-900' : isWeekend ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                          <span>{day}</span>
                          {hasExercises && !isSelected && (
                            <div className="flex gap-0.5">
                              {types.map(t => (
                                <div key={t} className={`w-1.5 h-1.5 rounded-full ${t === 'Maths' ? 'bg-red-500' : t === 'Rédaction' ? 'bg-purple-500' : t === 'Examen' ? 'bg-yellow-500' : t === 'Oral' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                              ))}
                            </div>
                          )}
                          {hasExercises && isSelected && (
                            <div className="flex gap-0.5">
                              {types.map(t => (
                                <div key={t} className="w-1.5 h-1.5 rounded-full bg-white/70"></div>
                              ))}
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Légende */}
                  <div className="flex items-center gap-3 flex-wrap mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[10px] font-bold text-slate-400">Maths</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold text-slate-400">Rédaction</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-slate-400">Spécifique</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-[10px] font-bold text-slate-400">Examen</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-[10px] font-bold text-slate-400">Oral</span></div>
                  </div>
                </div>

                {/* Détail du jour sélectionné */}
                <div className="flex-1">
                  {selectedDay ? (
                    <div>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">{selectedDay} {monthNames[calMonth]} {calYear}</h3>
                      {(() => {
                        const signupDate = new Date(user?.created_at)
                        const isSignupDay = selectedDay === signupDate.getDate() && calMonth === signupDate.getMonth() && calYear === signupDate.getFullYear()
                        return isSignupDay ? (
                          <div className="bg-white rounded-xl border border-yellow-300 shadow-sm p-4 flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-yellow-100 text-yellow-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-slate-900">Inscription</p>
                              <p className="text-xs text-slate-400 font-medium">Bienvenue sur Prépa FPC !</p>
                            </div>
                            <span className="text-sm font-black text-yellow-500">Jour 1</span>
                          </div>
                        ) : null
                      })()}
                      {dayItems.length > 0 ? (
                        <div className="space-y-3">
                          {dayItems.map(item => {
                            const color = getTypeColor(item.type)
                            const scoreNorm = item.note != null && item.note_max ? (item.note / item.note_max) * 20 : null
                            return (
                              <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color === 'red' ? 'bg-red-100 text-red-600' : color === 'purple' ? 'bg-purple-100 text-purple-600' : color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                  {item.type === 'Maths' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>}
                                  {item.type === 'Rédaction' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>}
                                  {item.type === 'Spécifique' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>}
                                  {item.type === 'Examen' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>}
                                  {item.type === 'Oral' && <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-sm text-slate-900 truncate">{item.label}</p>
                                  <p className="text-xs text-slate-400 font-medium">{item.time}{item.nb_questions ? ` · ${item.nb_questions} questions` : ''}{item.duration_minutes ? ` · ${item.duration_minutes} min` : ''}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  {item.note != null ? (
                                    <span className={`text-sm font-black ${scoreNorm >= 15 ? 'text-emerald-600' : scoreNorm >= 10 ? 'text-amber-600' : 'text-red-600'}`}>{item.note}/{item.note_max}</span>
                                  ) : (
                                    <span className="text-sm font-black text-emerald-600">Terminé</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (() => {
                        const sd = new Date(user?.created_at)
                        const isSd = selectedDay === sd.getDate() && calMonth === sd.getMonth() && calYear === sd.getFullYear()
                        return !isSd ? (
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
                          <p className="text-slate-400 font-bold text-sm">Aucun exercice ce jour-là.</p>
                        </div>
                        ) : null
                      })()}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-slate-100 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </div>
                      <p className="font-bold text-slate-900 mb-1">Sélectionnez un jour</p>
                      <p className="text-sm text-slate-400 font-medium">Cliquez sur un jour du calendrier pour voir vos exercices.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            )
          })()}

          {/* ============ MON COMPTE ============ */}
          {page === 'profil' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Mon compte</h1>
              <p className="text-slate-500 font-medium text-sm mb-8">Gérez vos informations personnelles.</p>
              {profileMsg && <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${profileMsg.startsWith('Erreur') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>{profileMsg}</div>}
              <div className="flex flex-col lg:flex-row lg:items-stretch gap-6">
                <form onSubmit={updateProfile} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5 flex-1">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Adresse email</label>
                    <input type="email" value={email} disabled className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-400 cursor-not-allowed"/>
                    <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Prénom</label>
                      <input type="text" value={newFirstName} onChange={e => setNewFirstName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-transparent outline-none font-medium"/>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Nom</label>
                      <input type="text" value={newLastName} onChange={e => setNewLastName(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white focus:border-transparent outline-none font-medium"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Mot de passe</label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { supabase.auth.resetPasswordForEmail(email); setProfileMsg('Email de réinitialisation envoyé !'); setTimeout(() => setProfileMsg(''), 5000) }} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Modifier le mot de passe
                      </button>
                      <button type="button" onClick={() => isPremium ? handleManageSubscription() : navigateTo('abonnement')} className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer">
                        <BadgeCheck size={16} strokeWidth={2} />
                        {isPremium ? 'Gérer mon abonnement' : 'Devenir Premium'}
                      </button>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={profileSaving} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-red-600/20 text-sm">{profileSaving ? 'Enregistrement...' : 'Sauvegarder'}</button>
                  </div>
                </form>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:w-[380px]">
                  <h3 className="font-black text-slate-900 mb-4">Informations du compte</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 font-medium">Email</span><span className="font-bold text-slate-900">{email}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 font-medium">Membre depuis</span><span className="font-bold text-slate-900">{createdAt}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 font-medium">Connexion</span><span className="font-bold text-slate-900">{user?.app_metadata?.provider === 'google' ? 'Google' : 'Email'}</span></div>
                    <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500 font-medium">Dernière connexion</span><span className="font-bold text-slate-900">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</span></div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Email vérifié</span>
                      {user?.email_confirmed_at ? (
                        <span className="flex items-center gap-1.5 text-red-600 font-bold"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Vérifié</span>
                      ) : (
                        <button onClick={async () => { await supabase.auth.resend({ type: 'signup', email }); setProfileMsg('Email de vérification envoyé !') }} className="bg-amber-400 hover:bg-amber-500 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                          Vérifier mon email
                        </button>
                      )}
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Premium</span>
                      {isPremium ? (
                        <span className="text-red-600 font-bold">Oui</span>
                      ) : (
                        <span className="text-slate-400 font-bold">Non</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ DEVENIR PREMIUM ============ */}
          {page === 'abonnement' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Devenir Premium</h1>
              <p className="text-slate-500 font-medium text-sm mb-8">Choisissez la formule qui s'adapte le plus à votre besoin.</p>
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-[90%]">

                {/* Essai Gratuit */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col transition hover:shadow-md">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Essai Gratuit</h3>
                    <p className="text-slate-500 font-bold text-sm">Testez la plateforme pendant 7 jours.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">0€</span>
                      <span className="text-slate-500 font-bold">/ 7 jours</span>
                    </div>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase">Sans carte bancaire</p>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-3 mb-8">
                      {["Entraînement rédaction et mathématique illimités", "Entrainement à partir d'annales", "Examen blanc écrit", "Dashboard personnalisable", "Méthodologie Dossier & Oral"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-sm">
                          <div className="bg-slate-200 p-0.5 rounded-md shrink-0"><svg className="w-3.5 h-3.5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-700 font-black rounded-xl text-center text-sm">{trialDays === 0 ? 'Expiré' : `Expire dans ${trialDays} jour${trialDays > 1 ? 's' : ''}`}</div>
                </div>

                {/* Formule Mensuelle */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col transition hover:shadow-md">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Formule Mensuelle</h3>
                    <p className="text-slate-500 font-bold text-sm">Flexibilité totale, sans engagement.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 text-red-600">
                      <span className="text-3xl font-black tracking-tight">12,99€</span>
                      <span className="text-slate-500 font-bold">/mois</span>
                    </div>
                    <p className="text-red-500 text-xs font-bold mt-1 uppercase">Renouvellement automatique</p>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-3 mb-8">
                      {["Entraînement rédaction et mathématique illimités", "Entrainement à partir d'annales", "Examen blanc écrit", "Dashboard personnalisable", "Résiliable à tout moment"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-sm">
                          <div className="bg-red-100 p-0.5 rounded-md shrink-0"><svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleCheckout('monthly')} disabled={checkoutLoading} className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-center transition shadow-lg shadow-red-200 text-sm cursor-pointer disabled:opacity-50">{checkoutLoading ? 'Redirection...' : "S'abonner maintenant"}</button>
                </div>

                {/* Pack Sérénité */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-red-600 shadow-lg shadow-red-100 relative flex flex-col overflow-hidden">
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">40% d'Économie</div>
                  </div>
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900 mb-1 uppercase tracking-tight">Pack Sérénité</h3>
                    <p className="text-slate-500 font-bold text-sm">Accès complet pendant 1 an.</p>
                  </div>
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 text-red-600">
                      <span className="text-3xl font-black tracking-tight">89,99€</span>
                      <span className="text-slate-500 font-bold">pour 1 an</span>
                    </div>
                    <p className="text-red-500 text-xs font-black mt-1 uppercase">1 seul paiement · Pas de renouvellement</p>
                  </div>
                  <div className="flex-1">
                    <ul className="space-y-3 mb-8">
                      {["Entraînement rédaction et mathématique illimités", "Entrainement à partir d'annales", "Examen blanc écrit", "Dashboard personnalisable", "Méthodologie Dossier & Oral"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-900 font-bold text-sm">
                          <div className="bg-red-100 p-0.5 rounded-md shrink-0"><svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleCheckout('yearly')} disabled={checkoutLoading} className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-center transition shadow-lg shadow-red-200 text-sm cursor-pointer disabled:opacity-50">{checkoutLoading ? 'Redirection...' : "S'abonner maintenant"}</button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}
