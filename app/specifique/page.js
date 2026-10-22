'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { entetesAuth } from '../../lib/entetes-auth'
import { LayoutDashboard, ChartNoAxesColumn, History, CircleUserRound, BadgeCheck, LogOut, Stethoscope, Target, BookOpen, Sparkles, ClipboardCheck, Sigma, Percent, ArrowLeftRight, Equal, ArrowRight } from 'lucide-react'

const sidebarItems = [
  { id: 'dashboard', label: 'Accueil', href: '/dashboard', icon: LayoutDashboard },
  { id: 'progression', label: 'Mes stats', href: '/dashboard?tab=progression', icon: ChartNoAxesColumn },
  { id: 'historique', label: 'Historique', href: '/dashboard?tab=historique', icon: History },
  { id: 'profil', label: 'Compte', href: '/dashboard?tab=profil', icon: CircleUserRound },
  { id: 'abonnement', label: 'Devenir Premium', href: '/dashboard?tab=abonnement', icon: BadgeCheck, premium: true }
]

const familles = [
  {
    id: 'operations',
    symbole: '×÷',
    notions: ['Doses mg/kg', 'Perfusions', 'Dilutions', 'Échelles'],
    titre: 'Produit en croix',
    description: 'Calculs de doses, débits de perfusion, recettes, approvisionnement.',
    icon: Sigma,
    color: 'blue',
    textColor: 'text-blue-600',
    bgIconColor: 'bg-blue-100',
    hoverShadow: 'hover:shadow-blue-500/20',
    borderColor: 'group-hover:border-blue-500/50',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    id: 'pourcentages',
    symbole: '%',
    notions: ['Hausses et baisses', 'TVA', 'Soldes', 'Pièges'],
    titre: 'Pourcentages',
    description: 'Augmentations, remises, TVA, taux d\'intérêt, contextes santé.',
    icon: Percent,
    color: 'blue',
    textColor: 'text-sky-600',
    bgIconColor: 'bg-sky-100',
    hoverShadow: 'hover:shadow-sky-500/20',
    borderColor: 'group-hover:border-sky-500/50',
    gradient: 'from-sky-400 to-blue-500'
  },
  {
    id: 'conversions',
    symbole: '⇄',
    notions: ['µg · mg · g', 'Volumes', 'Durées', 'IMC'],
    titre: 'Conversions & opérations',
    description: 'Masses (µg, mg, g), volumes, durées, fractions, IMC et opérations avec décimaux.',
    icon: ArrowLeftRight,
    color: 'blue',
    textColor: 'text-indigo-600',
    bgIconColor: 'bg-indigo-100',
    hoverShadow: 'hover:shadow-indigo-500/20',
    borderColor: 'group-hover:border-indigo-500/50',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'equations',
    symbole: 'x=',
    notions: ['Âges', 'Moyennes', 'Vitesses', 'Intérêts'],
    titre: 'Équations et problèmes',
    description: 'Problèmes d\'âges, moyennes, vitesse, répartitions, achats.',
    icon: Equal,
    color: 'blue',
    textColor: 'text-violet-600',
    bgIconColor: 'bg-violet-100',
    hoverShadow: 'hover:shadow-violet-500/20',
    borderColor: 'group-hover:border-violet-500/50',
    gradient: 'from-indigo-500 to-violet-600'
  }
]

const colorMap = {
  operations: { text: 'text-sky-500', iconBg: 'bg-sky-100', gradient: 'from-[#7DD3FC] to-[#38BDF8]', badge: 'bg-sky-50 text-sky-600', wrapper: 'bg-sky-100', progressBar: 'bg-sky-400', ring: 'focus:ring-sky-300 focus:border-sky-400', dropColor: '#38BDF8' },
  conversions: { text: 'text-blue-500', iconBg: 'bg-blue-100', gradient: 'from-[#38BDF8] to-[#3B82F6]', badge: 'bg-blue-50 text-blue-600', wrapper: 'bg-blue-100', progressBar: 'bg-blue-500', ring: 'focus:ring-blue-300 focus:border-blue-400', dropColor: '#3B82F6' },
  pourcentages: { text: 'text-indigo-500', iconBg: 'bg-indigo-100', gradient: 'from-[#3B82F6] to-[#6366F1]', badge: 'bg-indigo-50 text-indigo-600', wrapper: 'bg-indigo-100', progressBar: 'bg-indigo-500', ring: 'focus:ring-indigo-300 focus:border-indigo-400', dropColor: '#6366F1' },
  equations: { text: 'text-indigo-600', iconBg: 'bg-indigo-100', gradient: 'from-[#6366F1] to-[#4F46E5]', badge: 'bg-indigo-50 text-indigo-700', wrapper: 'bg-indigo-100', progressBar: 'bg-indigo-600', ring: 'focus:ring-indigo-300 focus:border-indigo-500', dropColor: '#4F46E5' }
}

// Nuée de points en arrière-plan du chargement, reprise de Prépa POLICE (NueeChargement) :
// les points dérivent lentement, sont effacés en douceur autour de la carte blanche (.la-frame)
// et restent immobiles si l'utilisateur a demandé à réduire les animations.
// couleur : "r,g,b" de la couleur du module (rouge pour les maths).
function NueeChargement({ couleur = '220,38,38', carte: selecteurCarte = '.la-frame' }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0
    const points = []
    const nouveau = (i) => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.26, phase: Math.random() * Math.PI * 2, lot: i % 3 })
    const mesurer = () => {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight
      if (nw === w && nh === h) return
      if (w && h) for (const p of points) { p.x *= nw / w; p.y *= nh / h }
      w = nw; h = nh
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const nb = Math.max(300, Math.min(2000, Math.round((w * h) / 480)))
      while (points.length < nb) points.push(nouveau(points.length))
      points.length = nb
    }
    const dessiner = () => {
      ctx.clearRect(0, 0, w, h)
      // Trois lots d'opacité différente pour donner de la profondeur
      for (let lot = 0; lot < 3; lot++) {
        ctx.beginPath()
        for (const p of points) {
          if (p.lot !== lot) continue
          ctx.moveTo(p.x + 1.4, p.y)
          ctx.arc(p.x, p.y, 1.4, 0, 6.2832)
        }
        ctx.fillStyle = `rgba(${couleur},${(0.2 + lot * 0.08).toFixed(2)})`
        ctx.fill()
      }
      const carte = document.querySelector(selecteurCarte)
      if (carte) {
        const base = canvas.getBoundingClientRect(), r = carte.getBoundingClientRect()
        ctx.save()
        ctx.globalCompositeOperation = 'destination-out'
        ctx.shadowColor = '#000'
        ctx.shadowBlur = 40 * dpr
        ctx.fillStyle = '#000'
        ctx.fillRect(r.left - base.left - 6, r.top - base.top - 6, r.width + 12, r.height + 12)
        ctx.restore()
      }
    }
    mesurer(); dessiner()
    if (reduit) {
      const figer = () => { mesurer(); dessiner() }
      window.addEventListener('resize', figer)
      return () => window.removeEventListener('resize', figer)
    }
    let raf = 0
    const boucle = (now) => {
      mesurer()
      const s = now / 1000
      for (const p of points) {
        p.x += p.vx + Math.sin(s * 0.6 + p.phase) * 0.12
        p.y += p.vy + Math.cos(s * 0.5 + p.phase) * 0.1
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10
      }
      dessiner()
      raf = requestAnimationFrame(boucle)
    }
    raf = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(raf)
  }, [couleur, selecteurCarte])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} aria-hidden="true" />
}

// Double hélice d'ADN de l'écran de choix : les deux brins tournent lentement autour de l'axe,
// dix paires de bases par tour comme dans la vraie molécule (A-T et G-C, quatre nuances de bleu),
// et une lueur glisse vers la notion survolée ou sélectionnée ; au survol, l'hélice gonfle autour
// de la notion et accélère. Relief : brins de devant épais avec reflet, arrière plus fin et plus pâle,
// ombre portée sous l'hélice. ouverture : l'hélice s'ouvre comme une fermeture éclair (lancement).
// Horizontale si le canvas est plus large que haut, verticale sinon (mobile).
// Immobile si l'utilisateur a demandé à réduire les animations.
// nb : nombre de notions posées sur l'axe (centres en (2i+1)/2nb de la longueur), actif / survol : index.
function HeliceADN({ nb = 4, actif = 0, survol = null, ouverture = false }) {
  const canvasRef = useRef(null)
  const etatRef = useRef({ actif, survol, ouverture })
  const redessinerRef = useRef(null)
  useEffect(() => {
    etatRef.current = { actif, survol, ouverture }
    if (redessinerRef.current) redessinerRef.current()
  }, [actif, survol, ouverture])
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Brin bleu et brin ciel ; couleurs mélangées au blanc de la carte plutôt que transparentes,
    // pour que les petits segments qui se chevauchent ne fassent pas de points plus foncés
    const BRINS = [{ signe: 1, rgb: [37, 99, 235] }, { signe: -1, rgb: [56, 189, 248] }]
    // Bases : A-T et G-C, chacune sa nuance de bleu, dans une séquence fixe d'aspect aléatoire
    const BASES = { A: [37, 99, 235], T: [56, 189, 248], G: [99, 102, 241], C: [34, 211, 238] }
    const PAIRES = [['A', 'T'], ['T', 'A'], ['G', 'C'], ['C', 'G']]
    const paire = (j) => PAIRES[Math.floor(Math.abs(Math.sin(j * 12.9898 + 4.1) * 43758.5453)) % 4]
    const melange = (rgb, a) => rgb.map(v => 255 + (v - 255) * Math.max(0, Math.min(1, a)))
    const css = (c) => `rgb(${c.map(Math.round).join(',')})`
    const teinte = (rgb, a) => css(melange(rgb, a))
    let w = 0, h = 0, centre = null
    const mesurer = () => {
      const nw = canvas.offsetWidth, nh = canvas.offsetHeight
      if (nw === w && nh === h) return
      w = nw; h = nh
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const dessiner = (phi, apparition, glisse, gonfle, ouv) => {
      ctx.clearRect(0, 0, w, h)
      if (!w || !h) return
      const vertical = h > w
      const L = vertical ? h : w, S = vertical ? w : h
      const A = Math.min(S * 0.3, 58)
      const ech = Math.max(0.6, A / 58)
      const lambda = L / nb
      const k = 2 * Math.PI / lambda
      const pas = lambda / 10
      const point = (u, decalage) => vertical ? [S / 2 + decalage, u] : [u, S / 2 + decalage]
      const fin = L * apparition
      const e = etatRef.current
      const cible = (2 * (e.survol ?? e.actif) + 1) / (2 * nb) * L
      centre = centre === null || !glisse ? cible : centre + (cible - centre) * 0.12
      const lueur = (u) => Math.max(0, 1 - Math.abs(u - centre) / (lambda * 0.55))
      // Fermeture éclair : derrière le front d'ouverture, les brins s'écartent et s'effacent
      const Z = lambda * 0.6, front = ouv * (L + 2 * Z) - Z
      const ouvert = (u) => Math.max(0, Math.min(1, (front - u) / Z))
      const fondu = (u) => Math.max(0, Math.min(1, u / 32, (L - u) / 32, (fin - u) / 24)) * (1 - ouvert(u))
      const decal = (u, signe) => signe * (A * (1 + 0.16 * gonfle * lueur(u)) * Math.sin(k * u + phi) + ouvert(u) * S * 0.45)
      // Tracés regroupés par couleur et taille (arrondies) : quelques dizaines d'appels de dessin par image
      // au lieu d'un par petit segment, sinon l'animation saccade
      const q = (v, n) => Math.round(v * n) / n
      const traits = new Map(), disques = new Map()
      const lot = (lots, rgb, a, taille) => {
        const qa = q(a, 20), qt = q(taille, 4), cle = rgb.join() + '|' + qa + '|' + qt
        let l = lots.get(cle)
        if (!l) lots.set(cle, l = { style: teinte(rgb, qa), taille: qt, pts: [] })
        return l.pts
      }
      const trait = (rgb, a, largeur, [x0, y0], [x1, y1]) => lot(traits, rgb, a, largeur).push(x0, y0, x1, y1)
      const disque = (rgb, a, r, [x, y]) => lot(disques, rgb, a, r).push(x, y)
      const vider = () => {
        ctx.lineCap = 'round'
        for (const l of traits.values()) {
          ctx.strokeStyle = l.style; ctx.lineWidth = l.taille; ctx.beginPath()
          for (let i = 0; i < l.pts.length; i += 4) { ctx.moveTo(l.pts[i], l.pts[i + 1]); ctx.lineTo(l.pts[i + 2], l.pts[i + 3]) }
          ctx.stroke()
        }
        for (const l of disques.values()) {
          ctx.fillStyle = l.style; ctx.beginPath()
          for (let i = 0; i < l.pts.length; i += 2) { ctx.moveTo(l.pts[i] + l.taille, l.pts[i + 1]); ctx.arc(l.pts[i], l.pts[i + 1], l.taille, 0, 6.2832) }
          ctx.fill()
        }
        traits.clear(); disques.clear()
      }
      // Ombre portée sous l'hélice : simple dégradé elliptique (un flou de canvas coûte trop à chaque image)
      if (!vertical && ouv < 1) {
        const opacite = 0.16 * apparition * (1 - ouv)
        ctx.save()
        ctx.translate(L / 2, S / 2 + A + 16)
        ctx.scale(L * 0.42 * apparition + 0.1, 9)
        const degrade = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
        degrade.addColorStop(0, `rgba(30,64,175,${opacite.toFixed(3)})`)
        degrade.addColorStop(1, 'rgba(30,64,175,0)')
        ctx.fillStyle = degrade
        ctx.beginPath(); ctx.arc(0, 0, 1, 0, 6.2832); ctx.fill()
        ctx.restore()
      }
      // Brins : la profondeur (cos) règle épaisseur et intensité ; l'arrière est plus fin et plus pâle
      const brins = (devant) => {
        for (const b of BRINS) {
          for (let u = 0; u < fin; u += 3) {
            const u1 = Math.min(u + 3, fin), m = (u + u1) / 2
            const z = b.signe * Math.cos(k * m + phi)
            if ((z >= 0) !== devant) continue
            const f = fondu(m)
            if (f <= 0) continue
            const t = (z + 1) / 2
            trait(b.rgb, (0.2 + 0.8 * t) * f, (2 + 3.2 * t) * ech, point(u, decal(u, b.signe)), point(u1, decal(u1, b.signe)))
          }
        }
      }
      // Reflet : fin trait plus clair sur le dessus des brins les plus proches, côté lumière
      // (éclaircir vers le blanc revient à baisser l'intensité du mélange)
      const reflets = () => {
        for (const b of BRINS) {
          for (let u = 0; u < fin; u += 3) {
            const u1 = Math.min(u + 3, fin), m = (u + u1) / 2
            const t = (b.signe * Math.cos(k * m + phi) + 1) / 2
            const f = fondu(m)
            if (t <= 0.62 || f <= 0) continue
            const lw = (2 + 3.2 * t) * ech, r = lw * 0.2
            trait(b.rgb, (0.2 + 0.8 * t) * f * (1 - 0.55 * (t - 0.62) / 0.38), lw * 0.28, point(u, decal(u, b.signe) - r), point(u1, decal(u1, b.signe) - r))
          }
        }
      }
      const perles = (devant) => {
        for (let j = 0; (j + 0.5) * pas < fin; j++) {
          const u = (j + 0.5) * pas
          const f = fondu(u)
          if (f <= 0) continue
          for (const b of BRINS) {
            const z = b.signe * Math.cos(k * u + phi)
            if ((z >= 0) !== devant) continue
            const t = (z + 1) / 2
            disque(b.rgb, (0.3 + 0.7 * t) * f, (1.5 + 2.3 * t) * ech, point(u, decal(u, b.signe)))
          }
        }
      }
      // Paires de bases : une base de chaque côté, allumées près de la notion survolée ou sélectionnée ;
      // à l'ouverture, chaque moitié se rétracte vers son brin
      const barreaux = () => {
        for (let j = 0; (j + 0.5) * pas < fin; j++) {
          const u = (j + 0.5) * pas
          const f = fondu(u)
          if (f <= 0) continue
          const g = lueur(u), o = ouvert(u)
          const [xa, ya] = point(u, decal(u, 1)), [xb, yb] = point(u, decal(u, -1))
          const xm = (xa + xb) / 2, ym = (ya + yb) / 2
          const [ba, bb] = paire(j)
          const largeur = (1.8 + 1.4 * g) * ech, a = (0.24 + 0.7 * g) * f
          trait(BASES[ba], a, largeur, [xa, ya], [xa + (xm - xa) * (1 - o), ya + (ym - ya) * (1 - o)])
          trait(BASES[bb], a, largeur, [xb, yb], [xb + (xm - xb) * (1 - o), yb + (ym - yb) * (1 - o)])
        }
      }
      // Arrière, puis barreaux, puis l'avant avec ses reflets par-dessus
      brins(false); perles(false); vider()
      barreaux(); vider()
      brins(true); perles(true); vider()
      reflets(); vider()
    }
    mesurer()
    if (reduit) {
      redessinerRef.current = () => { mesurer(); dessiner(0, 1, false, 0, 0) }
      redessinerRef.current()
      const figer = () => redessinerRef.current()
      window.addEventListener('resize', figer)
      return () => { window.removeEventListener('resize', figer); redessinerRef.current = null }
    }
    let raf = 0, t0 = null, prec = 0, phi = 0, vitesse = 1, gonfle = 0, ouv = 0
    const boucle = (now) => {
      if (t0 === null) { t0 = now; prec = now }
      const dt = Math.min(0.05, Math.max(0, (now - prec) / 1000))
      prec = now
      const t = Math.max(0, (now - t0) / 1000)
      const e = etatRef.current
      const survole = e.survol !== null && e.survol !== undefined
      vitesse += ((survole ? 2.4 : 1) - vitesse) * 0.06
      gonfle += ((survole ? 1 : 0) - gonfle) * 0.08
      phi += dt * 0.55 * vitesse
      ouv = e.ouverture ? Math.min(1, ouv + dt / 0.7) : 0
      const a = Math.min(1, t / 1.1)
      mesurer()
      dessiner(phi, 1 - Math.pow(1 - a, 3), true, gonfle, ouv)
      raf = requestAnimationFrame(boucle)
    }
    raf = requestAnimationFrame(boucle)
    return () => cancelAnimationFrame(raf)
  }, [nb])
  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} aria-hidden="true" />
}

// Anneau autour d'une pastille de notion : se remplit selon le meilleur score obtenu (ratio de 0 à 1)
function AnneauScore({ ratio }) {
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="#e2e8f0" strokeWidth="5" />
      {ratio > 0 && <circle cx="50" cy="50" r="46" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" pathLength="100" strokeDasharray={`${ratio * 100} 100`} />}
    </svg>
  )
}

export default function SpecifiquePage() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAccessBlock, setShowAccessBlock] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [showInfoPopup, setShowInfoPopup] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [step, setStep] = useState('choix') // null, choix, epreuve, correcting, resultat
  const [selectedFamille, setSelectedFamille] = useState(null)
  const [sujet, setSujet] = useState(null)
  const [error, setError] = useState('')
  const [loadingFamille, setLoadingFamille] = useState(null)
  const [correction, setCorrection] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(0)
  // Notion sélectionnée sur l'écran de choix (double hélice d'ADN)
  const [choix, setChoix] = useState('operations')
  // Notion survolée (aperçu sur l'hélice), ouverture de l'hélice au lancement, meilleur score par notion
  const [survol, setSurvol] = useState(null)
  const [ouverture, setOuverture] = useState(false)
  const [scores, setScores] = useState({})

  // Réponses saisies et questions corrigées (toutes les questions sont affichées en liste)
  const [reponses, setReponses] = useState({})
  const [validated, setValidated] = useState({})

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/auth'; return }
      setUser(session.user)
      // Meilleur score de chaque notion (anneau et ligne sous les pastilles de l'écran de choix)
      supabase.from('historique').select('label, note, note_max').eq('user_id', session.user.id).eq('type', 'Spécifique').then(({ data: lignes }) => {
        const meilleurs = {}
        for (const f of familles) {
          const s = (lignes || []).filter(l => l.label === f.titre && l.note != null && l.note_max)
          if (!s.length) continue
          const best = s.reduce((a, l) => l.note / l.note_max > a.note / a.note_max ? l : a)
          meilleurs[f.id] = { note: best.note, max: best.note_max, series: s.length }
        }
        setScores(meilleurs)
      })
      const { data: sub } = await supabase.from('subscriptions').select('status, current_period_end').eq('user_id', session.user.id).eq('status', 'active').single()
      const hasSub = sub && new Date(sub.current_period_end) > new Date()
      if (hasSub) setIsPremium(true)
      const trialMs = 7 * 24 * 60 * 60 * 1000 - (Date.now() - new Date(session.user.created_at))
      if (!hasSub && trialMs <= 0) { setShowAccessBlock(true); setAuthLoading(false); return }
      setAuthLoading(false)
      const skipPopup = session.user.user_metadata?.specifique_skip_info === true || localStorage.getItem('specifique_skip_info') === 'true'
      if (!skipPopup) {
        setShowInfoPopup(true)
        setStep(null)
      }
    })
  }, [])

  // Progression du chargement — asymptotique : rapide au début, ralentit vers 99 % (remise à 0 au lancement)
  useEffect(() => {
    if (step !== 'loading') return
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      // L'horodatage de la première image peut précéder t0 : sans ce plancher, t < 0 et Math.pow renvoie NaN
      const t = Math.max(0, (now - t0) / 1000)
      setLoadingProgress(99 * (1 - Math.exp(-Math.pow(t, 1.5) / 18)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [step])

  async function startExercice(famille) {
    setSelectedFamille(famille)
    setLoadingFamille(famille.id)
    setLoadingProgress(0)
    setStep('loading')
    setError('')
    setSujet({ questions: [] })
    setReponses({})
    setValidated({})

    try {
      const res = await fetch('/api/specifique', {
        method: 'POST',
        headers: await entetesAuth({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ action: 'generer', famille: famille.id })
      })
      const data = await res.json()
      // Session expirée → reconnexion ; essai terminé (contrôlé par le serveur) → écran dédié
      if (res.status === 401) { window.location.assign('/auth'); return }
      if (res.status === 403) { setLoadingFamille(null); setStep('choix'); setShowAccessBlock(true); return }
      if (!res.ok || data.error) {
        setError(data.error || 'Erreur lors de la génération.')
        setLoadingFamille(null)
        setStep('choix')
        return
      }
      setSujet(data.sujet)
      setLoadingFamille(null)
      setStep('epreuve')
    } catch (err) {
      setError('Erreur de connexion. Réessayez.')
      setLoadingFamille(null)
      setStep('choix')
    }
  }

  // Lancement depuis l'écran de choix : l'hélice s'ouvre comme une fermeture éclair, puis la série démarre
  function lancer(f) {
    if (loadingFamille || ouverture) return
    setChoix(f.id)
    setOuverture(true)
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTimeout(() => { setOuverture(false); startExercice(f) }, reduit ? 0 : 750)
  }

  // Validation d'une question : la correction s'ouvre à droite (sous la question sur mobile), puis la
  // question suivante remonte sous le bandeau, prête à la saisie (comme le QCM de Prépa POLICE).
  // Le délai laisse le verdict s'afficher d'abord.
  function valider(q, idx) {
    if (validated[q.id]) return
    // Extraire uniquement la partie numérique des réponses
    const normalize = (val) => {
      let s = String(val).trim().replace(/,/g, '.').replace(/\s/g, '')
      // Extraire le dernier nombre (le résultat final si l'élève écrit son raisonnement)
      const matches = s.match(/-?\d+\.?\d*/g)
      return matches ? parseFloat(matches[matches.length - 1]) : NaN
    }
    const userNum = normalize(reponses[q.id] || '')
    const expectedNum = normalize(q.reponse)
    // Comparaison numérique avec tolérance pour les arrondis
    const isCorrect = !isNaN(userNum) && !isNaN(expectedNum) && Math.abs(userNum - expectedNum) < 0.01
    setValidated(prev => ({ ...prev, [q.id]: { correct: isCorrect, reponse_attendue: q.reponse, explication: q.explication || '' } }))
    setTimeout(() => {
      const suivante = document.getElementById(`question-${idx + 2}`)
      if (!suivante) return
      suivante.scrollIntoView({ behavior: 'smooth', block: 'start' })
      const champ = suivante.querySelector('input:not(:disabled)')
      if (champ) champ.focus({ preventScroll: true })
    }, 450)
  }

  async function handleSubmitAll() {
    const totalQuestions = sujet.questions.length
    const correctCount = Object.values(validated).filter(v => v.correct).length
    setCorrection({ note: correctCount, noteMax: totalQuestions })
    // Score de la notion mis à jour pour le retour à l'écran de choix
    setScores(prev => {
      const p = prev[selectedFamille.id]
      const series = (p ? p.series : 0) + 1
      const mieux = !p || correctCount / totalQuestions > p.note / p.max
      return { ...prev, [selectedFamille.id]: mieux ? { note: correctCount, max: totalQuestions, series } : { ...p, series } }
    })
    await supabase.from('historique').insert({
      user_id: user.id,
      type: 'Spécifique',
      label: selectedFamille.titre,
      note: correctCount,
      note_max: totalQuestions,
      nb_questions: totalQuestions,
      duration_minutes: null,
    })
    setStep('resultat')
  }

  // Fin de série automatique (comme le QCM de Prépa POLICE) : dès que toutes les questions sont
  // corrigées, un court délai laisse lire la dernière correction, puis l'écran de résultat s'affiche
  useEffect(() => {
    const total = sujet?.questions?.length || 0
    if (step !== 'epreuve' || total === 0 || Object.keys(validated).length < total) return
    const t = setTimeout(handleSubmitAll, 1500)
    return () => clearTimeout(t)
  }, [validated, step, sujet])

  function restart() {
    setStep('choix'); setSujet(null); setReponses({}); setValidated({}); setError(''); setLoadingFamille(null); setSelectedFamille(null); setCorrection(null)
  }

  function retryFamille() {
    if (selectedFamille) startExercice(selectedFamille)
    else restart()
  }

  async function handleLogout() { await supabase.auth.signOut(); window.location.href = '/' }

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || ''
  const c = selectedFamille ? colorMap[selectedFamille.id] : colorMap.operations
  const nbJustes = Object.values(validated).filter(v => v.correct).length

  if (authLoading) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div><p className="text-sm font-bold text-slate-400" style={{fontFamily: "'Nunito', sans-serif"}}>Ouverture de l'entraînement...</p></div>

  if (showAccessBlock) return (<div className="min-h-screen bg-[#eceef1] flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"><div className="text-5xl mb-3 mx-auto">😢</div><h2 className="text-2xl font-black text-slate-900 mb-2">Votre essai gratuit est terminé</h2><p className="text-slate-500 font-medium mb-6">Pour continuer à vous entraîner et accéder à tous les exercices, souscrivez à un abonnement.</p><div className="flex flex-col gap-3"><a href="/tarifs" className="bg-slate-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl transition shadow-lg text-sm">Voir les tarifs</a><a href="/dashboard" className="text-slate-500 font-medium text-sm hover:text-slate-700 transition">Retour au tableau de bord</a></div></div></div>)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex overflow-x-hidden isolate" style={{fontFamily: "'Nunito', sans-serif"}}>
      {/* Nuée de points animée en fond de page (comme sur les loaders et l'oral), sous le contenu et la barre latérale.
          Les autres étapes ont leur propre calque plein écran : elle n'est affichée que sur l'écran de choix. */}
      {(step === 'choix' || step === null) && (
        <div className="fixed inset-0 top-14 lg:top-0 -z-10 pointer-events-none" aria-hidden="true">
          <NueeChargement couleur="37,99,235" carte=".specifique-carte" />
        </div>
      )}
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Sora:wght@500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-stagger { opacity: 0; transform: translateY(20px); animation: staggerIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes staggerIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .note-rebond { animation: noteRebond 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes noteRebond { from { transform: scale(1.25); } to { transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { .note-rebond { animation: none; } }
      `}</style>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-[45] lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* SIDEBAR */}
      <div className={`fixed top-14 lg:top-0 bottom-0 left-0 z-50 flex items-start lg:items-center pl-0 lg:pl-3 py-0 lg:py-5 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <aside className="w-[84px] bg-white rounded-none rounded-br-2xl lg:rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200/60 border-t-0 lg:border-t flex flex-col items-center py-5 h-full lg:h-[calc(100vh-2.5rem)]" style={{fontFamily: "'Sora', 'Nunito', sans-serif"}}>
          <a href="/" className="mb-4"><div className="w-10 h-10 text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all bg-gradient-to-br from-blue-500 to-blue-600"><Stethoscope size={20} strokeWidth={2.5} /></div></a>
          <div className="w-7 h-px bg-slate-200 mb-3"></div>
          <nav className="flex-1 flex flex-col items-center gap-0.5 w-full px-1.5">
            {sidebarItems.filter(item => !item.premium || !isPremium).map(item => (
              <a key={item.id} href={item.href} className={`w-full flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[11px] font-semibold transition-all text-center group ${item.premium ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600' : 'text-slate-900 hover:bg-blue-50 hover:text-blue-600'}`}>
                {item.premium ? (
                  <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 text-amber-950 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <item.icon size={18} strokeWidth={2} />
                  </span>
                ) : (
                  <item.icon size={20} strokeWidth={1.8} className="transition-transform duration-200 group-hover:scale-125" />
                )}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2 mt-auto pt-3">
            <div className="w-7 h-px bg-slate-200 mb-1"></div>
            <a href="/dashboard?tab=profil" className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold text-xs transition">{firstName.charAt(0).toUpperCase()}</a>
            <button onClick={handleLogout} className="text-slate-900 hover:text-red-500 transition cursor-pointer p-1">
              <LogOut size={16} strokeWidth={1.8} />
            </button>
          </div>
        </aside>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-[102px] max-w-full overflow-x-hidden">
        <header className="lg:hidden h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-50">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg></button>
          <span className="font-black text-lg text-slate-900">Prépa <span className={selectedFamille ? c.text : 'text-red-600'}>FPC</span></span>
          <a href="/dashboard" className="text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </a>
        </header>

        <main className="flex-grow w-full mx-auto px-4 py-4 sm:py-5 overflow-x-hidden">

      {/* ===== POPUP INFO ===== */}
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => { setShowInfoPopup(false); window.location.href = '/dashboard' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-900 px-6 py-5 relative">
              <button onClick={() => { setShowInfoPopup(false); window.location.href = '/dashboard' }} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/15 text-white transition cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <h2 className="text-lg font-black text-white pr-8">Entraînement spécifique</h2>
              <p className="text-slate-400 text-sm font-medium mt-1">Avant de commencer, voici le déroulement de l'épreuve.</p>
            </div>
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {[
                  { icon: <Target size={18} strokeWidth={2} />, title: 'Choisissez votre famille', text: 'Opérations, pourcentages, conversions ou équations : travaillez vos points faibles.' },
                  { icon: <BookOpen size={18} strokeWidth={2} />, title: '10-15 questions par session', text: 'Des exercices ciblés, sans calculatrice, pour progresser efficacement.' },
                  { icon: <Sparkles size={18} strokeWidth={2} />, title: 'Exercices générés par notre IA', text: 'Des exercices spécifiques et ciblées pour progresser rapidement !' },
                  { icon: <ClipboardCheck size={18} strokeWidth={2} />, title: 'Correction détaillée', text: 'Chaque réponse est corrigée avec une explication pas à pas pour comprendre la méthode.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { if (dontShowAgain) { localStorage.setItem('specifique_skip_info', 'true'); supabase.auth.updateUser({ data: { specifique_skip_info: true } }) } setShowInfoPopup(false); setStep('choix') }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-200/50 text-sm flex items-center justify-center gap-2 cursor-pointer mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                C'est parti !
              </button>
              <label className="flex items-center gap-2 cursor-pointer justify-center">
                <input type="checkbox" checked={dontShowAgain} onChange={e => setDontShowAgain(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                <span className="text-xs text-slate-400 font-medium">Ne plus afficher ce message</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ===== CHOIX FAMILLE (double hélice d'ADN) ===== */}
      {step === 'choix' && (
        <div className="animate-fade-in min-h-full lg:min-h-[calc(100vh-2.5rem)] flex items-center justify-center" style={{fontFamily: "'Nunito', sans-serif"}}>
          <div className="specifique-carte relative bg-white border border-slate-200 rounded-[20px] sm:rounded-[28px] max-w-4xl w-full p-5 sm:p-10 overflow-hidden">
            <div className="relative">

              {/* En-tête façon LoaderArc */}
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-xl sm:rounded-2xl grid place-items-center shrink-0">
                  <Target size={26} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600">Concours FPC — entraînement ciblé</h2>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">Entraînement spécifique</h1>
                </div>
                <a href="/dashboard" className="ml-auto shrink-0 bg-slate-900 hover:bg-black text-white font-bold text-sm px-3 py-2.5 sm:px-5 rounded-xl transition flex items-center gap-2">
                  <span className="hidden sm:inline">Quitter l&apos;exercice</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </a>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">Sur quoi on s&apos;entraîne ?</h2>
                <p className="text-[13px] sm:text-[15px] text-slate-500 font-semibold mt-2">Choisissez une notion : 10 questions ciblées, corrigées pas à pas.</p>
              </div>

              {error && <div className="bg-red-50 border border-red-200 text-red-700 font-bold text-sm p-4 rounded-xl mb-5 text-center">{error}</div>}

              {/* Double hélice d'ADN : chaque notion est posée sur l'axe ; survol = aperçu sur l'hélice,
                  clic = sélection, double-clic = lancement. L'anneau autour de la pastille suit le meilleur score. */}
              {(() => {
                const idxChoix = Math.max(0, familles.findIndex(f => f.id === choix))
                const medaillon = (actif) => `relative rounded-full bg-white grid place-items-center transition-all duration-300 ${ouverture ? 'scale-75' : actif ? 'scale-110 shadow-[0_14px_28px_-10px_rgba(37,99,235,0.7)]' : 'shadow-[0_8px_20px_-12px_rgba(37,99,235,0.55)] group-hover:scale-105'}`
                const pastille = (actif) => `rounded-full grid place-items-center font-black leading-none transition-colors duration-300 ${actif ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`
                const ratio = (f) => scores[f.id] ? scores[f.id].note / scores[f.id].max : 0
                const scoreTexte = (f, actif) => {
                  const s = scores[f.id]
                  return s ? <>Meilleur <b className={actif ? 'text-white' : 'text-slate-900'}>{s.note}/{s.max}</b> · {s.series} série{s.series > 1 ? 's' : ''}</> : 'Pas encore travaillée'
                }
                // Étiquette de la notion sous la pastille : carte blanche, bleu plein quand elle est sélectionnée
                const etiquette = (actif) => `rounded-2xl border transition-all duration-300 ${actif ? 'bg-blue-600 border-blue-600 shadow-[0_14px_28px_-12px_rgba(37,99,235,0.75)]' : 'bg-white border-slate-200 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)] group-hover:border-blue-300 group-hover:-translate-y-0.5'}`
                // Le survol n'existe qu'à la souris : sur mobile, un appui le laisserait collé à la notion
                const evenements = (f, idx, survolable) => ({
                  onClick: () => setChoix(f.id),
                  onDoubleClick: () => lancer(f),
                  ...(survolable ? { onMouseEnter: () => setSurvol(idx), onMouseLeave: () => setSurvol(null), onFocus: () => setSurvol(idx), onBlur: () => setSurvol(null) } : {})
                })
                return (
                  <>
                    {/* Ordinateur : hélice horizontale, une notion par colonne */}
                    <div className="hidden sm:block relative max-w-3xl mx-auto">
                      <div className="absolute inset-x-0 top-0 h-[190px]"><HeliceADN nb={familles.length} actif={idxChoix} survol={survol} ouverture={ouverture} /></div>
                      <div className={`relative grid grid-cols-4 transition-opacity duration-500 ${ouverture ? 'opacity-0' : ''}`}>
                        {familles.map((f, idx) => {
                          const actif = idx === idxChoix
                          return (
                            <button key={f.id} type="button" aria-pressed={actif} {...evenements(f, idx, true)} className="animate-stagger group h-full flex flex-col items-stretch text-center px-1.5 pb-2 rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" style={{animationDelay: `${300 + idx * 90}ms`}}>
                              <span className="h-[190px] grid place-items-center">
                                <span className={`w-[104px] h-[104px] ${medaillon(actif)}`}>
                                  <AnneauScore ratio={ratio(f)} />
                                  <span aria-hidden="true" className={`w-20 h-20 text-[30px] ${pastille(actif)}`}>{f.symbole}</span>
                                </span>
                              </span>
                              <span className={`flex-1 flex flex-col justify-center px-3 py-3 ${etiquette(actif)}`}>
                                <span className={`text-[15px] lg:text-base font-black leading-tight transition-colors ${actif ? 'text-white' : 'text-slate-900'}`}>{f.titre}</span>
                                <span className={`text-[11px] font-bold mt-1 transition-colors ${actif ? 'text-blue-100' : 'text-slate-400'}`}>{scoreTexte(f, actif)}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    {/* Mobile : hélice verticale à gauche, une notion par ligne */}
                    <div className="sm:hidden relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[84px]"><HeliceADN nb={familles.length} actif={idxChoix} ouverture={ouverture} /></div>
                      <div className={`relative grid auto-rows-fr transition-opacity duration-500 ${ouverture ? 'opacity-0' : ''}`}>
                        {familles.map((f, idx) => {
                          const actif = idx === idxChoix
                          return (
                            <button key={f.id} type="button" aria-pressed={actif} {...evenements(f, idx, false)} className="animate-stagger group flex items-center gap-2 min-h-[92px] py-1.5 text-left rounded-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" style={{animationDelay: `${300 + idx * 90}ms`}}>
                              <span className="w-[84px] shrink-0 grid place-items-center">
                                <span className={`w-16 h-16 ${medaillon(actif)}`}>
                                  <AnneauScore ratio={ratio(f)} />
                                  <span aria-hidden="true" className={`w-12 h-12 text-lg ${pastille(actif)}`}>{f.symbole}</span>
                                </span>
                              </span>
                              <span className={`flex-1 min-w-0 self-stretch flex flex-col justify-center px-4 py-3 ${etiquette(actif)}`}>
                                <span className={`block text-base font-black leading-tight transition-colors ${actif ? 'text-white' : 'text-slate-900'}`}>{f.titre}</span>
                                <span className={`block text-xs font-bold mt-0.5 transition-colors ${actif ? 'text-blue-100' : 'text-slate-400'}`}>{scoreTexte(f, actif)}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </>
                )
              })()}

              {/* Barre de la notion sélectionnée */}
              {(() => {
                const f = familles.find(x => x.id === choix) || familles[0]
                return (
                  <div className="mt-4 sm:mt-5 max-w-3xl mx-auto border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-black text-slate-900">{f.titre}</p>
                      <p className="text-xs sm:text-[13px] text-slate-500 font-semibold leading-relaxed mt-0.5">{f.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {f.notions.map(n => <span key={n} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{n}</span>)}
                      </div>
                    </div>
                    <button type="button" onClick={() => lancer(f)} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                      Lancer 10 questions <ArrowRight size={18} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })()}

              {/* Série différente à chaque fois */}
              <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold">Une série différente à chaque fois : chiffres, contextes et formulations tirés au sort.</p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ===== LOADING (LoaderArc, comme les autres exercices) ===== */}
      {step === 'loading' && selectedFamille && (() => {
        const STEPS = [
          { label: 'Récupération des annales', desc: 'Lecture des sujets du concours FPC sur cette notion.', at: 0 },
          { label: 'Choix des questions', desc: 'Dix situations différentes : chiffres, contextes et formulations tirés au sort.', at: 25 },
          { label: 'Calibrage de la difficulté', desc: 'Des questions de plus en plus difficiles, jusqu\'au niveau du concours.', at: 55 },
          { label: 'Préparation des corrigés', desc: 'Une explication pas à pas pour chaque question.', at: 85 },
        ]
        const Icon = selectedFamille.icon
        const r = 92
        const circ = 2 * Math.PI * r
        const arcOffset = circ - (loadingProgress / 100) * circ
        const stepIdx = STEPS.reduce((a, s, i) => loadingProgress >= s.at ? i : a, 0)
        return (
          // Calque plein écran comme sur Prépa POLICE : il masque la trame fixe du fond de page
          // et accueille la nuée de points animée, sous la carte (la barre latérale reste au-dessus)
          <div className="animate-fade-in fixed inset-0 z-40 lg:pl-[102px] flex items-center justify-center overflow-y-auto pt-14 lg:pt-0 bg-slate-100" style={{fontFamily: "'Nunito', sans-serif", '--tc-main': '#2563eb', '--tc-bright': '#60a5fa', '--tc-tint': '#dbeafe', '--tc-soft-2': 'rgba(37,99,235,0.08)'}}>
            <style>{`
                  .la-page { padding: 8px; position: relative; z-index: 1; width: 100%; }
                  .la-frame { background: white; border-radius: 20px; border: 1px solid #e2e8f0; padding: 20px 16px 18px; max-width: 880px; margin: 0 auto; width: 100%; position: relative; overflow: hidden; box-sizing: border-box; }
                  @media (min-width: 640px) { .la-frame { padding: 48px 48px 40px; border-radius: 28px; } }
                  .la-frame > * { position: relative; }
                  .lf-head { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
                  @media (min-width: 640px) { .lf-head { gap: 16px; margin-bottom: 28px; } }
                  .lf-icon-chip { width: 44px; height: 44px; border-radius: 12px; background: var(--tc-tint); color: var(--tc-main); display: grid; place-items: center; flex-shrink: 0; }
                  @media (min-width: 640px) { .lf-icon-chip { width: 56px; height: 56px; border-radius: 16px; } }
                  .lf-head-text { flex: 1; min-width: 0; }
                  .lf-head-text h2 { margin: 0; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tc-main); }
                  .lf-head-text h1 { margin: 2px 0 0; font-size: 18px; font-weight: 900; letter-spacing: -0.02em; color: #0f172a; }
                  @media (min-width: 640px) { .lf-head-text h1 { font-size: 24px; } }
                  .lf-title { font-size: 24px; font-weight: 900; letter-spacing: -0.025em; margin: 6px 0 8px; line-height: 1.1; color: #0f172a; }
                  @media (min-width: 640px) { .lf-title { font-size: 42px; margin: 8px 0 12px; line-height: 1.05; } }
                  .lf-title em { font-style: normal; color: var(--tc-main); }
                  .lf-sub { font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 20px; max-width: 540px; font-weight: 600; }
                  @media (min-width: 640px) { .lf-sub { font-size: 15px; line-height: 1.55; margin: 0 0 32px; } }
                  .anim-arc { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 8px 0 4px; flex-wrap: wrap; }
                  @media (min-width: 640px) { .anim-arc { gap: 56px; padding: 16px 0 8px; } }
                  .arc-wrap { position: relative; width: 180px; height: 180px; flex-shrink: 0; }
                  @media (min-width: 640px) { .arc-wrap { width: 220px; height: 220px; } }
                  .arc-svg { transform: rotate(-90deg); width: 100%; height: 100%; }
                  .arc-track { stroke: #f1f5f9; stroke-width: 10; fill: none; }
                  .arc-fill { stroke: var(--tc-main); stroke-width: 10; fill: none; stroke-linecap: round; }
                  .arc-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
                  .arc-icon { width: 36px; height: 36px; border-radius: 12px; background: var(--tc-tint); color: var(--tc-main); display: grid; place-items: center; margin-bottom: 2px; }
                  @media (min-width: 640px) { .arc-icon { width: 44px; height: 44px; border-radius: 14px; margin-bottom: 4px; } }
                  .arc-percent { font-size: 28px; font-weight: 900; letter-spacing: -0.03em; color: #0f172a; line-height: 1; font-variant-numeric: tabular-nums; }
                  @media (min-width: 640px) { .arc-percent { font-size: 36px; } }
                  .arc-count { font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.06em; text-transform: uppercase; }
                  @media (min-width: 640px) { .arc-count { font-size: 12px; letter-spacing: 0.08em; } }
                  .arc-count b { color: var(--tc-main); }
                  .arc-side { flex: 1; min-width: 0; max-width: 320px; text-align: center; }
                  @media (min-width: 640px) { .arc-side { min-width: 220px; text-align: left; } }
                  .arc-step-num { font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--tc-main); margin-bottom: 4px; display: inline-flex; align-items: center; gap: 6px; }
                  .arc-step-num::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--tc-main); }
                  .arc-side h3 { margin: 0 0 6px; font-size: 15px; font-weight: 800; letter-spacing: -0.02em; color: #0f172a; }
                  @media (min-width: 640px) { .arc-side h3 { font-size: 18px; margin: 0 0 8px; } }
                  .arc-side p { margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; }
                  @media (min-width: 640px) { .arc-side p { font-size: 14px; line-height: 1.55; } }
                `}</style>
            <NueeChargement couleur="37,99,235" />
            <div className="la-page">
              <div className="la-frame">
                <div className="lf-head">
                  <div className="lf-icon-chip"><Icon size={26} strokeWidth={1.8} /></div>
                  <div className="lf-head-text">
                    <h2>Concours FPC — entraînement ciblé</h2>
                    <h1>{selectedFamille.titre}</h1>
                  </div>
                  <a href="/dashboard" className="ml-auto shrink-0 bg-slate-900 hover:bg-black text-white font-bold text-sm px-3 py-2.5 sm:px-5 rounded-xl transition flex items-center gap-2">
                    <span className="hidden sm:inline">Quitter l&apos;exercice</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  </a>
                </div>
                <h2 className="lf-title">Vos questions sont <em>en préparation</em>.</h2>
                <p className="lf-sub">10 questions générées à partir de notre base des annales du concours.<br/>Correction détaillée à chaque question.</p>
                <div className="anim-arc">
                  <div className="arc-wrap">
                    <svg className="arc-svg" width="220" height="220" viewBox="0 0 220 220">
                      <circle className="arc-track" cx="110" cy="110" r={r} />
                      <circle className="arc-fill" cx="110" cy="110" r={r} strokeDasharray={circ} strokeDashoffset={arcOffset} />
                    </svg>
                    <div className="arc-center">
                      <div className="arc-icon"><Icon size={22} strokeWidth={1.8} /></div>
                      <div className="arc-percent">{Math.round(loadingProgress)}%</div>
                      <div className="arc-count"><b>10</b> questions</div>
                    </div>
                  </div>
                  <div className="arc-side">
                    <div className="arc-step-num">Étape {stepIdx + 1}/{STEPS.length}</div>
                    <h3>{STEPS[stepIdx].label}</h3>
                    <p>{STEPS[stepIdx].desc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ===== ÉPREUVE — toutes les questions en liste, correction à droite de chaque question =====
          Même disposition que le QCM de culture générale de Prépa POLICE : bandeau noir collant,
          cartes numérotées, panneau de correction à droite (sous la question sur mobile). */}
      {step === 'epreuve' && sujet && selectedFamille && (
        <div className="fixed inset-0 z-40 lg:pl-[102px] bg-[#eef2f8] overflow-y-auto flex flex-col pt-14 lg:pt-0">

          {/* En-tête collant : sa hauteur (64 px ; 70,5 px dès 1024 px) règle le défilement
              après réponse (scroll-mt-[74px] sur les cartes) */}
          <div className="sticky top-0 z-20 bg-[#eef2f8]/90 backdrop-blur shrink-0">
            <div className="max-w-6xl mx-auto px-3 sm:px-5 pt-2 pb-2 lg:pt-5 lg:pb-0">
              <div className="bg-slate-900 rounded-2xl pl-4 pr-2 sm:pl-5 flex items-center gap-2.5 sm:gap-3 h-12 md:h-[54.5px] lg:h-[50.5px]">
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg md:text-[26px] md:leading-tight font-black text-white tracking-tight truncate">{selectedFamille.titre}</h1>
                </div>
                {/* Bonnes réponses en direct sur l'ensemble de la série ; le chiffre rebondit quand il change */}
                <div className="shrink-0 flex items-baseline px-2.5 sm:px-3 py-1.5 sm:py-1 rounded-xl font-black text-base sm:text-lg tabular-nums text-[#60a5fa]" title="Bonnes réponses sur l'ensemble de la série">
                  <span key={nbJustes} className="note-rebond inline-block text-lg sm:text-[22px] leading-none">{nbJustes}</span>
                  <span className="text-white">/{sujet.questions.length}</span>
                </div>
                {/* Masquée sur téléphone : la barre du haut porte déjà la même croix */}
                <a href="/dashboard" title="Quitter l'exercice" aria-label="Quitter l'exercice" className="hidden sm:block shrink-0 p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </a>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-5 py-5">
            {/* Questions jointes dans un seul bloc, séparées par un filet */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-200">
              {sujet.questions.map((q, idx) => {
                const v = validated[q.id]
                return (
                  <div key={q.id} id={`question-${idx + 1}`} className="scroll-mt-[74px]">
                    <div className="lg:flex lg:items-stretch">

                      {/* Numéro, énoncé et réponse */}
                      <div className="flex-1 min-w-0 p-4 sm:p-6">
                        <div className="flex items-start gap-3 mb-4">
                          <span className="w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs text-white bg-slate-900">{idx + 1}</span>
                          <p className="text-sm sm:text-[15px] font-bold text-slate-900 leading-relaxed whitespace-pre-line flex-1 min-w-0 pt-1">{q.question}</p>
                        </div>
                        <div className="flex gap-2 sm:pl-11">
                          <input
                            type="text"
                            className={`flex-1 min-w-0 border rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 disabled:text-slate-900 transition focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 placeholder:text-slate-400 ${v ? (v.correct ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400') : 'bg-slate-50 border-slate-200 hover:border-blue-300'}`}
                            placeholder="Votre réponse..."
                            value={reponses[q.id] || ''}
                            onChange={(e) => setReponses(prev => ({ ...prev, [q.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); valider(q, idx) } }}
                            disabled={!!v}
                          />
                          {!v && (
                            <button onClick={() => valider(q, idx)} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 sm:px-5 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                              Valider <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Panneau de correction, à droite de la question */}
                      {v && (
                        <div className={`lg:w-80 xl:w-96 shrink-0 border-t lg:border-t-0 lg:border-l p-4 sm:p-5 ${v.correct ? 'bg-green-50/70 border-green-200' : 'bg-red-50/70 border-red-200'}`}>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <span className={`inline-flex items-center gap-1.5 font-black text-sm ${v.correct ? 'text-green-600' : 'text-red-600'}`}>
                              {v.correct ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                              )}
                              {v.correct ? 'Correct' : 'Incorrect'}
                            </span>
                            <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${v.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Réponse : {v.reponse_attendue}</span>
                          </div>
                          {v.explication && v.explication.split(/\s*\|\s*/).map((etape, i) => (
                            <p key={i} className="text-[13px] text-slate-600 font-medium leading-relaxed py-0.5">{etape}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

      {/* ===== RÉSULTATS ===== */}
      {step === 'resultat' && correction && selectedFamille && (
        <div className={`fixed inset-0 z-40 lg:pl-[102px] flex flex-col pt-14 lg:pt-0 ${c.wrapper}`}>
          <div className="flex items-center justify-between gap-3 p-4 pt-4 sm:pt-8 shrink-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-800 tracking-tight text-center sm:text-left flex-1" style={{fontFamily: "'Nunito', sans-serif"}}>Entraînement spécifique <span className={c.text}>— {selectedFamille.titre}</span></h1>
            <a href="/dashboard" className="hidden sm:flex bg-slate-900 hover:bg-black text-white font-bold text-sm px-5 py-2.5 rounded-xl transition items-center gap-2 shadow-lg shrink-0">
              Quitter l&apos;exercice
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </a>
          </div>
          <div className="flex-1 flex items-start sm:items-center justify-center px-2 sm:px-4 pb-4 sm:pb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sm:p-12 max-w-md w-full text-center">
            <span className={`${c.badge} px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide uppercase`}>{selectedFamille.titre}</span>
            <div className="flex justify-center items-center my-5">
              <span className={`text-5xl sm:text-7xl font-black ${c.text} tracking-tighter`}>{correction.note}</span>
              <span className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter">/{correction.noteMax}</span>
            </div>
            <p className="text-slate-400 text-sm font-bold mb-8">Ne compte pas dans la moyenne</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={retryFamille} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-5 rounded-xl transition text-sm flex items-center gap-2 cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Recommencer
              </button>
              <a href="/dashboard" className={`bg-gradient-to-r ${c.gradient} text-white font-bold py-3 px-5 rounded-xl transition shadow-lg text-sm flex items-center gap-2`}>
                Dashboard
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </a>
            </div>
          </div>
          </div>
        </div>
      )}

        </main>
      </div>
    </div>
  )
}
