'use client'
// Layout partagé des pages publiques : nav pilule, nav mobile, footer et
// styles communs. Toutes les pages de app/(public)/ en héritent.
// Sur l'accueil la nav suit le défilement ; sur les autres pages elle reste en haut.
// Si une session Supabase existe, la nav remplace Connexion/Inscription
// par « Mon tableau de bord ».
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LayoutPublic({ children }) {
  const surAccueil = usePathname() === '/'
  const [connecte, setConnecte] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setConnecte(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setConnecte(!!session))
    return () => subscription.unsubscribe()
  }, [])
  return (
    <div className="min-h-screen bg-white text-[#0d0d0d] antialiased" style={{fontFamily: "'Inter', system-ui, -apple-system, sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Caveat:wght@600;700&display=swap" rel="stylesheet" />
      <style>{`
        html { scroll-behavior: smooth; }
        ::selection { background: rgba(13,13,13,0.9); color: #fff; }
        .fade-in-up { opacity: 0; transform: translateY(20px); transition: opacity 0.7s ease-out, transform 0.7s ease-out; }
        .fade-in-up.visible { opacity: 1; transform: translateY(0); }

        /* Marquee d'écrans (défilement continu, contenu dupliqué) */
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-track { display: flex; width: max-content; animation: marquee 60s linear infinite; }
        .marquee-track:hover { animation-play-state: paused; }

        /* Ticker de logos (plus lent) */
        .ticker-track { display: flex; width: max-content; animation: marquee 80s linear infinite; }
        .ticker-track.reverse { animation-direction: reverse; }
        .ticker-track:hover { animation-play-state: paused; }

        /* Reflet qui balaie le bouton principal */
        .btn-shine { position: relative; overflow: hidden; }
        .btn-shine::after { content: ''; position: absolute; top: 0; bottom: 0; left: -120%; width: 50%; transform: skewX(-45deg); background: rgba(255,255,255,0.35); transition: left 0.8s ease; }
        .btn-shine:hover::after { left: 130%; }

        /* Grille fine du hero, estompée vers le bas */
        .hero-grid {
          background-image: linear-gradient(to right, rgba(15,23,42,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.1) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 85% 75% at 50% 0%, black 35%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 0%, black 35%, transparent 100%);
        }

        /* Surlignage au marqueur : bande translucide aux bords irréguliers */
        .surligne {
          background: linear-gradient(100deg, rgba(239,68,68,0) 0.8%, rgba(239,68,68,0.38) 2.8%, rgba(239,68,68,0.30) 50%, rgba(239,68,68,0.38) 97%, rgba(239,68,68,0) 99.2%);
          border-radius: 0.45em 0.2em 0.55em 0.25em;
          padding: 0.04em 0.22em;
          margin: 0 -0.06em;
          -webkit-box-decoration-break: clone;
          box-decoration-break: clone;
        }

        /* Changement de statistique : simple fondu montant */
        .stat-swap { animation: stat-swap 0.35s ease-out; }
        @keyframes stat-swap { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        /* Chaque caractère du chiffre monte depuis le bas, masqué par le conteneur */
        .char-rise { display: inline-block; animation: char-rise 0.55s cubic-bezier(0.25,1,0.4,1) both; }
        @keyframes char-rise { from { transform: translateY(110%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* La nouvelle tuile de la pile avance depuis l'arrière au lieu d'apparaître d'un coup */
        @keyframes tuile-entree { from { transform: translateY(-7px) scale(0.92); opacity: 0.55; } to { transform: none; opacity: 1; } }
        .tuile-entree { animation: tuile-entree 0.55s cubic-bezier(0.22, 1, 0.36, 1); }

        /* Flottement doux des tuiles éparpillées (superposé au parallaxe de scroll) */
        @keyframes tile-float { 0%, 100% { transform: translateY(-7px); } 50% { transform: translateY(7px); } }
        .tile-float { animation: tile-float 5s ease-in-out infinite; }

        /* Mot du titre façon horloge à palettes : bascule, disparaît, revient recoloré */
        .flip-word { display: inline-block; animation: word-flip 0.84s cubic-bezier(0.45,0,0.25,1) forwards; }
        @keyframes word-flip {
          0%   { transform: perspective(600px) rotateX(0deg); }
          49.9%{ transform: perspective(600px) rotateX(-90deg); }
          50.1%{ transform: perspective(600px) rotateX(90deg); }
          100% { transform: perspective(600px) rotateX(0deg); }
        }

        /* Étapes du quiz : glissement latéral */
        @keyframes slide-in { from { opacity: 0; transform: translateX(42px); } to { opacity: 1; transform: translateX(0); } }
        .slide-in { animation: slide-in 0.35s cubic-bezier(0.25, 1, 0.4, 1) both; }

        /* Compteur d'années : petit pop à chaque changement */
        @keyframes pop { 0% { transform: scale(1); } 45% { transform: scale(1.25); } 100% { transform: scale(1); } }
        .pop { display: inline-block; animation: pop 0.22s ease-out; }

        /* Curseur d'années sur mesure */
        .curseur { -webkit-appearance: none; appearance: none; height: 8px; border-radius: 9999px; outline: none; }
        .curseur::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 3.5px solid #dc2626; box-shadow: 0 2px 10px rgba(0,0,0,0.25); cursor: pointer; }
        .curseur::-moz-range-thumb { width: 26px; height: 26px; border-radius: 50%; background: #fff; border: 3.5px solid #dc2626; box-shadow: 0 2px 10px rgba(0,0,0,0.25); cursor: pointer; }

        /* Tampon « ÉLIGIBLE » qui s'écrase sur le verdict */
        @keyframes stamp-in { 0% { transform: scale(2.4) rotate(-18deg); opacity: 0; } 60% { transform: scale(0.92) rotate(-8deg); opacity: 1; } 100% { transform: scale(1) rotate(-8deg); opacity: 1; } }
        .stamp-in { animation: stamp-in 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) 0.1s both; }

        /* Indice de scroll : chevrons qui descendent en boucle */
        @keyframes scroll-cue { 0% { transform: translateY(-4px); opacity: 0; } 40% { opacity: 1; } 100% { transform: translateY(6px); opacity: 0; } }
        .scroll-cue-1 { animation: scroll-cue 1.6s ease-in-out infinite; }
        .scroll-cue-2 { animation: scroll-cue 1.6s ease-in-out infinite 0.25s; }

        /* Micro qui « écoute » : ondes concentriques qui s'étendent et s'estompent */
        @keyframes micro-pulse { 0% { transform: scale(0.65); opacity: 0.9; } 100% { transform: scale(1.7); opacity: 0; } }
        .micro-pulse { animation: micro-pulse 1.8s ease-out infinite; }
        .micro-pulse-retard { animation: micro-pulse 1.8s ease-out infinite 0.6s; }
        @keyframes micro-beat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        .micro-beat { animation: micro-beat 1.8s ease-in-out infinite; }

        /* Tracé cardiaque du chrono (défilement du trait) */
        @keyframes heartbeat-line { 0% { stroke-dashoffset: 200; } 100% { stroke-dashoffset: 0; } }
        .heartbeat-anim { animation: heartbeat-line 1.5s linear infinite; }

        /* Survol nav : le lien survolé reste net, les autres s'estompent */
        .nav-dim a { transition: opacity 0.25s ease, filter 0.25s ease; }
        .nav-dim:hover a { opacity: 0.3; filter: blur(0.6px); }
        .nav-dim a:hover { opacity: 1; filter: none; }

        /* Fondu sur les bords des marquees */
        .edge-fade { mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent); }
      `}</style>

      {/* ===================== NAVIGATION (pilule flottante) ===================== */}
      <nav className={`hidden md:flex ${surAccueil ? 'fixed' : 'absolute'} left-1/2 top-6 -translate-x-1/2 z-50 h-[60px] w-[min(880px,calc(100vw-40px))] items-center gap-x-6 rounded-full bg-[hsla(0,0%,93%,0.72)] backdrop-blur-xl px-6 py-2`}>
        <a href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80 shrink-0">
          <div className="bg-red-600 text-white p-1.5 rounded-xl shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
          </div>
          <span className="font-black text-lg tracking-tight text-slate-900">Prépa <span className="text-red-600">FPC</span></span>
        </a>
        <div className="nav-dim flex items-center gap-x-1 mx-auto">
          <a href="/" className="px-3.5 py-2 text-[0.95rem] font-bold text-[#0d0d0d]">Accueil</a>
          <a href="/calculs-doses/produit-en-croix" className="px-3.5 py-2 whitespace-nowrap text-[0.95rem] font-bold text-[#0d0d0d]">Calculs de doses</a>
          <a href="/blog" className="px-3.5 py-2 text-[0.95rem] font-bold text-[#0d0d0d]">Blog</a>
          <a href="/tarifs" className="px-3.5 py-2 text-[0.95rem] font-bold text-[#0d0d0d]">Tarifs</a>
        </div>
        <div className="flex items-center gap-x-5 shrink-0">
          {connecte ? (
            <a href="/dashboard" className="inline-flex items-center justify-center h-[44px] bg-[#141414] hover:bg-black/80 text-white text-[0.95rem] font-bold px-4 rounded-full transition">Mon tableau de bord</a>
          ) : (
            <>
              <a href="/auth" className="w-fit text-[0.95rem] font-bold text-[#0d0d0d] transition-opacity hover:opacity-80">Connexion</a>
              <a href="/auth?mode=signup" className="inline-flex items-center justify-center h-[44px] bg-[#141414] hover:bg-black/80 text-white text-[0.95rem] font-bold px-4 rounded-full transition">Inscription</a>
            </>
          )}
        </div>
      </nav>

      {/* Nav mobile (la pilule est masquée sous 720px) */}
      <nav className={`md:hidden ${surAccueil ? 'sticky top-0' : 'relative'} z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 px-5 h-14 flex items-center justify-between`}>
        <a href="/" className="flex items-center gap-2">
          <div className="bg-red-600 text-white p-1 rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
          </div>
          <span className="font-black text-base tracking-tight">Prépa <span className="text-red-600">FPC</span></span>
        </a>
        {connecte ? (
          <a href="/dashboard" className="inline-flex items-center bg-[#141414] text-white text-sm font-bold px-4 py-2 rounded-full">Mon tableau de bord</a>
        ) : (
          <a href="/auth?mode=signup" className="inline-flex items-center bg-[#141414] text-white text-sm font-bold px-4 py-2 rounded-full">Essayer</a>
        )}
      </nav>

      {children}

      {/* ===================== FOOTER (structure façon Partielo) ===================== */}
      <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '48px 48px', maskImage: 'radial-gradient(ellipse 70% 90% at 50% 40%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 90% at 50% 40%, black 30%, transparent 100%)'}}></div>
        <div aria-hidden="true" className="absolute -bottom-32 -right-24 w-[28rem] h-[20rem] bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div aria-hidden="true" className="absolute -bottom-28 -left-20 w-[24rem] h-[18rem] bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-[1200px] mx-auto px-6 sm:px-10 pt-[72px] pb-6">
          <div className="grid grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-x-8 gap-y-12">
            <div className="col-span-2 md:col-span-1">
              <a href="/" className="inline-flex items-center gap-2.5">
                <div className="bg-red-600 text-white p-1.5 rounded-xl">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
                </div>
                <span className="font-extrabold text-lg tracking-tight">Prépa FPC</span>
              </a>
              <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-[280px]">La plateforme d&apos;entraînement dédiée aux candidats en reconversion professionnelle qui préparent le concours FPC. Entraînez-vous dans les conditions réelles du concours.</p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4">Produit</h4>
              <ul className="space-y-3 text-[15px] text-white/85">
                <li><a href="/#entrainement-specifique" className="hover:text-white transition">Entraînement spécifique</a></li>
                <li><a href="/#entrainement-maths" className="hover:text-white transition">Entraînement maths</a></li>
                <li><a href="/#redaction" className="hover:text-white transition">Rédaction</a></li>
                <li><a href="/#examen-blanc" className="hover:text-white transition">Examens blancs</a></li>
                <li><a href="/#preparation-oral" className="hover:text-white transition">Préparation à l&apos;oral</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4">Ressources</h4>
              <ul className="space-y-3 text-[15px] text-white/85">
                <li><a href="/blog" className="hover:text-white transition">Blog</a></li>
                <li><a href="/calculs-doses/produit-en-croix" className="hover:text-white transition">Formules de calculs</a></li>
                <li><a href="mailto:support@prepa-fpc.fr" className="font-bold text-white hover:text-white/80 transition">support@prepa-fpc.fr</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4">Articles populaires</h4>
              <ul className="space-y-3 text-[15px] text-white/85">
                <li><a href="/blog/dates-concours-fpc-infirmier-2026" className="hover:text-white transition">Dates du concours FPC</a></li>
                <li><a href="/blog/dossier-inscription-concours-fpc-infirmier-guide-complet-2026" className="hover:text-white transition">Préparer son dossier FPC</a></li>
                <li><a href="/blog" className="italic text-white/60 hover:text-white transition">Tous nos articles</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-widest mb-4">Informations</h4>
              <ul className="space-y-3 text-[15px] text-white/85">
                <li><a href="/tarifs" className="hover:text-white transition">Tarifs</a></li>
                <li><a href="/mentions-legales" className="hover:text-white transition">Mentions légales</a></li>
                <li><a href="/cgu" className="hover:text-white transition">CGV &amp; CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/45">
            <span>© 2026 Prépa FPC</span>
            <span>Fait avec ❤️ en France</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
