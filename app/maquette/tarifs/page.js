'use client'
import { useEffect } from 'react'

// Coche des listes d'avantages
const Check = ({ stroke }) => (
  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
)

export default function MaquetteTarifsPage() {
  // Fade-in au scroll (même mécanique que la page d'accueil)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const mensuel = ["Entraînement rédaction et mathématique illimités", "Entraînement à partir d'annales", "Examen blanc écrit", "Dashboard personnalisable", "Résiliable à tout moment"]
  const serenite = ["Entraînement rédaction et mathématique illimités", "Entraînement à partir d'annales", "Examen blanc écrit", "Dashboard personnalisable", "Méthodologie Dossier & Oral"]

  return (
    <>
      {/* ===================== EN-TÊTE ===================== */}
      <section className="relative px-5 pt-[110px] md:pt-[150px] pb-4 text-center">
        <div aria-hidden="true" className="hero-grid absolute inset-0 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08]">
            Aborder le concours FPC <span className="surligne">sereinement</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-black/55 font-medium leading-relaxed">
            Accédez à tous les outils spécifiques pour réussir votre épreuve de sélection FPC.
          </p>
        </div>
      </section>

      {/* ===================== CARTES DE PRIX ===================== */}
      <section className="relative px-5 pt-10 pb-16 sm:pt-14 sm:pb-24 fade-in-up">
        {/* Décorations */}
        <div aria-hidden="true" className="absolute top-24 -left-24 w-80 h-64 bg-red-500/[0.07] rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute bottom-10 -right-20 w-72 h-56 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none"></div>
        {/* Annotation manuscrite vers le Pack Sérénité */}
        <div aria-hidden="true" className="absolute hidden lg:block pointer-events-none z-20" style={{top: '-6px', right: '7%'}}>
          <p className="text-[1.55rem] text-red-500 rotate-3" style={{fontFamily: "'Caveat', cursive", fontWeight: 700}}>Le choix des candidats&nbsp;!</p>
          <svg className="w-14 h-14 text-red-500/80 ml-8 mt-1" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M52 5 C 42 24, 28 36, 12 41"/><path d="M22 43 12 41 14 31"/></svg>
        </div>

        <div className="relative max-w-4xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">

          {/* Formule mensuelle */}
          <div className="bg-white rounded-[28px] ring-1 ring-black/[0.07] p-8 sm:p-10 flex flex-col transition-transform duration-300 hover:-translate-y-1">
            <div className="mb-7">
              <p className="text-xs font-extrabold uppercase tracking-widest text-black/45 mb-3">Formule mensuelle</p>
              <p className="text-black/55 font-medium text-[15px] leading-relaxed">Flexibilité totale pour réviser à votre rythme, sans engagement.</p>
            </div>
            <div className="mb-8">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold tracking-[-0.03em] tabular-nums">12,99€</span>
                <span className="text-black/45 font-bold">/mois</span>
              </div>
              <p className="text-black/40 text-xs font-bold mt-2.5">Renouvellement automatique · résiliable en un clic</p>
            </div>
            <ul className="space-y-3.5 mb-10 flex-1">
              {mensuel.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-black/[0.05]">
                    <Check stroke="#0d0d0d" />
                  </span>
                  <span className="text-[15px] text-black/60 font-medium leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <a href="/signup" className="w-full inline-flex items-center justify-center gap-2 bg-[#0d0d0d] hover:bg-black/85 text-white font-bold text-base py-3.5 rounded-full transition group">
              S&apos;abonner maintenant
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>

          {/* Pack Sérénité */}
          <div className="relative bg-white rounded-[28px] ring-2 ring-red-600 p-8 sm:p-10 flex flex-col shadow-[0_24px_60px_rgba(220,38,38,0.13)] transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
            <div aria-hidden="true" className="absolute -top-16 -right-16 w-56 h-56 bg-red-500/[0.06] rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-6 right-6 bg-red-600 text-white px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/30">−40&nbsp;%</div>
            <div className="mb-7 relative">
              <p className="text-xs font-extrabold uppercase tracking-widest text-red-600 mb-3">Pack Sérénité</p>
              <p className="text-black/55 font-medium text-[15px] leading-relaxed">Accès complet au site pendant 1 an, en un seul paiement.</p>
            </div>
            <div className="mb-8 relative">
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold tracking-[-0.03em] tabular-nums text-red-600">89,99€</span>
                <span className="text-black/45 font-bold">pour 1 an</span>
              </div>
              <p className="text-black/40 text-xs font-bold mt-2.5">1 seul paiement · pas de renouvellement automatique</p>
            </div>
            <ul className="space-y-3.5 mb-10 flex-1 relative">
              {serenite.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{background: '#fef2f2'}}>
                    <Check stroke="#dc2626" />
                  </span>
                  <span className="text-[15px] text-black/70 font-semibold leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <a href="/signup" className="btn-shine relative w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-base py-3.5 rounded-full transition shadow-lg shadow-red-600/25 group">
              S&apos;abonner maintenant
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </div>

        </div>
      </section>

      {/* ===================== RÉASSURANCE ===================== */}
      <section className="px-5 pb-20 sm:pb-28 fade-in-up">
        <div className="max-w-4xl mx-auto border-t border-black/[0.07] pt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
          <div className="flex flex-col items-center text-center gap-3">
            <svg className="w-7 h-7 text-black/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            <span className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest leading-tight">Paiement 100% sécurisé</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <svg className="w-7 h-7 text-black/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest leading-tight">Cartes bancaires</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <svg className="w-7 h-7 text-black/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest leading-tight">Activation immédiate</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <svg className="w-7 h-7 text-black/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest leading-tight">Sans engagement (mensuel)</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-7 h-7 bg-[#635BFF] rounded-lg flex items-center justify-center">
              <svg className="h-3.5" viewBox="0 0 60 25" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M60 12.8C60 8.55 57.95 5.18 54.04 5.18C50.11 5.18 47.72 8.55 47.72 12.77C47.72 17.73 50.53 20.33 54.52 20.33C56.47 20.33 57.95 19.87 59.08 19.22V16.08C57.95 16.66 56.65 17.01 55.01 17.01C53.4 17.01 51.97 16.43 51.79 14.5H59.96C59.96 14.29 60 13.33 60 12.8ZM51.73 11.73C51.73 9.88 52.78 9.1 54.02 9.1C55.22 9.1 56.21 9.88 56.21 11.73H51.73ZM41.3 5.18C39.67 5.18 38.6 5.95 38.01 6.48L37.81 5.41H34.38V24.84L38.19 24.03V20.1C38.8 20.53 39.69 21.14 41.28 21.14C44.54 21.14 47.5 18.55 47.5 12.72C47.48 7.41 44.48 5.18 41.3 5.18ZM40.45 17.36C39.36 17.36 38.72 16.97 38.29 16.5L38.19 9.36C38.66 8.83 39.32 8.47 40.45 8.47C42.22 8.47 43.45 10.42 43.45 12.9C43.45 15.43 42.24 17.36 40.45 17.36ZM29.1 4.13L32.93 3.32V0.12L29.1 0.92V4.13ZM29.1 5.43H32.93V20.85H29.1V5.43ZM24.76 6.62L24.52 5.43H21.15V20.85H24.96V9.75C25.87 8.55 27.4 8.78 27.87 8.95V5.43C27.38 5.24 25.67 4.9 24.76 6.62ZM17.01 1.69L13.28 2.48L13.26 16.29C13.26 18.57 14.95 20.35 17.23 20.35C18.48 20.35 19.4 20.12 19.91 19.85V16.64C19.42 16.83 17.01 17.53 17.01 15.25V8.73H19.91V5.43H17.01V1.69ZM5.26 9.36C5.26 8.7 5.8 8.43 6.67 8.43C7.94 8.43 9.54 8.83 10.81 9.55V5.93C9.42 5.37 8.05 5.16 6.67 5.16C3.49 5.16 1.38 6.86 1.38 9.55C1.38 13.76 7.08 13.1 7.08 14.89C7.08 15.68 6.42 15.95 5.49 15.95C4.1 15.95 2.33 15.39 0.92 14.58V18.25C2.49 18.93 4.08 19.22 5.49 19.22C8.75 19.22 10.98 17.57 10.98 14.84C10.96 10.29 5.26 11.09 5.26 9.36Z" fill="white"/></svg>
            </div>
            <span className="text-[11px] font-extrabold text-black/40 uppercase tracking-widest leading-tight">Partenaire de paiement</span>
          </div>
        </div>
      </section>
    </>
  )
}
