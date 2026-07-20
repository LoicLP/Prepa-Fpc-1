'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

// Les 5 entraînements affichés dans la pile (repris du hero de l'accueil)
const MODULES = [
  { label: 'Calculs de doses', bg: 'linear-gradient(145deg, #ef4444, #dc2626)', ink: '#ffffff', accent: '#dc2626', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg> },
  { label: 'Produit en croix', bg: 'linear-gradient(145deg, #6ee7b7, #34d399)', ink: '#064e3b', accent: '#10b981', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> },
  { label: 'Pourcentages', bg: 'linear-gradient(145deg, #fdba74, #fb923c)', ink: '#431407', accent: '#ea580c', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg> },
  { label: 'Concentration', bg: 'linear-gradient(145deg, #c4b5fd, #a78bfa)', ink: '#2e1065', accent: '#7c3aed', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg> },
  { label: 'Rédaction', bg: 'linear-gradient(145deg, #a5b4fc, #818cf8)', ink: '#1e1b4b', accent: '#6366f1', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg> },
  { label: 'Oral', bg: 'linear-gradient(145deg, #fcd34d, #fbbf24)', ink: '#451a03', accent: '#e5a50c', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg> },
  { label: 'Examen blanc', bg: 'linear-gradient(145deg, #f9a8d4, #f472b6)', ink: '#500724', accent: '#ec4899', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg> },
  { label: 'Culture sanitaire', bg: 'linear-gradient(145deg, #67e8f9, #22d3ee)', ink: '#083344', accent: '#0eb5d4', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg> },
  { label: 'Annales', bg: 'linear-gradient(145deg, #cbd5e1, #94a3b8)', ink: '#0f172a', accent: '#64748b', icon: (c) => <svg className="w-11 h-11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
]

// Pile de modules animée (version agrandie de celle du hero), avec le nom du
// module qui s'affiche dessous dans sa couleur
function PileModules() {
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaving(true)
      const t = setTimeout(() => {
        setIndex(i => (i + 1) % MODULES.length)
        setLeaving(false)
      }, 420)
      return () => clearTimeout(t)
    }, 2400)
    return () => clearInterval(interval)
  }, [])
  const mod = MODULES[index]
  return (
    <div className="flex flex-col items-center">
      {/* Orbes légères qui prennent la couleur de la matière affichée */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="tile-float absolute w-44 h-44 rounded-full blur-3xl" style={{top: '14%', left: '12%', background: `${mod.accent}1c`, transition: 'background 1.2s ease'}}></div>
        <div className="tile-float absolute w-60 h-60 rounded-full blur-3xl" style={{bottom: '12%', right: '8%', background: `${mod.accent}14`, transition: 'background 1.2s ease', animationDelay: '1.6s'}}></div>
        <div className="tile-float absolute w-32 h-32 rounded-full blur-2xl" style={{top: '60%', left: '20%', background: `${mod.accent}10`, transition: 'background 1.2s ease', animationDelay: '3.1s'}}></div>
      </div>
      <div aria-hidden="true" style={{transform: 'scale(1.5)', margin: '36px 0 48px'}}>
        <div className="relative w-[88px] h-[88px] mx-auto">
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
      </div>
      <p key={index} className="stat-swap text-2xl font-extrabold tracking-tight" style={{color: mod.accent}}>{mod.label}</p>

      {/* Preuve sociale : avatars des candidats */}
      <div className="mt-10 flex flex-col items-center gap-2.5">
        <div className="flex">
          {[
            ['#fee2e2', '#dc2626', <path key="t" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z M22 10v6 M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>],
            ['#dbeafe', '#2563eb', <path key="c" d="M20 6 9 17l-5-5"/>],
            ['#fce7f3', '#ec4899', <path key="h" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>],
            ['#fef3c7', '#d97706', <path key="p" d="M12 5v14M5 12h14"/>],
          ].map(([fond, trait, icone], i) => (
            <span key={i} className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-white shadow-sm ${i > 0 ? '-ml-2.5' : ''}`} style={{background: fond}}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={trait} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">{icone}</svg>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ))}
          </span>
          <span className="text-sm font-extrabold text-black/70">4,8/5</span>
        </div>
        <p className="text-sm text-black/45 font-medium text-center max-w-[300px] leading-relaxed">Rejoignez <strong className="font-extrabold text-black/70">1 400 candidats</strong> en reconversion qui ont réussi leur entrée en IFSI grâce à Prépa FPC</p>
      </div>
    </div>
  )
}

// Carte démo du panneau droit (façon Partielo) : CV téléversé → questions générées
function DemoOral() {
  return (
    <div className="relative bg-white rounded-[22px] shadow-[0_24px_70px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.05] w-[440px] max-w-full p-7">
      {/* Badge incliné */}
      <span className="absolute -top-4 -right-3 bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-red-600/30" style={{transform: 'rotate(12deg)'}}>Nouveau</span>

      <p className="text-[11px] font-extrabold uppercase tracking-widest text-red-600 mb-4">Préparation à l&apos;oral</p>

      {/* CV téléversé */}
      <div className="flex items-center gap-3 bg-black/[0.03] ring-1 ring-black/[0.06] rounded-2xl px-4 py-3.5 mb-4">
        <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center shrink-0">
          <svg className="w-4.5 h-4.5 w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">cv_marie_dupont.pdf</p>
          <p className="text-xs font-semibold text-black/40">1,2 MB · Téléversé</p>
        </div>
        <svg className="w-5 h-5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg>
      </div>

      {/* Infos extraites */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-black/[0.03] rounded-xl px-3 py-2.5">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-black/35">Poste</p>
          <p className="text-[13px] font-bold truncate">Aide-soignante</p>
        </div>
        <div className="bg-black/[0.03] rounded-xl px-3 py-2.5">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-black/35">Expérience</p>
          <p className="text-[13px] font-bold truncate">8 ans</p>
        </div>
        <div className="bg-black/[0.03] rounded-xl px-3 py-2.5">
          <p className="text-[9px] font-extrabold uppercase tracking-widest text-black/35">Projet</p>
          <p className="text-[13px] font-bold truncate">IFSI 2026</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-[10px] font-extrabold uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded-md">IA</span>
        <p className="text-sm font-bold">10 questions de jury personnalisées prêtes</p>
      </div>

      {/* Questions générées */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          ['Parcours', 'Racontez votre reconversion'],
          ['Motivation', 'Pourquoi infirmière ?'],
          ['Métier IDE', 'Le rôle au quotidien'],
          ['Expérience', 'Une situation marquante'],
          ['Projet', 'Vous, après l’IFSI'],
          ['Jury', 'Vos points forts'],
        ].map(([cat, q], i) => (
          <div key={i} className="ring-1 ring-black/[0.07] rounded-xl px-3 py-2.5">
            <p className="text-[9px] font-extrabold uppercase tracking-widest text-red-600">{cat}</p>
            <p className="text-[13px] font-semibold text-black/70 leading-snug">{q}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MaquetteAuthPage() {
  const [mode, setMode] = useState('login')
  const [sliding, setSliding] = useState('')

  // Connexion
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Inscription
  const [firstname, setFirstname] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSignupPass, setShowSignupPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [signupError, setSignupError] = useState('')
  const [signupLoading, setSignupLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  // ?mode=signup dans l'URL → ouvrir directement l'inscription
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('mode') === 'signup') setMode('signup')
  }, [])

  const checks = {
    len: signupPassword.length >= 8,
    upper: /[A-Z]/.test(signupPassword),
    num: /[0-9]/.test(signupPassword),
    spec: /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword)
  }
  const allValid = Object.values(checks).every(Boolean)
  const matches = signupPassword === confirmPassword && signupPassword !== ''
  const canSubmit = allValid && matches && firstname && signupEmail

  function switchTo(target) {
    if (target === mode) return
    setSliding(target === 'signup' ? 'glisse-sortie-g' : 'glisse-sortie-d')
    setTimeout(() => {
      setMode(target)
      setSliding(target === 'signup' ? 'glisse-entree-d' : 'glisse-entree-g')
      setTimeout(() => setSliding(''), 400)
    }, 300)
  }

  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
    setLoginLoading(false)
    if (error) setLoginError('Email ou mot de passe incorrect.')
    else window.location.href = '/dashboard'
  }

  async function handleSignup(e) {
    e.preventDefault()
    setSignupError('')
    setSignupLoading(true)
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: { data: { first_name: firstname } }
    })
    setSignupLoading(false)
    if (error) setSignupError(error.message)
    else setSignupSuccess(true)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/dashboard' }
    })
  }

  const EyeOpen = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  const EyeClosed = <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  const GoogleIcon = <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  const LockIcon = <svg className="w-5 h-5 text-black/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  const MailIcon = <svg className="w-5 h-5 text-black/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  const UserIcon = <svg className="w-5 h-5 text-black/30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  const CheckCircle = <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path strokeLinecap="round" strokeLinejoin="round" d="M22 4 12 14.01l-3-3"/></svg>

  const inputClass = "w-full pl-11 py-3.5 bg-black/[0.03] ring-1 ring-black/[0.08] rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition font-medium placeholder:text-black/25"

  const emailValide = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  // Coche verte qui « pop » quand le champ est correctement rempli
  const FieldCheck = ({ show, decale }) => show ? (
    <div className={`absolute inset-y-0 ${decale ? 'right-11' : 'right-0 pr-3.5'} flex items-center pointer-events-none`}>
      <span className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </span>
    </div>
  ) : null

  return (
    <section className="relative lg:grid lg:grid-cols-2 min-h-screen">
      <style>{`
        @keyframes glisseSortieG { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(-80px) scale(.96) } }
        @keyframes glisseSortieD { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(80px) scale(.96) } }
        @keyframes glisseEntreeD { from { opacity:0; transform:translateX(80px) scale(.96) } to { opacity:1; transform:translateX(0) } }
        @keyframes glisseEntreeG { from { opacity:0; transform:translateX(-80px) scale(.96) } to { opacity:1; transform:translateX(0) } }
        .glisse-sortie-g { animation: glisseSortieG .3s cubic-bezier(.55,.06,.68,.19) forwards }
        .glisse-sortie-d { animation: glisseSortieD .3s cubic-bezier(.55,.06,.68,.19) forwards }
        .glisse-entree-d { animation: glisseEntreeD .4s cubic-bezier(.22,1,.36,1) forwards }
        .glisse-entree-g { animation: glisseEntreeG .4s cubic-bezier(.22,1,.36,1) forwards }
        /* Neutralise le fond bleu du remplissage automatique de Chrome */
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #f7f7f7 inset;
          -webkit-text-fill-color: #0d0d0d;
          caret-color: #0d0d0d;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>

      {/* ===================== COLONNE GAUCHE : FORMULAIRE ===================== */}
      <div className="flex items-center justify-center px-6 pt-[110px] pb-14 min-h-screen">
        {signupSuccess ? (
          <div className="max-w-[420px] w-full text-center">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Vérifiez votre email</h2>
            <p className="text-black/50 font-medium">Un lien de confirmation a été envoyé à <strong className="font-bold text-black/80">{signupEmail}</strong>.</p>
            <button onClick={() => { setSignupSuccess(false); switchTo('login') }} className="inline-block mt-7 bg-[#0d0d0d] hover:bg-black/85 text-white font-bold px-7 py-3.5 rounded-full transition cursor-pointer">Aller à la connexion</button>
          </div>
        ) : (
        <div className={`max-w-[420px] w-full ${sliding}`}>
          <h1 className="text-4xl sm:text-[2.9rem] font-extrabold tracking-[-0.03em] leading-[1.05] mb-3">
            {mode === 'login' ? 'Ravis de vous revoir !' : 'Débutez votre essai de 7 jours'}
          </h1>
          <p className="text-black/50 font-medium text-lg mb-8">
            {mode === 'login' ? 'Connectez-vous pour reprendre votre entraînement.' : 'Commencez votre entraînement pour le concours FPC, sans frais.'}
          </p>

          <div className="relative">
            {/* Annotation manuscrite vers le bouton Google */}
            <div aria-hidden="true" className="absolute hidden lg:block pointer-events-none" style={{left: 'calc(100% + 18px)', top: '-44px', width: '170px'}}>
              <p className="text-[1.45rem] text-red-500 whitespace-nowrap" style={{fontFamily: "'Caveat', cursive", fontWeight: 700, transform: 'rotate(6deg)'}}>Privilégiez Google&nbsp;!</p>
              <svg className="w-12 h-12 text-red-500/80 mt-0.5 ml-2" viewBox="0 0 60 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M52 5 C 42 22, 30 34, 14 40"/><path d="M24 43 14 40 17 30"/></svg>
            </div>
            <button type="button" onClick={handleGoogle} className="w-full bg-white ring-1 ring-black/10 hover:bg-black/[0.03] font-bold text-base py-3.5 rounded-full transition flex items-center justify-center gap-3 mb-6 cursor-pointer">
              {GoogleIcon} {mode === 'login' ? 'Continuer avec Google' : "S'inscrire avec Google"}
            </button>
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-black/[0.08]"></div>
            <span className="flex-shrink-0 mx-4 text-black/35 text-xs font-extrabold uppercase tracking-widest">ou par email</span>
            <div className="flex-grow border-t border-black/[0.08]"></div>
          </div>

          {mode === 'login' ? (
            <>
              {loginError && <div className="bg-red-500/[0.06] ring-1 ring-red-500/20 text-red-600 text-sm font-bold p-3.5 rounded-2xl mb-4">{loginError}</div>}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{MailIcon}</div>
                    <input type="email" required placeholder="marie.as@hopital.fr" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className={inputClass + ' pr-12'}/>
                    <FieldCheck show={emailValide(loginEmail)} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-bold text-black/70">Mot de passe</label>
                    <a href="/forgot-password" className="text-xs font-bold text-red-600 hover:text-red-500 transition">Oublié&nbsp;?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{LockIcon}</div>
                    <input type={showLoginPass?"text":"password"} required placeholder="••••••••" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className={inputClass + ' pr-20'}/>
                    <FieldCheck show={loginPassword.length > 0} decale />
                    <button type="button" onClick={()=>setShowLoginPass(!showLoginPass)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/30 hover:text-black/60 transition cursor-pointer">{showLoginPass?EyeClosed:EyeOpen}</button>
                  </div>
                </div>
                <button type="submit" disabled={!(emailValide(loginEmail) && loginPassword.length > 0)||loginLoading} className={`w-full font-bold text-lg py-4 rounded-full mt-2 transition flex items-center justify-center gap-2 group ${emailValide(loginEmail) && loginPassword.length > 0 && !loginLoading ? 'btn-shine bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 cursor-pointer' : 'bg-black/[0.05] text-black/30 cursor-not-allowed'}`}>
                  {loginLoading?'Connexion en cours...':'Se connecter'}
                  {!loginLoading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>}
                </button>
              </form>
              <p className="mt-7 text-center text-black/50 font-medium text-sm">Pas encore de compte&nbsp;? <button onClick={()=>switchTo('signup')} className="text-red-600 font-bold hover:text-red-500 transition ml-1 cursor-pointer">S&apos;inscrire gratuitement</button></p>
            </>
          ) : (
            <>
              {signupError && <div className="bg-red-500/[0.06] ring-1 ring-red-500/20 text-red-600 text-sm font-bold p-3.5 rounded-2xl mb-4">{signupError}</div>}
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-1.5">Prénom</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{UserIcon}</div>
                    <input type="text" required placeholder="Marie" value={firstname} onChange={e=>setFirstname(e.target.value)} className={inputClass + ' pr-12'}/>
                    <FieldCheck show={firstname.trim().length >= 2} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{MailIcon}</div>
                    <input type="email" required placeholder="marie.as@hopital.fr" value={signupEmail} onChange={e=>setSignupEmail(e.target.value)} className={inputClass + ' pr-12'}/>
                    <FieldCheck show={emailValide(signupEmail)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{LockIcon}</div>
                    <input type={showSignupPass?"text":"password"} required placeholder="••••••••" value={signupPassword} onChange={e=>setSignupPassword(e.target.value)} className={inputClass + ' pr-20'}/>
                    <FieldCheck show={allValid} decale />
                    <button type="button" onClick={()=>setShowSignupPass(!showSignupPass)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/30 hover:text-black/60 transition cursor-pointer">{showSignupPass?EyeClosed:EyeOpen}</button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs font-bold">
                    <div className={`flex items-center gap-1.5 transition-colors ${checks.len?'text-red-600':'text-black/30'}`}>{CheckCircle} 8+ caractères</div>
                    <div className={`flex items-center gap-1.5 transition-colors ${checks.upper?'text-red-600':'text-black/30'}`}>{CheckCircle} 1 Majuscule</div>
                    <div className={`flex items-center gap-1.5 transition-colors ${checks.num?'text-red-600':'text-black/30'}`}>{CheckCircle} 1 Chiffre</div>
                    <div className={`flex items-center gap-1.5 transition-colors ${checks.spec?'text-red-600':'text-black/30'}`}>{CheckCircle} 1 Caractère spécial</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black/70 mb-1.5">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{LockIcon}</div>
                    <input type={showConfirm?"text":"password"} required placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className={inputClass + ' pr-20'}/>
                    <FieldCheck show={matches} decale />
                    <button type="button" onClick={()=>setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/30 hover:text-black/60 transition cursor-pointer">{showConfirm?EyeClosed:EyeOpen}</button>
                  </div>
                  {confirmPassword && !matches && <p className="text-xs text-red-600 font-bold mt-1.5">Les mots de passe ne correspondent pas.</p>}
                </div>
                <button type="submit" disabled={!canSubmit||signupLoading} className={`w-full font-bold text-lg py-4 rounded-full mt-2 transition flex items-center justify-center gap-2 ${canSubmit&&!signupLoading?'btn-shine bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 cursor-pointer':'bg-black/[0.05] text-black/30 cursor-not-allowed'}`}>
                  {signupLoading?'Création en cours...':'Créer mon compte'}
                </button>
              </form>
              <p className="mt-7 text-center text-black/50 font-medium text-sm">Déjà un compte&nbsp;? <button onClick={()=>switchTo('login')} className="text-red-600 font-bold hover:text-red-500 transition ml-1 cursor-pointer">Se connecter</button></p>
            </>
          )}

          <p className="mt-8 text-center text-xs text-black/35 font-medium leading-relaxed">En continuant sur Prépa FPC, vous acceptez nos <a href="/maquette/cgu" className="underline hover:text-black/60 transition">Conditions Générales d&apos;Utilisation</a>.</p>
        </div>
        )}
      </div>

      {/* ===================== COLONNE DROITE : DÉMO PRODUIT ===================== */}
      <div className="hidden lg:flex items-center justify-center relative pt-[96px] pb-14 px-10 overflow-hidden">
        <PileModules />
      </div>
    </section>
  )
}
