'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

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

  const inputClass = "w-full pl-11 pr-4 py-3.5 bg-black/[0.03] ring-1 ring-black/[0.08] rounded-2xl focus:ring-2 focus:ring-red-500 focus:bg-white outline-none transition font-medium placeholder:text-black/25"

  return (
    <section className="relative min-h-screen flex items-center justify-center px-5 pt-[96px] pb-16 overflow-hidden">
      <style>{`
        @keyframes glisseSortieG { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(-80px) scale(.96) } }
        @keyframes glisseSortieD { from { opacity:1; transform:translateX(0) } to { opacity:0; transform:translateX(80px) scale(.96) } }
        @keyframes glisseEntreeD { from { opacity:0; transform:translateX(80px) scale(.96) } to { opacity:1; transform:translateX(0) } }
        @keyframes glisseEntreeG { from { opacity:0; transform:translateX(-80px) scale(.96) } to { opacity:1; transform:translateX(0) } }
        .glisse-sortie-g { animation: glisseSortieG .3s cubic-bezier(.55,.06,.68,.19) forwards }
        .glisse-sortie-d { animation: glisseSortieD .3s cubic-bezier(.55,.06,.68,.19) forwards }
        .glisse-entree-d { animation: glisseEntreeD .4s cubic-bezier(.22,1,.36,1) forwards }
        .glisse-entree-g { animation: glisseEntreeG .4s cubic-bezier(.22,1,.36,1) forwards }
      `}</style>
      {/* Décorations */}
      <div aria-hidden="true" className="absolute top-24 -left-24 w-80 h-64 bg-red-500/[0.07] rounded-full blur-3xl pointer-events-none"></div>
      <div aria-hidden="true" className="absolute bottom-16 -right-20 w-72 h-56 bg-indigo-500/[0.06] rounded-full blur-3xl pointer-events-none"></div>

      {signupSuccess ? (
        <div className="relative max-w-md w-full bg-white rounded-[28px] ring-1 ring-black/[0.07] shadow-[0_24px_60px_rgba(0,0,0,0.08)] p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-2">Vérifiez votre email</h2>
          <p className="text-black/50 font-medium">Un lien de confirmation a été envoyé à <strong className="font-bold text-black/80">{signupEmail}</strong>.</p>
          <button onClick={() => { setSignupSuccess(false); switchTo('login') }} className="inline-block mt-7 bg-[#0d0d0d] hover:bg-black/85 text-white font-bold px-7 py-3.5 rounded-full transition cursor-pointer">Aller à la connexion</button>
        </div>
      ) : (
      <div className={`relative max-w-md w-full bg-white rounded-[28px] ring-1 ring-black/[0.07] shadow-[0_24px_60px_rgba(0,0,0,0.08)] p-8 sm:p-10 ${sliding}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-600 text-white p-3 rounded-2xl shadow-lg shadow-red-600/25 mb-5">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mb-1.5 text-center">
            {mode === 'login' ? 'Connectez-vous' : 'Débutez votre essai de 7 jours'}
          </h1>
          <p className="text-black/50 font-medium text-center">
            {mode === 'login' ? "pour accéder à votre espace d'entraînement." : 'Commencez votre entraînement pour le concours FPC.'}
          </p>
        </div>

        <button type="button" onClick={handleGoogle} className="w-full bg-white ring-1 ring-black/10 hover:bg-black/[0.03] font-bold text-base py-3.5 rounded-full transition flex items-center justify-center gap-3 mb-6 cursor-pointer">
          {GoogleIcon} {mode === 'login' ? 'Continuer avec Google' : "S'inscrire avec Google"}
        </button>

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
                  <input type="email" required placeholder="marie.as@hopital.fr" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} className={inputClass}/>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-black/70">Mot de passe</label>
                  <a href="/forgot-password" className="text-xs font-bold text-red-600 hover:text-red-500 transition">Oublié&nbsp;?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{LockIcon}</div>
                  <input type={showLoginPass?"text":"password"} required placeholder="••••••••" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} className={inputClass + ' pr-12'}/>
                  <button type="button" onClick={()=>setShowLoginPass(!showLoginPass)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/30 hover:text-black/60 transition cursor-pointer">{showLoginPass?EyeClosed:EyeOpen}</button>
                </div>
              </div>
              <button type="submit" disabled={loginLoading} className="btn-shine w-full bg-[#0d0d0d] hover:bg-black/85 text-white font-bold text-lg py-4 rounded-full mt-2 transition flex items-center justify-center gap-2 group cursor-pointer">
                {loginLoading?'Connexion en cours...':'Se connecter'}
                {!loginLoading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>}
              </button>
            </form>
            <div className="mt-8 text-center border-t border-black/[0.06] pt-6">
              <p className="text-black/50 font-medium text-sm">Pas encore de compte&nbsp;? <button onClick={()=>switchTo('signup')} className="text-red-600 font-bold hover:text-red-500 transition ml-1 cursor-pointer">S&apos;inscrire gratuitement</button></p>
            </div>
          </>
        ) : (
          <>
            {signupError && <div className="bg-red-500/[0.06] ring-1 ring-red-500/20 text-red-600 text-sm font-bold p-3.5 rounded-2xl mb-4">{signupError}</div>}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black/70 mb-1.5">Prénom</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{UserIcon}</div>
                  <input type="text" required placeholder="Marie" value={firstname} onChange={e=>setFirstname(e.target.value)} className={inputClass}/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black/70 mb-1.5">Adresse email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{MailIcon}</div>
                  <input type="email" required placeholder="marie.as@hopital.fr" value={signupEmail} onChange={e=>setSignupEmail(e.target.value)} className={inputClass}/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black/70 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{LockIcon}</div>
                  <input type={showSignupPass?"text":"password"} required placeholder="••••••••" value={signupPassword} onChange={e=>setSignupPassword(e.target.value)} className={inputClass + ' pr-12'}/>
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
                  <input type={showConfirm?"text":"password"} required placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className={inputClass + ' pr-12'}/>
                  <button type="button" onClick={()=>setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-black/30 hover:text-black/60 transition cursor-pointer">{showConfirm?EyeClosed:EyeOpen}</button>
                </div>
                {confirmPassword && !matches && <p className="text-xs text-red-600 font-bold mt-1.5">Les mots de passe ne correspondent pas.</p>}
              </div>
              <button type="submit" disabled={!canSubmit||signupLoading} className={`w-full font-bold text-lg py-4 rounded-full mt-2 transition flex items-center justify-center gap-2 ${canSubmit&&!signupLoading?'btn-shine bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25 cursor-pointer':'bg-black/[0.05] text-black/30 cursor-not-allowed'}`}>
                {signupLoading?'Création en cours...':'Créer mon compte'}
              </button>
            </form>
            <div className="mt-8 text-center border-t border-black/[0.06] pt-6">
              <p className="text-black/50 font-medium text-sm">Déjà un compte&nbsp;? <button onClick={()=>switchTo('login')} className="text-red-600 font-bold hover:text-red-500 transition ml-1 cursor-pointer">Se connecter</button></p>
            </div>
          </>
        )}
      </div>
      )}
    </section>
  )
}
