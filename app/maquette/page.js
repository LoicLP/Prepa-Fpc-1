'use client'
import { useState, useEffect, useRef } from 'react'

// MAQUETTE DE TRAVAIL — structure et animations de la home Mobbin recréées de zéro,
// contenus Prépa FPC en placeholder. Base de travail pour la future landing.
// Non reliée à la navigation du site. Ne pas indexer / ne pas déployer telle quelle.

// ---- Données placeholder ----

const MODULES = [
  // Gélule
  { label: 'Calculs de doses', bg: 'linear-gradient(145deg, #ef4444, #dc2626)', ink: '#ffffff', accent: '#dc2626', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg> },
  // Livre ouvert
  { label: 'Rédaction', bg: 'linear-gradient(145deg, #a5b4fc, #818cf8)', ink: '#1e1b4b', accent: '#6366f1', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
  // Stéthoscope
  { label: 'Oral', bg: 'linear-gradient(145deg, #fcd34d, #fbbf24)', ink: '#451a03', accent: '#e5a50c', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg> },
  // Presse-papiers validé
  { label: 'Examen blanc', bg: 'linear-gradient(145deg, #f9a8d4, #f472b6)', ink: '#500724', accent: '#ec4899', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg> },
  // Cœur avec pouls
  { label: 'Culture sanitaire', bg: 'linear-gradient(145deg, #67e8f9, #22d3ee)', ink: '#083344', accent: '#0eb5d4', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg> },
  // Chapeau de diplômé
  { label: 'Annales', bg: 'linear-gradient(145deg, #cbd5e1, #94a3b8)', ink: '#0f172a', accent: '#64748b', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg> },
]

// Icônes médicales / éducation pour le second ticker
const TICKER_MEDICAL = [
  // Seringue
  { label: 'Injections', bg: 'linear-gradient(145deg, #fecaca, #fca5a5)', ink: '#450a0a', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 2 4 4"/><path d="m17 7 3-3"/><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path d="m9 11 4 4"/><path d="m5 19-3 3"/><path d="m14 4 6 6"/></svg> },
  // Microscope
  { label: 'Sciences', bg: 'linear-gradient(145deg, #c7d2fe, #a5b4fc)', ink: '#1e1b4b', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg> },
  // Thermomètre
  { label: 'Constantes', bg: 'linear-gradient(145deg, #fed7aa, #fdba74)', ink: '#431407', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg> },
  // Croix médicale
  { label: 'Soins', bg: 'linear-gradient(145deg, #bbf7d0, #86efac)', ink: '#052e16', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h5v5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2Z"/></svg> },
  // Éprouvette
  { label: 'Dilutions', bg: 'linear-gradient(145deg, #a5f3fc, #67e8f9)', ink: '#083344', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg> },
  // Électrocardiogramme
  { label: 'Rythmes', bg: 'linear-gradient(145deg, #fbcfe8, #f9a8d4)', ink: '#500724', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg> },
  // Crayon
  { label: 'Écriture', bg: 'linear-gradient(145deg, #fde68a, #fcd34d)', ink: '#451a03', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> },
  // Cahier
  { label: 'Révisions', bg: 'linear-gradient(145deg, #ddd6fe, #c4b5fd)', ink: '#2e1065', icon: (c) => <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/></svg> },
]

const SCREENS = [
  { titre: 'Calcul de doses', from: '#fee2e2', to: '#fecaca' },
  { titre: 'Analyse de texte', from: '#e0e7ff', to: '#c7d2fe' },
  { titre: 'Conversions', from: '#dcfce7', to: '#bbf7d0' },
  { titre: 'Question du jury', from: '#fef3c7', to: '#fde68a' },
  { titre: 'Produit en croix', from: '#fae8ff', to: '#f5d0fe' },
  { titre: 'Annale 2025', from: '#e2e8f0', to: '#cbd5e1' },
  { titre: 'Pourcentages', from: '#ffedd5', to: '#fed7aa' },
  { titre: 'Culture sanitaire', from: '#cffafe', to: '#a5f3fc' },
]

const TABS = ['Calculs', 'Rédaction', 'Oral', 'Examens blancs']

// ---- Composants animés ----

// Pile d'icônes animée du hero : la carte du dessus s'envole, la suivante prend sa place
function AppLogoStack({ onChange }) {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const indexRef = useRef(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaving(true)
      // Notifier dès le début de l'envol : la bascule du titre (840 ms, couleur
      // changée à mi-course = 420 ms) tombe pile quand la nouvelle tuile apparaît
      const next = (indexRef.current + 1) % MODULES.length
      onChangeRef.current?.(MODULES[next])
      setTimeout(() => { indexRef.current = next; setIndex(next); setLeaving(false) }, 420)
    }, 2400)
    return () => clearInterval(interval)
  }, [])
  const mod = MODULES[index]
  return (
    <div className="relative w-[88px] h-[88px] mx-auto" aria-hidden="true">
      <div className="absolute inset-0 rounded-[24px] bg-[#ececec]" style={{transform: 'translateY(-14px) scale(0.84)'}}></div>
      <div className="absolute inset-0 rounded-[24px] bg-[#f7f7f7] shadow-[0_1px_2px_rgba(0,0,0,0.05)]" style={{transform: 'translateY(-7px) scale(0.92)'}}></div>
      <div
        className="absolute inset-0 rounded-[24px] flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.14)]"
        style={{
          background: mod.bg,
          transition: leaving ? 'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s' : 'none',
          transform: leaving ? 'translateY(-32px) scale(0.88)' : 'none',
          opacity: leaving ? 0 : 1,
        }}
      >
        {mod.icon(mod.ink)}
      </div>
    </div>
  )
}

// Mot façon horloge à palettes : il bascule sur son axe, disparaît sur la
// tranche, et se redéploie dans la nouvelle couleur quand `color` change
function FlipWord({ color, children }) {
  const prevRef = useRef(color)
  const [anim, setAnim] = useState({ shown: color, key: 0 })
  useEffect(() => {
    if (color === prevRef.current) return
    const nouvelle = color
    prevRef.current = color
    // Relancer la bascule en gardant l'ancienne couleur, puis échanger à
    // mi-course (420 ms) — au même instant que l'arrivée de la nouvelle tuile
    setAnim(a => ({ shown: a.shown, key: a.key + 1 }))
    const t = setTimeout(() => setAnim(a => ({ ...a, shown: nouvelle })), 420)
    return () => clearTimeout(t)
  }, [color])
  return (
    <span key={anim.key} className="flip-word" style={{ color: anim.shown, transition: 'none' }}>{children}</span>
  )
}

// Section "bibliothèque grandissante" : le contenu reste figé pendant le
// défilement, les tuiles dérivent en parallaxe et le chiffre central change
const SCATTER = [
  { top: '6%', left: '12%', size: 84, depth: 1.3, mod: 0 },
  { top: '4%', left: '22%', size: 84, depth: 0.6, mod: 1 },
  { top: '3%', right: '17%', size: 84, depth: 0.5, mod: 2 },
  { top: '7%', right: '9%', size: 84, depth: 1.0, mod: 3 },
  { top: '38%', left: '5%', size: 84, depth: 0.7, mod: 4 },
  { top: '42%', right: '6%', size: 84, depth: 1.4, mod: 5 },
  { bottom: '9%', left: '13%', size: 84, depth: 1.1, mod: 6 },
  { bottom: '11%', left: '19%', size: 84, depth: 0.3, mod: 7 },
  { bottom: '6%', right: '19%', size: 84, depth: 0.3, mod: 8 },
  { bottom: '12%', right: '10%', size: 84, depth: 1.5, mod: 9 },
  { top: '22%', left: '10%', size: 84, depth: 2.0, mod: 10 },
  { top: '24%', right: '12%', size: 84, depth: 1.8, mod: 11 },
]

function GrowingLibrary() {
  const ALL_ICONS = [...MODULES, ...TICKER_MEDICAL.slice(0, 6)]
  const PHASES = [
    { valeur: 'Déjà 2 200', label: <><span className="surligne">exercices</span> générés</> },
    { valeur: 'Déjà 2 300', label: 'examens blancs générés' },
    { valeur: 'Déjà 250', label: 'sujets de rédaction' },
    { valeur: 'Déjà 40', label: 'annales réelles' },
  ]
  const sectionRef = useRef(null)
  const iconRefs = useRef([])
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    // Pas de throttle rAF : les navigateurs alignent déjà les événements scroll
    // sur les frames, et rAF ne tourne pas si l'onglet est considéré masqué
    const onScroll = () => {
      const el = sectionRef.current
      if (!el) return
      const total = el.offsetHeight - window.innerHeight
      const progress = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total))
      setPhase(Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length)))
      iconRefs.current.forEach((node, i) => {
        if (!node) return
        node.style.transform = `translateY(${(0.5 - progress) * SCATTER[i].depth * 300}px)`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <section ref={sectionRef} className="relative" style={{height: '400vh'}}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {SCATTER.map((s, i) => {
          const m = ALL_ICONS[s.mod % ALL_ICONS.length]
          return (
            <div
              key={i}
              ref={el => { iconRefs.current[i] = el }}
              aria-hidden="true"
              className={`absolute will-change-transform ${i % 3 === 2 ? 'hidden sm:block' : ''}`}
              style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right, width: s.size, height: s.size }}
            >
              <div
                className="tile-float w-full h-full rounded-[22px] flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
                style={{ background: m.bg, animationDuration: `${4.2 + (i % 5) * 0.7}s`, animationDelay: `${-i * 0.9}s` }}
              >
                <div style={{transform: `scale(${s.size / 100})`}}>{m.icon(m.ink)}</div>
              </div>
            </div>
          )
        })}
        <div className="relative z-10 text-center px-5">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-black/80">Un univers de révision dédié à l&apos;examen</h2>
          <div key={phase} className="mt-4">
            <p className="text-5xl sm:text-[5.5rem] font-extrabold tracking-[-0.04em] leading-none overflow-hidden py-1">
              {PHASES[phase].valeur.split('').map((ch, i) => (
                <span key={i} className="char-rise" style={{animationDelay: `${i * 45}ms`}}>{ch === ' ' ? ' ' : ch}</span>
              ))}
            </p>
            <p className="stat-swap mt-3 text-lg sm:text-2xl font-bold text-black/45">{PHASES[phase].label}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Mini-aperçu d'interface pour chaque module du zigzag (fenêtre d'app factice)
function ApercuModule({ i, bord, teinte, titre, badgeFenetre }) {
  const Barre = ({ w, h = 7, o = 0.1 }) => <div style={{width: w, height: h, background: `rgba(0,0,0,${o})`, borderRadius: 4}}></div>
  // Compte à rebours réel pour les modules chronométrés (maths, rédaction, examen blanc)
  const depart = i === 2 ? 24 * 60 + 59 : i === 3 ? 52 * 60 + 10 : 28 * 60 + 26
  const dureeTotale = i === 3 ? 60 * 60 : 30 * 60
  const accentChrono = i === 2 ? '#c084fc' : i === 3 ? '#facc15' : '#f87171'
  const [tempsRestant, setTempsRestant] = useState(depart)
  useEffect(() => {
    if (i !== 1 && i !== 2 && i !== 3) return
    const t = setInterval(() => setTempsRestant(s => (s <= 0 ? depart : s - 1)), 1000)
    return () => clearInterval(t)
  }, [i, depart])
  const chrono = `${String(Math.floor(tempsRestant / 60)).padStart(2, '0')}:${String(tempsRestant % 60).padStart(2, '0')}`
  return (
    <div className="max-w-sm mx-auto rounded-2xl overflow-hidden bg-white ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-1.5" style={{boxShadow: `0 18px 45px ${bord}2e`}}>
      {/* Barre de fenêtre — les modules chronométrés ont le vrai chrono d'épreuve sur fond sombre */}
      {i === 1 || i === 2 || i === 3 ? (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f172a]">
          <span className="text-[11px] font-bold text-white">{titre}</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full rounded-full transition-[width] duration-1000" style={{width: `${(tempsRestant / dureeTotale) * 100}%`, background: accentChrono}}></div>
            </div>
            <svg className="w-7 h-4 heartbeat-anim" viewBox="0 0 80 24" fill="none" stroke={accentChrono} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{strokeDasharray: 200, strokeDashoffset: 0}}><polyline points="0,12 15,12 20,12 25,2 30,22 35,6 40,18 45,12 50,12 55,12 60,12 65,8 68,16 70,12 80,12"/></svg>
            <span className="text-[13px] font-black text-white tabular-nums">{chrono}</span>
          </div>
        </div>
      ) : i === 4 ? (
        <div className="flex items-center px-4 py-2.5 bg-[#0f172a]">
          <span className="text-[11px] font-bold text-white">{titre}</span>
          <span className="ml-auto text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{background: bord}}>{badgeFenetre}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-4 py-2.5" style={{background: teinte}}>
          <span className="w-2 h-2 rounded-full" style={{background: `${bord}55`}}></span>
          <span className="w-2 h-2 rounded-full" style={{background: `${bord}55`}}></span>
          <span className="ml-2 text-[11px] font-bold" style={{color: bord}}>{titre}</span>
          <span className="ml-auto text-[10px] font-bold text-white px-2 py-0.5 rounded-full" style={{background: bord}}>{badgeFenetre}</span>
        </div>
      )}
      {/* Corps selon le module */}
      <div className="p-5">
        {i === 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-black/70">Question 2/10</span>
              <span className="text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-md" style={{background: teinte, color: bord}}>Équations et problèmes</span>
            </div>
            <div className="h-1 rounded-full bg-black/[0.07] mb-3.5 overflow-hidden"><div className="h-full rounded-full" style={{width: '20%', background: bord}}></div></div>
            <p className="text-[11px] font-bold text-black/75 leading-snug mb-3">Marc a 3 fois l&apos;âge de sa fille Véronique. Dans 12 ans, il aura 2 fois son âge. Quel est l&apos;âge actuel de Véronique&nbsp;?</p>
            <div className="h-9 rounded-lg ring-1 ring-black/10 bg-black/[0.02] flex items-center px-3 text-[11px] font-medium text-black/35 mb-3">Votre réponse...</div>
            <div className="flex gap-2">
              <div className="h-9 px-3 rounded-lg bg-black/[0.05] flex items-center text-[11px] font-bold text-black/60">← Précédent</div>
              <div className="h-9 flex-1 rounded-lg flex items-center justify-center text-[11px] font-bold text-white" style={{background: bord}}>Valider ✓</div>
            </div>
          </div>
        )}
        {i === 1 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold" style={{background: bord}}>1</span>
                <span className="text-[11px] font-extrabold text-black/80">Opérations et conversions</span>
              </div>
              <span className="text-[11px] font-extrabold text-black/70">/3.75</span>
            </div>
            <div className="rounded-md px-2.5 py-2 mb-3 text-[9.5px] font-medium text-black/60 leading-snug" style={{background: teinte, borderLeft: `3px solid ${bord}`}}>Effectuez les opérations suivantes en les posant, puis complétez les conversions.</div>
            {[['1a', 'Posez et calculez : 2 847,65 + 1 392,48'], ['1b', 'Posez et calculez : 756,4 ÷ 14'], ['1c', 'Complétez : 3 250 mg = ……… g']].map(([n, q]) => (
              <div key={n} className="mb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-4 h-4 rounded bg-[#1a1a1a] text-white text-[8px] font-bold flex items-center justify-center shrink-0">{n}</span>
                    <span className="text-[10px] font-bold text-black/75 truncate">{q}</span>
                  </div>
                  <span className="text-[8px] font-bold text-black/35 shrink-0 ml-2">1.25 pts</span>
                </div>
                <div className="h-7 rounded-lg ring-1 ring-black/10 bg-black/[0.02] flex items-center px-2.5 text-[9px] text-black/35">Votre réponse...</div>
              </div>
            ))}
          </div>
        )}
        {i === 2 && (
          <div>
            <div className="rounded-lg bg-[#0f172a] p-3 mb-3">
              <p className="text-[10px] font-extrabold text-white leading-snug mb-1.5">Les cigarettes électroniques jetables (PUFF) et leurs risques chez les adolescents</p>
              <div className="flex gap-1.5">
                <span className="text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/15 text-[#c4b5fd]">Questions</span>
                <span className="text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-white/15 text-white">Sujet créé par nos soins</span>
              </div>
            </div>
            <p className="text-[9px] text-black/55 font-medium leading-relaxed mb-3" style={{display: '-webkit-box', WebkitLineClamp: 7, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>Les cigarettes électroniques jetables, communément appelées « PUFF », connaissent une explosion de vente auprès des jeunes depuis 2022. Ces petits appareils colorés, de la taille d&apos;un stylo et vendus environ 5 à 8 euros, contiennent jusqu&apos;à 20 mg/mL de nicotine et offrent entre 500 et 600 bouffées, équivalent à deux paquets de cigarettes classiques. Selon une enquête de Santé Publique France (2024), 18 % des adolescents de 15-17 ans ont essayé une PUFF au cours des six derniers mois...</p>
            <div className="space-y-2 mb-3">
              <Barre w="100%" o={0.08} /><Barre w="96%" o={0.08} /><Barre w="60%" o={0.08} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-black/40">1 240 caractères</span>
              <div className="h-8 px-3.5 rounded-full flex items-center text-[11px] font-bold text-white" style={{background: bord}}>Soumettre</div>
            </div>
          </div>
        )}
        {i === 3 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 rounded-lg p-3 ring-1 ring-black/10">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{background: bord}}>✓</span>
              <span className="text-xs font-bold text-black/70">Partie maths</span>
              <span className="ml-auto text-[10px] font-bold text-black/40">terminée</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg p-3" style={{border: `1.5px solid ${bord}`, background: teinte}}>
              <span className="w-6 h-6 rounded-full ring-1 ring-black/15 bg-white flex items-center justify-center text-xs">✍️</span>
              <span className="text-xs font-bold text-black/70">Partie rédaction</span>
              <span className="ml-auto text-[10px] font-bold" style={{color: bord}}>en cours</span>
            </div>
            <div className="h-2 rounded-full bg-black/[0.08] overflow-hidden"><div className="h-full rounded-full" style={{width: '62%', background: bord}}></div></div>
          </div>
        )}
        {i === 4 && (
          <div className="text-center">
            <div className="rounded-xl p-3.5 mb-7 text-left" style={{background: teinte}}>
              <p className="text-[11px] font-bold leading-snug" style={{color: bord}}>« Pourquoi souhaitez-vous devenir infirmier après votre parcours d&apos;aide-soignant ? »</p>
            </div>
            <div className="relative inline-flex items-center justify-center mb-6">
              <span className="micro-pulse absolute w-16 h-16 rounded-full" style={{background: `${bord}22`}}></span>
              <span className="micro-pulse-retard absolute w-12 h-12 rounded-full" style={{background: `${bord}33`}}></span>
              <span className="micro-beat relative w-9 h-9 rounded-full flex items-center justify-center" style={{background: bord}}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </span>
            </div>
            <p className="text-[10px] font-bold text-black/40">Répondez à voix haute, puis passez à la suivante</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Pluie de confettis jouée une fois à l'affichage du verdict positif
function ConfettiBurst() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const parent = canvas.parentElement.getBoundingClientRect()
    canvas.width = parent.width
    canvas.height = parent.height
    const ctx = canvas.getContext('2d')
    const couleurs = ['#dc2626', '#f87171', '#fbbf24', '#34d399', '#60a5fa']
    const flocons = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 80,
      vy: 2 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 2,
      r: 3.5 + Math.random() * 3.5,
      col: couleurs[Math.floor(Math.random() * couleurs.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
    }))
    let frames = 0, raf
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      flocons.forEach(f => {
        f.y += f.vy; f.x += f.vx; f.rot += f.vr
        ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(f.rot)
        ctx.fillStyle = f.col; ctx.fillRect(-f.r, -f.r / 2, f.r * 2, f.r)
        ctx.restore()
      })
      if (++frames < 170) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true"></canvas>
}

// Nuage de petits points qui flottent derrière le hero
function ParticleField() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf, w, h
    const dots = []
    const resize = () => {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio
      h = canvas.height = canvas.offsetHeight * devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)
    const N = Math.round((canvas.offsetWidth * canvas.offsetHeight) / 14000)
    for (let i = 0; i < N; i++) {
      dots.push({
        x: Math.random() * w, y: Math.random() * h,
        r: (Math.random() * 1.6 + 0.8) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        red: Math.random() < 0.12,
        phase: Math.random() * Math.PI * 2,
      })
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const t = performance.now() / 1000
      for (const d of dots) {
        d.x += d.vx + Math.sin(t * 0.6 + d.phase) * 0.12 * devicePixelRatio
        d.y += d.vy + Math.cos(t * 0.5 + d.phase) * 0.1 * devicePixelRatio
        if (d.x < -10) d.x = w + 10; if (d.x > w + 10) d.x = -10
        if (d.y < -10) d.y = h + 10; if (d.y > h + 10) d.y = -10
        const tw = 0.5 + 0.5 * Math.sin(t * 1.2 + d.phase * 2)
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fillStyle = d.red ? `rgba(220,38,38,${0.25 + tw * 0.3})` : `rgba(13,13,13,${0.10 + tw * 0.14})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" style={{maskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 75% 70% at 50% 45%, black 30%, transparent 100%)'}} />
}

// Compteur animé au scroll
function CountUp({ target, suffix = '' }) {
  const ref = useRef(null)
  const [val, setVal] = useState(0)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const dur = 1400
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1)
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{val.toLocaleString('fr-FR')}{suffix}</span>
}

// Faux écran d'exercice (placeholder de capture)
function ScreenCard({ s, w = 230, h = 460 }) {
  return (
    <div className="shrink-0 rounded-[28px] ring-1 ring-black/5 overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.07)]" style={{width: w, height: h, background: `linear-gradient(160deg, ${s.from}, ${s.to})`}}>
      <div className="absolute inset-x-4 top-4 bottom-0 bg-white/85 backdrop-blur rounded-t-2xl ring-1 ring-black/5 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-lg" style={{background: s.to}}></div>
          <div className="w-20 h-2.5 bg-black/15 rounded-full"></div>
        </div>
        <div className="w-full h-2 bg-black/5 rounded-full mb-2"></div>
        <div className="w-5/6 h-2 bg-black/5 rounded-full mb-2"></div>
        <div className="w-2/3 h-2 bg-black/5 rounded-full mb-6"></div>
        <div className="space-y-2.5">
          <div className="w-full h-9 bg-black/5 rounded-xl"></div>
          <div className="w-full h-9 bg-black/5 rounded-xl"></div>
          <div className="w-full h-9 bg-black/[0.08] rounded-xl ring-1 ring-black/10"></div>
          <div className="w-full h-9 bg-black/5 rounded-xl"></div>
        </div>
        <div className="absolute bottom-4 inset-x-4 h-11 bg-[#0d0d0d] rounded-full flex items-center justify-center">
          <div className="w-16 h-2 bg-white/40 rounded-full"></div>
        </div>
      </div>
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-black/40">{s.titre}</div>
    </div>
  )
}

const FAQ_DATA = [
  { q: "Puis-je passer le concours FPC sans le baccalauréat ?", a: "Oui ! La voie FPC (Formation Professionnelle Continue) est justement conçue pour cela. Il vous suffit de justifier de 3 années de cotisation à un régime de protection sociale à la date d'inscription aux épreuves, quel que soit votre domaine d'activité précédent." },
  { q: "En quoi consiste l'épreuve écrite du concours FPC ?", a: "L'épreuve écrite dure 1 heure et se divise en deux parties : une sous-épreuve de calculs (calculs de doses, conversions, pourcentages, produits en croix) notée sur 10 points, et une sous-épreuve de rédaction (analyse de texte ou questions sur un sujet de culture sanitaire et sociale) notée sur 10 points. Attention : une note inférieure à 8/20 à l'écrit est éliminatoire." },
  { q: "La plateforme est-elle adaptée si je suis nul(le) en maths ?", a: "Absolument ! Notre plateforme propose un entraînement spécifique qui reprend les bases étape par étape : produits en croix, conversions, pourcentages, calculs de doses. Chaque exercice est accompagné d'une correction détaillée qui vous explique la méthode de résolution de façon simple et progressive." },
  { q: "Comment se déroule l'épreuve orale ?", a: "L'épreuve orale dure 20 minutes et est notée sur 20 points. Vous présentez votre parcours professionnel et votre projet de reconversion devant un jury composé de formateurs IFSI et de professionnels de santé. Notre outil de préparation à l'oral analyse votre CV et génère des questions personnalisées pour vous entraîner." },
  { q: "Y a-t-il une période d'essai gratuite ?", a: "Oui, vous bénéficiez de 7 jours d'essai gratuit dès votre inscription. Pendant cette période, vous avez accès à toutes les fonctionnalités de la plateforme : entraînements de mathématiques, sujets de rédaction, examens blancs et préparation à l'oral." },
  { q: "Combien de temps dois-je consacrer aux révisions ?", a: "Nous conseillons de démarrer vos révisions 3 à 6 mois avant le concours, à raison de 2 à 4 heures par semaine. Notre plateforme vous permet de réviser à votre rythme, sur mobile, tablette ou ordinateur, que vous ayez 15 minutes dans les transports ou une heure de libre le week-end." },
  { q: "Quelles sont les dates du concours FPC ?", a: "Les dates varient selon les IFSI et les régions. Généralement, les inscriptions ouvrent entre janvier et mars, les épreuves écrites se déroulent entre mars et mai, et les oraux entre mai et juin. Consultez <a href='/blog/dates-concours-fpc-infirmier-2026'>notre article dédié aux dates du concours FPC</a> pour le calendrier complet et à jour." },
  { q: "Comment puis-je financer ma formation en IFSI ?", a: "Plusieurs solutions existent selon votre situation : promotion professionnelle prise en charge par votre employeur, projet de transition professionnelle (Transitions Pro), financements France Travail pour les demandeurs d'emploi, ou autofinancement. Retrouvez tous les détails dans <a href='/blog'>notre espace Blog</a>." },
  { q: "J'ai un problème, comment vous contacter ?", a: "Vous pouvez nous écrire à <strong>support@prepa-fpc.fr</strong>. Nous vous répondrons dans les plus brefs délais." }
]

export default function MaquettePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeFaq, setActiveFaq] = useState(null)
  // Étape du mini-quiz d'éligibilité : q1 → q2 → oui / non
  const [eligEtape, setEligEtape] = useState('q1')
  const [annees, setAnnees] = useState(2)
  const [nonMotif, setNonMotif] = useState(null)

  // Progression de la ligne verticale des 5 catégories (suit le scroll).
  // Chaque pastille s'allume quand le remplissage atteint sa position réelle.
  const catRef = useRef(null)
  const [catProgress, setCatProgress] = useState(0)
  const [catActifs, setCatActifs] = useState([false, false, false, false, false])
  useEffect(() => {
    const onScroll = () => {
      const el = catRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height))
      setCatProgress(p)
      const hautPiste = r.top + 24
      const fillY = hautPiste + p * (r.height - 48)
      const rangees = [...el.children].filter(c => c.className.includes('grid'))
      setCatActifs(rangees.map(row => {
        const rr = row.getBoundingClientRect()
        return fillY >= rr.top + rr.height / 2
      }))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const CAT_COLORS = ['#2563eb', '#dc2626', '#9333ea', '#eab308', '#16a34a']
  const catActive = Math.max(0, catActifs.lastIndexOf(true))
  // Couleur du titre synchronisée avec la tuile affichée dans la pile du hero
  const [heroMod, setHeroMod] = useState(MODULES[0])


  // Fade-in au scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>

      {/* ===================== HERO ===================== */}
      <section className="relative grid place-items-center px-5 pb-4 pt-[68px] md:pt-[150px] text-center">
        <div aria-hidden="true" className="hero-grid absolute inset-0 pointer-events-none"></div>
        <ParticleField />
        <div className="relative z-10 grid place-items-center">
        <AppLogoStack onChange={setHeroMod} />
        <h1 className="mt-9 text-[2.7rem] sm:text-6xl lg:text-[4.6rem] font-extrabold tracking-[-0.035em] leading-[1.02] max-w-4xl">
          Réussissez le<br /><FlipWord color={heroMod.accent}>concours</FlipWord> infirmier <FlipWord color={heroMod.accent}>FPC</FlipWord>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-black/55 font-medium max-w-3xl leading-relaxed">
          La première plateforme web de révision conçue exclusivement pour les professionnels en reconversion. Maîtrisez parfaitement les <strong className="font-bold text-black/75">calculs de doses</strong> et la <strong className="font-bold text-black/75">culture sanitaire</strong>, et intégrez votre première année en IFSI.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
          <a href="/qcm" className="btn-shine inline-flex items-center gap-2 justify-center bg-[#0d0d0d] hover:bg-black/85 text-white font-semibold text-base px-7 py-3.5 rounded-full transition group">
            Commencer l&apos;entraînement
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </a>
          <a href="#composition-examen" className="inline-flex items-center justify-center font-semibold text-base px-7 py-3.5 rounded-full ring-1 ring-black/10 hover:bg-black/5 transition">
            Découvrez l&apos;examen
          </a>
        </div>

        {/* Indice de scroll */}
        <a href="#eligibilite" aria-label="Faire défiler vers la suite" className="mt-8 flex flex-col items-center text-black/30 hover:text-black/60 transition-colors">
          <svg className="scroll-cue-1 w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
          <svg className="scroll-cue-2 w-6 h-6 -mt-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
        </a>

        </div>
      </section>

      {/* ===================== ÉLIGIBILITÉ ===================== */}
      <section id="eligibilite" className="relative overflow-hidden pt-8 pb-12 sm:pt-10 sm:pb-16 px-5 fade-in-up" style={{background: 'linear-gradient(to bottom, #ffffff 0%, #f7f6f4 90px, #f7f6f4 calc(100% - 140px), #ffffff 100%)', scrollMarginTop: '115px'}}>
        {/* Décorations */}
        <div aria-hidden="true" className="absolute top-20 -left-24 w-80 h-64 bg-red-500/[0.07] rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute bottom-16 -right-20 w-72 h-56 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none"></div>
        <svg aria-hidden="true" className="absolute top-[30%] left-[10%] w-6 h-6 text-black/[0.12] hidden md:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transform: 'rotate(-10deg)'}}><path d="M12 5v14M5 12h14"/></svg>
        <svg aria-hidden="true" className="absolute bottom-[22%] left-[16%] w-4 h-4 text-red-500/30 hidden md:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{transform: 'rotate(18deg)'}}><path d="M12 5v14M5 12h14"/></svg>
        <svg aria-hidden="true" className="absolute top-[62%] right-[9%] w-5 h-5 text-black/[0.1] hidden md:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{transform: 'rotate(-14deg)'}}><path d="M12 5v14M5 12h14"/></svg>
        {/* Annotation manuscrite + flèche vers la carte */}
        <div aria-hidden="true" className="absolute top-[46%] left-[8%] hidden lg:block pointer-events-none">
          <p className="text-[1.55rem] text-red-500 -rotate-6" style={{fontFamily: "'Caveat', cursive", fontWeight: 700}}>10 secondes chrono&nbsp;!</p>
          <svg className="w-16 h-14 text-red-500/80 ml-14 mt-1" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6 C 18 26, 34 38, 52 40"/><path d="M42 44 52 40 49 30"/></svg>
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.2]"><span className="surligne">Êtes-vous éligible au concours FPC&nbsp;?</span></h2>
            <p className="mt-5 text-lg text-black/55 font-medium leading-relaxed">La voie de la Formation Professionnelle Continue (FPC) est une passerelle spécifique qui permet d&apos;intégrer un IFSI. Répondez à deux questions pour le savoir.</p>
          </div>
          {/* Mini-quiz d'éligibilité */}
          <div className="relative overflow-hidden max-w-xl mx-auto bg-white/45 backdrop-blur-sm rounded-[28px] ring-1 ring-black/[0.04] p-8 sm:p-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-extrabold uppercase tracking-widest text-red-600">Vérifiez-le en 10 secondes</p>
              {(eligEtape === 'q1' || eligEtape === 'q2') && (
                <span className="text-xs font-bold text-black/40">Question {eligEtape === 'q1' ? '1' : '2'}/2</span>
              )}
            </div>
            <div className="h-1 rounded-full bg-black/[0.06] mb-8 overflow-hidden">
              <div className="h-full rounded-full bg-red-600 transition-all duration-500" style={{width: eligEtape === 'q1' ? '25%' : eligEtape === 'q2' ? '62%' : '100%'}}></div>
            </div>

            {eligEtape === 'q1' && (
              <div key="q1" className="slide-in text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-600/30" style={{background: 'linear-gradient(145deg, #ef4444, #dc2626)'}}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Avez-vous 17 ans ou plus&nbsp;?</h3>
                <p className="text-black/50 font-medium mb-8">Avec ou sans diplôme, quel que soit votre parcours.</p>
                <div className="flex gap-3">
                  <button onClick={() => setEligEtape('q2')} className="flex-1 bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:scale-[0.97] text-white font-bold py-3.5 rounded-full transition-all cursor-pointer">Oui</button>
                  <button onClick={() => { setNonMotif('age'); setEligEtape('non') }} className="flex-1 ring-1 ring-black/10 hover:bg-black/5 hover:-translate-y-0.5 active:scale-[0.97] font-bold py-3.5 rounded-full transition-all cursor-pointer">Non</button>
                </div>
              </div>
            )}

            {eligEtape === 'q2' && (
              <div key="q2" className="slide-in text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-600/30" style={{background: 'linear-gradient(145deg, #ef4444, #dc2626)'}}>
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Depuis combien d&apos;années cotisez-vous (temps plein)&nbsp;?</h3>
                <p className="text-black/50 font-medium mb-8">Tous secteurs confondus, pas seulement la santé.</p>
                <div className="flex items-center gap-4 mb-1">
                  <input
                    type="range" min="0" max="10" step="1" value={annees}
                    onChange={(e) => setAnnees(parseInt(e.target.value))}
                    className="curseur flex-1 cursor-pointer"
                    style={{background: `linear-gradient(to right, #dc2626 ${annees * 10}%, rgba(0,0,0,0.08) ${annees * 10}%)`}}
                    aria-label="Années de cotisation"
                  />
                  <span key={annees} className="pop text-lg font-extrabold tabular-nums w-16 text-left">{annees} an{annees > 1 ? 's' : ''}</span>
                </div>
                <div className="relative h-7 mb-3 mr-20 ml-1">
                  <span className="absolute left-0 top-0 text-[10px] font-bold text-black/30">0</span>
                  <div className="absolute top-0 flex flex-col items-center" style={{left: '30%'}}>
                    <div className="w-0.5 h-2 bg-red-600/60"></div>
                    <span className="text-[10px] font-bold text-red-600/80 whitespace-nowrap">seuil : 3 ans</span>
                  </div>
                  <span className="absolute right-0 top-0 text-[10px] font-bold text-black/30">10</span>
                </div>
                <p className={`text-sm font-bold mb-8 ${annees >= 3 ? 'text-emerald-600' : 'text-black/45'}`}>
                  {annees >= 3 ? 'C’est bon, la voie FPC vous est ouverte !' : `Encore ${3 - annees} an${3 - annees > 1 ? 's' : ''} et la voie FPC s’ouvre`}
                </p>
                <button
                  onClick={() => { if (annees >= 3) { setEligEtape('oui') } else { setNonMotif('cotisation'); setEligEtape('non') } }}
                  className="w-full bg-red-600 hover:bg-red-500 hover:-translate-y-0.5 active:scale-[0.97] text-white font-bold py-3.5 rounded-full transition-all cursor-pointer"
                >Voir mon résultat</button>
              </div>
            )}

            {eligEtape === 'oui' && (
              <div key="oui" className="slide-in text-center">
                <ConfettiBurst />
                <div className="mb-6 mt-2">
                  <span className="stamp-in inline-block border-[3.5px] border-red-600 text-red-600 font-extrabold tracking-[0.16em] px-6 py-2 rounded-lg text-2xl">ÉLIGIBLE</span>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Vous êtes éligible au concours FPC&nbsp;!</h3>
                <p className="text-black/50 font-medium mb-8">Vous pouvez vous présenter à la sélection et intégrer un IFSI. Il ne reste plus qu&apos;à vous préparer.</p>
                <a href="/signup" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-7 py-3.5 rounded-full transition shadow-lg shadow-red-600/25 group/btn">
                  Commencer ma préparation
                  <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
                </a>
                <button onClick={() => setEligEtape('q1')} className="block mx-auto mt-5 text-sm font-bold text-black/40 hover:text-black/60 transition cursor-pointer">Refaire le test</button>
              </div>
            )}

            {eligEtape === 'non' && (
              <div key="non" className="slide-in text-center">
                <div className="w-16 h-16 rounded-full bg-black/[0.06] flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-black/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Pas encore — mais ce n&apos;est que partie remise</h3>
                <p className="text-black/50 font-medium mb-8">
                  {nonMotif === 'cotisation'
                    ? `Encore ${3 - annees} an${3 - annees > 1 ? 's' : ''} de cotisation et la voie FPC vous sera ouverte. Rien ne vous empêche de commencer à vous préparer dès maintenant.`
                    : 'Dès vos 17 ans révolus, la voie FPC vous sera ouverte. Rien ne vous empêche de commencer à vous préparer dès maintenant.'}
                </p>
                <button onClick={() => setEligEtape('q1')} className="text-sm font-bold text-red-600 hover:text-red-500 transition cursor-pointer">Refaire le test</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================== LES 5 CATÉGORIES D'ENTRAÎNEMENT (zigzag) ===================== */}
      <section className="px-5 py-16 sm:py-24 fade-in-up">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05]">5 entraînements pour maximiser<br />vos chances de réussite</h2>
            <p className="mt-5 text-lg text-black/55 font-medium leading-relaxed">Chaque module cible une partie précise du concours.</p>
          </div>
          <div ref={catRef} className="relative space-y-16 sm:space-y-24">
            {/* Ligne de progression verticale */}
            <div aria-hidden="true" className="hidden md:block absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-[3px] rounded-full bg-black/[0.07]">
              <div className="w-full rounded-full transition-[height,background-color] duration-300" style={{height: `${catProgress * 100}%`, backgroundColor: CAT_COLORS[catActive]}}></div>
            </div>
            {[
              { titre: 'Entraînement spécifique', desc: "Tous les types d'exercices de maths avec des explications pour réellement progresser", pied: 'Ne compte pas dans la moyenne', badge: null, bord: '#2563eb', teinte: '#eff6ff', num: '1', sur: 'Se concentrer sur un thème', points: ['Conversions, pourcentages, produits en croix, équations', 'Correction détaillée après chaque question', 'Aucune note, afin de progresser en amont des tests'], icone: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></> },
              { titre: 'Entraînement mathématiques', desc: "Conditions similaires à l'examen pour évaluer son niveau basé en partie sur les annales", pied: 'Note /10', badge: '30 min', bord: '#dc2626', teinte: '#fef2f2', num: '2', sur: 'Se mesurer à l’épreuve de calculs', points: ['Génération illimitée de sujets inspirés des annales', '30 minutes chrono, sans calculatrice, comme la sous-épreuve du concours', 'Note sur 10 et correction finale détaillée'], icone: <><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></> },
              { titre: 'Entraînement rédactionnel', desc: 'Analyse de texte, dissertations, culture sanitaire basée en partie sur les annales', pied: 'Note /10', badge: '30 min', bord: '#9333ea', teinte: '#faf5ff', num: '3', sur: 'Maîtriser l’épreuve de rédaction', points: ['Analyse de texte ou dissertation sur la culture sanitaire et sociale', 'Correction complète : argumentation, structure et chaque faute relevée', 'Note sur 10 comme à l’écrit du concours'], icone: <><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></> },
              { titre: 'Examen blanc', desc: "Conditions réelles, sans calculatrice, vous disposez d'un temps imparti d'1H", pied: 'Note /20', badge: '1H', bord: '#eab308', teinte: '#fefce8', num: '4', sur: 'Répéter le jour J', points: ['Maths puis rédaction à la suite, en conditions réelles', 'Une heure au total, sans calculatrice', 'Note sur 20, correction finale détaillée'], icone: <><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></> },
              { titre: 'Questions sur votre parcours', desc: "Simulations de questions possibles sur votre parcours afin de passer l'examen oral dans les meilleures conditions", pied: 'Pas de note', badge: null, bord: '#16a34a', teinte: '#f0fdf4', num: '5', sur: 'Préparer l’oral sereinement', points: ['Importez votre CV et répondez aux questions personnalisées', 'Entraînez-vous à répondre à voix haute', 'Sans note, l’objectif est d’arriver confiant devant le jury'], icone: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
            ].map((c, i) => (
              <div key={i} className="relative grid md:grid-cols-2 gap-8 md:gap-24 items-center">
                {/* Pastille d'étape sur la ligne centrale */}
                <div
                  aria-hidden="true"
                  className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full items-center justify-center text-sm font-extrabold transition-all duration-300"
                  style={catActifs[i]
                    ? { backgroundColor: c.bord, color: '#ffffff', boxShadow: `0 6px 18px ${c.bord}55` }
                    : { backgroundColor: '#ffffff', color: 'rgba(0,0,0,0.35)', boxShadow: '0 0 0 2px rgba(0,0,0,0.10)' }}
                >{c.num}</div>
                {/* Aperçu d'interface */}
                <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
                  <ApercuModule i={i} bord={c.bord} teinte={c.teinte} titre={c.titre} badgeFenetre={['Sans note', '28:26', '24:59', '52:10', 'Question 2/8'][i]} />
                </div>
                {/* Explication */}
                <div className={`${i % 2 === 1 ? 'md:order-1' : ''}`}>
                  <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{color: c.bord}}>{c.titre}</p>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-[-0.02em] leading-tight mb-5">{c.sur}</h3>
                  <ul className={i === 0 ? 'space-y-5' : 'space-y-3.5'}>
                    {c.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{background: c.teinte}}>
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={c.bord} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        </span>
                        <span className={`text-[15px] text-black/60 font-medium leading-relaxed ${p.includes('votre CV') ? 'md:whitespace-nowrap tracking-tight' : ''}`}>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-7">
                    <a href="/signup" className="inline-flex items-center gap-2 text-[15px] font-bold text-white px-6 py-3 rounded-full transition-transform duration-200 hover:scale-[1.04] group" style={{backgroundColor: c.bord, boxShadow: `0 8px 20px ${c.bord}40`}}>
                      Commencer cet entraînement
                      <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BIBLIOTHÈQUE QUI GRANDIT (scroll animé) ===================== */}
      <GrowingLibrary />

      {/* ===================== COMPOSITION DE L'EXAMEN ===================== */}
      <section id="composition-examen" className="relative overflow-hidden bg-[#0d0d0d] py-20 sm:py-28 px-5 fade-in-up">
        <div aria-hidden="true" className="absolute -top-32 -right-24 w-[32rem] h-[24rem] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute -bottom-32 -left-24 w-[28rem] h-[20rem] bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-extrabold uppercase tracking-widest text-red-400 mb-3">Composition de l&apos;épreuve</p>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-white">Déroulement de l&apos;examen</h2>
            <p className="mt-5 text-lg text-white/55 font-medium leading-relaxed">Vous devez impérativement obtenir un total d&apos;au moins <strong className="font-bold text-white">20 sur 40</strong> aux épreuves pour être admis.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/[0.04] rounded-[28px] ring-1 ring-white/10 p-8 relative transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-6 right-6 bg-red-500/15 text-red-300 ring-1 ring-red-500/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">20 points</div>
              <div className="w-12 h-12 bg-red-500/15 text-red-400 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white mb-6">Épreuve écrite — 1 heure</h3>
              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-3"><svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg><p className="leading-relaxed font-medium"><strong className="font-bold text-white">Sous-épreuve de calculs</strong> : calculs de doses, conversions, pourcentages, produits en croix (sur 10 points)</p></div>
                <div className="flex items-start gap-3"><svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg><p className="leading-relaxed font-medium"><strong className="font-bold text-white">Sous-épreuve de rédaction</strong> : analyse ou questions/réponses sur un texte de culture sanitaire et sociale (sur 10 points)</p></div>
              </div>
              <div className="mt-6 bg-red-500/10 ring-1 ring-red-500/20 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="text-sm text-red-200 leading-relaxed font-medium">Une note en dessous de <strong className="font-bold text-white">8/20</strong> à l&apos;épreuve écrite est <strong className="font-bold text-white">éliminatoire</strong>.</p>
              </div>
            </div>
            <div className="bg-white/[0.04] rounded-[28px] ring-1 ring-white/10 p-8 relative transition-transform duration-300 hover:-translate-y-1">
              <div className="absolute top-6 right-6 bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">20 points</div>
              <div className="w-12 h-12 bg-blue-500/15 text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight text-white mb-6">Épreuve orale — 20 minutes</h3>
              <div className="space-y-4 text-white/70">
                <div className="flex items-start gap-3"><svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg><p className="leading-relaxed font-medium"><strong className="font-bold text-white">Présentation du parcours</strong> : valoriser votre expérience professionnelle et votre projet (10 min)</p></div>
                <div className="flex items-start gap-3"><svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg><p className="leading-relaxed font-medium"><strong className="font-bold text-white">Entretien avec le jury</strong> : questions sur vos motivations, connaissances du métier IDE (10 min)</p></div>
              </div>
              <div className="mt-6 bg-red-500/10 ring-1 ring-red-500/20 rounded-2xl px-4 py-3 flex items-start gap-2.5">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <p className="text-sm text-red-200 leading-relaxed font-medium">Une note en dessous de <strong className="font-bold text-white">8/20</strong> à l&apos;épreuve orale est <strong className="font-bold text-white">éliminatoire</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="py-20 sm:py-28 px-5 fade-in-up">
        <div className="max-w-[860px] mx-auto">
          <h2 className="text-3xl sm:text-[52px] font-extrabold tracking-[-0.03em] leading-[1.05] text-center mb-12">Questions fréquentes</h2>
          <div>
            {FAQ_DATA.map((faq, index) => (
              <div key={index} className="border-b border-black/10 last:border-b-0">
                <button
                  className="w-full px-1 py-[22px] text-left flex justify-between items-center gap-4 cursor-pointer group"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-extrabold text-[19px] leading-snug group-hover:text-black/70 transition">{faq.q}</span>
                  <svg className={`w-5 h-5 shrink-0 text-black/45 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6"/></svg>
                </button>
                <div className="px-1 overflow-hidden transition-all duration-300" style={{ maxHeight: activeFaq === index ? '400px' : '0', opacity: activeFaq === index ? 1 : 0 }}>
                  <p className="pb-6 text-black/55 font-medium leading-relaxed [&_a]:text-red-600 [&_a]:font-bold [&_a]:underline" dangerouslySetInnerHTML={{__html: faq.a}} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
