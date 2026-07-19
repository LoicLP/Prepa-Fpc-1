'use client'
import { useEffect } from 'react'

// Coche / tiret des lignes du comparatif
const Check = ({ stroke, size = 'w-4 h-4' }) => (
  <svg className={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)
const Tiret = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round"><path d="M5 12h14"/></svg>
)

// Une ligne du tableau : libellé + valeur mensuel + valeur sérénité
const LIGNES = [
  { label: 'Entraînement rédaction et mathématique illimités', mensuel: true, serenite: true },
  { label: "Entraînement à partir d'annales", mensuel: true, serenite: true },
  { label: 'Examen blanc écrit', mensuel: true, serenite: true },
  { label: 'Dashboard personnalisable', mensuel: true, serenite: true },
  { label: 'Méthodologie Dossier & Oral', mensuel: false, serenite: true },
  { label: 'Résiliable à tout moment', mensuel: true, serenite: false },
]

// Styles inline de la colonne Sérénité (surlignage continu sur toute la hauteur)
const COL_S = { background: 'rgba(239,68,68,0.09)', borderLeft: '2px solid #dc2626', borderRight: '2px solid #dc2626' }
const SEP = { borderBottom: '1px solid rgba(255,255,255,0.08)' }

export default function MaquetteTarifsPage() {
  // Fade-in au scroll (même mécanique que la page d'accueil)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="bg-[#0d0d0d] text-white">
      {/* ===================== EN-TÊTE ===================== */}
      <section className="relative px-5 pt-[110px] md:pt-[150px] pb-4 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08]">
            Aborder le concours FPC <span className="surligne">sereinement</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-white/55 font-medium leading-relaxed">
            Accédez à tous les outils spécifiques en illimité pour réussir votre épreuve de sélection FPC.
          </p>
        </div>
      </section>

      {/* ===================== COMPARATIF DES FORMULES ===================== */}
      <section className="relative px-5 pt-10 pb-16 sm:pt-14 sm:pb-24 fade-in-up">
        {/* Décorations */}
        <div aria-hidden="true" className="absolute top-24 -left-24 w-80 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute bottom-10 -right-20 w-72 h-56 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        {/* Annotation manuscrite vers la colonne Sérénité */}
        <div aria-hidden="true" className="absolute hidden lg:block pointer-events-none z-20" style={{top: '-14px', right: '6%'}}>
          <p className="text-[1.55rem] text-red-500 rotate-3" style={{fontFamily: "'Caveat', cursive", fontWeight: 700}}>Le choix des candidats&nbsp;!</p>
          <svg className="w-14 h-14 text-red-500/80 ml-8 mt-1" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M52 5 C 42 24, 28 36, 12 41"/><path d="M22 43 12 41 14 31"/></svg>
        </div>

        <div className="relative max-w-4xl mx-auto grid" style={{gridTemplateColumns: '1.35fr 0.9fr 1fr'}}>

          {/* Ligne d'en-tête : noms des formules et prix */}
          <div></div>
          <div className="px-3 sm:px-5 pt-7 pb-6 text-center">
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/45 mb-3">Formule mensuelle</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] tabular-nums">12,99€</span>
              <span className="text-white/45 font-bold text-xs sm:text-sm">/mois</span>
            </div>
            <p className="text-white/40 text-[11px] font-bold mt-2.5 leading-snug">Renouvellement automatique, résiliable en un clic</p>
          </div>
          <div className="relative px-3 sm:px-5 pt-7 pb-6 text-center rounded-t-[24px]" style={{...COL_S, borderTop: '2px solid #dc2626'}}>
            <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/25 mb-3">−40&nbsp;%</div>
            <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest mb-3" style={{color: '#f87171'}}>Pack Sérénité</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] tabular-nums" style={{color: '#f87171'}}>89,99€</span>
              <span className="text-white/45 font-bold text-xs sm:text-sm">/an</span>
            </div>
            <p className="text-white/40 text-[11px] font-bold mt-2.5 leading-snug">1 seul paiement, pas de renouvellement automatique</p>
          </div>

          {/* Lignes d'avantages */}
          {LIGNES.map((l, i) => (
            <div key={i} className="contents">
              <div className="flex items-center py-4 pr-3 sm:pr-6 text-[13px] sm:text-[15px] text-white/65 font-medium leading-snug" style={SEP}>{l.label}</div>
              <div className="flex items-center justify-center py-4" style={SEP}>
                {l.mensuel ? <Check stroke="#ffffff" /> : <Tiret />}
              </div>
              <div className="flex items-center justify-center py-4" style={{...COL_S, borderBottom: i < LIGNES.length - 1 ? '1px solid rgba(220,38,38,0.22)' : 'none'}}>
                {l.serenite
                  ? <span className="w-6 h-6 rounded-full flex items-center justify-center bg-red-600/20"><Check stroke="#f87171" size="w-3.5 h-3.5" /></span>
                  : <Tiret />}
              </div>
            </div>
          ))}

          {/* Ligne des boutons */}
          <div></div>
          <div className="px-2 sm:px-4 pt-6 pb-2 flex items-start justify-center">
            <a href="/signup" className="w-full max-w-[210px] inline-flex items-center justify-center bg-white hover:bg-white/85 text-[#0d0d0d] font-bold text-[13px] sm:text-[15px] py-3 rounded-full transition">S&apos;abonner</a>
          </div>
          <div className="px-3 sm:px-5 pt-6 pb-7 flex items-start justify-center rounded-b-[24px]" style={{...COL_S, borderBottom: '2px solid #dc2626'}}>
            <a href="/signup" className="btn-shine w-full max-w-[230px] inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-[13px] sm:text-[15px] py-3 rounded-full transition shadow-lg shadow-red-600/25 group">
              S&apos;abonner
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>

        </div>
      </section>

      {/* Espace sous le comparatif */}
      <div className="pb-10 sm:pb-14"></div>
    </div>
  )
}
