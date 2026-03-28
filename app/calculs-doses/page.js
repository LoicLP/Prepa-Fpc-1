'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'

const Stethoscope = ({className}) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>

export default function CalculsDosesPage() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('fiches')
  const [exCategory, setExCategory] = useState('concentrations')
  const [exercise, setExercise] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [exState, setExState] = useState('idle')
  const [exLoading, setExLoading] = useState(false)
  const [exError, setExError] = useState('')
  const [exRemaining, setExRemaining] = useState(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 })
  const ficheRefs = useRef([])

  async function downloadFiche(index, title) {
    const el = ficheRefs.current[index]
    if (!el) return
    const html2pdf = (await import('html2pdf.js')).default
    html2pdf().set({
      margin: 10,
      filename: `fiche-${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(el).save()
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function generateExercise() {
    setExLoading(true)
    setExError('')
    setExercise(null)
    setUserAnswer('')
    setExState('idle')
    try {
      const res = await fetch('/api/calculs-doses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: exCategory }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExercise(data.exercise)
      if (data.remaining !== undefined) setExRemaining(data.remaining)
    } catch (err) {
      setExError(err.message)
    }
    setExLoading(false)
  }

  function checkAnswer() {
    if (!userAnswer || !exercise) return
    const userVal = parseFloat(userAnswer.replace(',', '.'))
    const expectedVal = parseFloat(exercise.answer)
    const tolerance = exCategory === 'debit' ? 1 : 0.1
    const correct = Math.abs(userVal - expectedVal) <= tolerance
    setIsCorrect(correct)
    setExState('answered')
    setSessionScore(prev => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const navLinks = [
    { href: '/', label: 'Accueil', active: false },
    { href: '/calculs-doses', label: 'Calculs de doses', active: true },
    { href: '/blog', label: 'Blog', active: false },
    { href: '/tarifs', label: 'Tarifs', active: false }
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-red-200 flex flex-col">

      {/* NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-2 rounded-xl shadow-sm"><Stethoscope className="w-7 h-7" /></div>
            <div>
              <span className="font-black text-2xl tracking-tight text-slate-900 block leading-none">Prépa <span className="text-red-600">FPC</span></span>
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">La passerelle IFSI</span>
            </div>
          </a>
          <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className={link.active ? 'text-red-600' : 'hover:text-red-600 transition'}>{link.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {!authLoading && (user ? (
              <>
                <a href="/dashboard" className="hidden md:inline-flex bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-red-200 transition transform hover:-translate-y-0.5 text-sm">Mon tableau de bord</a>
                <button onClick={handleLogout} className="hidden md:block text-slate-400 hover:text-red-600 transition cursor-pointer"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></button>
              </>
            ) : (
              <>
                <a href="/login" className="hidden md:block text-slate-600 font-bold hover:text-slate-900 transition text-sm">Connexion</a>
                <a href="/signup" className="hidden md:inline-flex bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-slate-200 transition transform hover:-translate-y-0.5 text-sm">Inscription</a>
              </>
            ))}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white pb-4 shadow-lg absolute w-full z-40">
            <div className="max-w-6xl mx-auto px-4 pt-4 space-y-2">
              {navLinks.map(link => (
                <a key={link.label} href={link.href} className={`block py-3 px-4 rounded-xl font-bold transition ${link.active ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:bg-slate-50'}`}>{link.label}</a>
              ))}
              <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-2">
                {user ? (
                  <>
                    <a href="/dashboard" className="block py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition text-center">Mon espace</a>
                    <button onClick={handleLogout} className="block py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition text-center w-full">Déconnexion</button>
                  </>
                ) : (
                  <>
                    <a href="/login" className="block py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition text-center">Connexion</a>
                    <a href="/signup" className="block py-3 px-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-black transition text-center">Inscription</a>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* HEADER */}
      <header className="pt-16 pb-8 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Maîtrisez parfaitement les <span className="text-red-600">calculs de doses</span></h1>
          <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">Révisez les formules avec les 4 fiches de révisions indispensables et entraînez-vous avec des exercices !</p>
        </div>
      </header>

      {/* ONGLETS */}
      <div className="bg-slate-50 pb-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")"}}></div>
        <div className="flex justify-center gap-2 relative z-10">
          <button onClick={() => setActiveTab('fiches')} className={`px-6 py-2.5 rounded-full font-bold text-sm transition cursor-pointer ${activeTab === 'fiches' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>Fiches de révision</button>
          <button onClick={() => setActiveTab('exercices')} className={`px-6 py-2.5 rounded-full font-bold text-sm transition cursor-pointer ${activeTab === 'exercices' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>Générateur d'exercices</button>
        </div>
      </div>

      {/* ==================== FICHES DE RÉVISION ==================== */}
      {activeTab === 'fiches' && (
        <>
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-200 to-slate-50">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">

            {/* Produit en croix */}
            <div ref={el => ficheRefs.current[0] = el} className="bg-white rounded-3xl shadow-md p-7 hover:shadow-lg transition border-2 border-purple-300" style={{backgroundImage:'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize:'16px 16px'}}>
              <div className="relative mb-5 text-center">
                <h3 className="text-xl font-black text-slate-900">Le Produit en croix</h3>
                <button onClick={() => downloadFiche(0, 'produit-en-croix')} className="absolute right-0 top-0 text-slate-400 hover:text-red-600 transition cursor-pointer" title="Télécharger en PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
              </div>
              <div className="bg-purple-200 rounded-2xl p-5 text-center mb-6">
                <p className="text-2xl font-black text-purple-900">x = (a × d) / b</p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Méthode</p>
              <ul className="space-y-2 text-slate-600 text-sm mb-6">
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">&#x2794;</span>Identifier les deux paires de <mark className="bg-purple-100 text-inherit px-1 rounded">valeurs liées</mark></li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">&#x2794;</span>Vérifier que les <mark className="bg-purple-100 text-inherit px-1 rounded">unités sont identiques</mark></li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">&#x2794;</span>Multiplier en <mark className="bg-purple-100 text-inherit px-1 rounded">diagonale</mark></li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">&#x2794;</span>Diviser par la valeur restante</li>
              </ul>
              <p className="text-sm font-black text-slate-900 mb-2">Exemples</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>750 mg</strong> d'amoxicilline. Flacon : 500 mg / 5 ml.<br/>x = (750 × 5) / 500 = <mark className="bg-purple-200 text-inherit px-1 rounded font-bold">7,5 ml</mark></p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>200 mg</strong> de paracétamol. Sirop : 120 mg / 5 ml.<br/>x = (200 × 5) / 120 = <mark className="bg-purple-200 text-inherit px-1 rounded font-bold">8,3 ml</mark></p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Pièges</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>&#x2022; Oublier de <mark className="bg-purple-100 text-inherit px-1 rounded">convertir</mark> dans la même unité</li>
                <li>&#x2022; Inverser les valeurs dans la croix</li>
                <li>&#x2022; Ne pas vérifier la cohérence du résultat</li>
              </ul>
            </div>

            {/* Débit en gouttes/min */}
            <div ref={el => ficheRefs.current[1] = el} className="bg-white rounded-3xl shadow-md p-7 hover:shadow-lg transition border-2 border-blue-300" style={{backgroundImage:'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize:'16px 16px'}}>
              <div className="relative mb-5 text-center">
                <h3 className="text-xl font-black text-slate-900">Débit en gouttes/min</h3>
                <button onClick={() => downloadFiche(1, 'debit-gouttes-min')} className="absolute right-0 top-0 text-slate-400 hover:text-red-600 transition cursor-pointer" title="Télécharger en PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
              </div>
              <div className="bg-blue-200 rounded-2xl p-5 text-center mb-2">
                <p className="text-xl font-black text-blue-900">Débit = (Vol × 20) / (Temps × 60)</p>
              </div>
              <p className="text-center text-xs font-bold text-slate-400 mb-6">Simplifiée : <mark className="bg-blue-100 text-inherit px-1 rounded">Vol / (Temps × 3)</mark></p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Standard</p>
                  <p className="text-lg font-black text-slate-900">1 ml = <mark className="bg-blue-100 text-inherit px-1 rounded">20 gttes</mark></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Pédiatrique</p>
                  <p className="text-lg font-black text-slate-900">1 ml = <mark className="bg-blue-100 text-inherit px-1 rounded">60 gttes</mark></p>
                </div>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Exemples</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>1000 ml</strong> NaCl en <strong>6h</strong> (standard)<br/>(1000 × 20) / (6 × 60) = <mark className="bg-blue-200 text-inherit px-1 rounded font-bold">56 gouttes/min</mark></p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>250 ml</strong> en <strong>2h</strong> (standard)<br/>250 / (2 × 3) = <mark className="bg-blue-200 text-inherit px-1 rounded font-bold">42 gouttes/min</mark></p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Pièges</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>&#x2022; Confondre <mark className="bg-blue-100 text-inherit px-1 rounded">standard (×20)</mark> et <mark className="bg-blue-100 text-inherit px-1 rounded">pédiatrique (×60)</mark></li>
                <li>&#x2022; Oublier de convertir les heures en minutes</li>
                <li>&#x2022; Arrondir à l'entier (pas de demi-gouttes)</li>
              </ul>
            </div>

            {/* Conversions */}
            <div ref={el => ficheRefs.current[2] = el} className="bg-white rounded-3xl shadow-md p-7 hover:shadow-lg transition border-2 border-green-300" style={{backgroundImage:'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize:'16px 16px'}}>
              <div className="relative mb-5 text-center">
                <h3 className="text-xl font-black text-slate-900">Conversions de masse</h3>
                <button onClick={() => downloadFiche(2, 'conversions-masse')} className="absolute right-0 top-0 text-slate-400 hover:text-red-600 transition cursor-pointer" title="Télécharger en PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
              </div>
              <div className="bg-green-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xl font-black text-green-900">1 g</span>
                  <span className="text-slate-300">=</span>
                  <span className="text-xl font-black text-green-900">1 000 mg</span>
                  <span className="text-slate-300">=</span>
                  <span className="text-xl font-black text-green-900">1 000 000 µg</span>
                </div>
                <p className="text-center text-xs font-bold text-slate-400 mt-2">× <mark className="bg-green-200 text-inherit px-1 rounded">1 000</mark> à chaque étape</p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Exemples</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>0,075 g = ? mg</strong><br/>0,075 × 1 000 = <mark className="bg-green-200 text-inherit px-1 rounded font-bold">75 mg</mark> (virgule → 3 rangs à droite)</p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>2 500 µg = ? mg</strong><br/>2 500 / 1 000 = <mark className="bg-green-200 text-inherit px-1 rounded font-bold">2,5 mg</mark> (virgule → 3 rangs à gauche)</p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Pièges</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>&#x2022; Déplacer la virgule dans le <mark className="bg-green-100 text-inherit px-1 rounded">mauvais sens</mark></li>
                <li>&#x2022; Convertir AVANT le calcul de dose</li>
                <li>&#x2022; mg ≠ µg (facteur 1 000 = <mark className="bg-green-100 text-inherit px-1 rounded">surdosage</mark>)</li>
              </ul>
            </div>

            {/* Concentrations */}
            <div ref={el => ficheRefs.current[3] = el} className="bg-white rounded-3xl shadow-md p-7 hover:shadow-lg transition border-2 border-amber-300" style={{backgroundImage:'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize:'16px 16px'}}>
              <div className="relative mb-5 text-center">
                <h3 className="text-xl font-black text-slate-900">Concentration en %</h3>
                <button onClick={() => downloadFiche(3, 'concentration-pourcentage')} className="absolute right-0 top-0 text-slate-400 hover:text-red-600 transition cursor-pointer" title="Télécharger en PDF"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
              </div>
              <div className="bg-amber-200 rounded-2xl p-5 text-center mb-6">
                <p className="text-2xl font-black text-amber-900">X% = X g pour 100 ml</p>
                <p className="text-xs font-bold text-slate-400 mt-1">LA règle à retenir</p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Méthode</p>
              <ul className="space-y-2 text-slate-600 text-sm mb-6">
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#x2794;</span>Lire le % → nombre de <mark className="bg-amber-100 text-inherit px-1 rounded">g pour 100 ml</mark></li>
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">&#x2794;</span><mark className="bg-amber-100 text-inherit px-1 rounded">Produit en croix</mark> pour tout autre volume</li>
              </ul>
              <p className="text-sm font-black text-slate-900 mb-2">Exemples</p>
              <div className="space-y-2 mb-6">
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>G5%</strong>, flacon 500 ml → (5 × 500) / 100 = <mark className="bg-amber-200 text-inherit px-1 rounded font-bold">25 g</mark></p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>Bétadine 10%</strong>, 125 ml → (10 × 125) / 100 = <mark className="bg-amber-200 text-inherit px-1 rounded font-bold">12,5 g</mark></p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3"><strong>NaCl 0,9%</strong>, poche 1L → (0,9 × 1000) / 100 = <mark className="bg-amber-200 text-inherit px-1 rounded font-bold">9 g</mark></p>
              </div>
              <p className="text-sm font-black text-slate-900 mb-2">Pièges</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>&#x2022; 0,9% = <mark className="bg-amber-100 text-inherit px-1 rounded">0,9 g</mark> (pas 9 g) pour 100 ml</li>
                <li>&#x2022; Convertir les <mark className="bg-amber-100 text-inherit px-1 rounded">litres en ml</mark> avant le calcul</li>
                <li>&#x2022; Ne pas confondre % et g/L</li>
              </ul>
            </div>

          </div>
        </section>

        {/* Astuces calcul mental */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-slate-900 mb-3">Astuces de calcul mental</h2>
              <p className="text-slate-600 font-medium text-sm">Les raccourcis qui font gagner du temps le jour J.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4">1</div>
                <h4 className="font-bold text-slate-900 mb-2">Diviser par 0,5</h4>
                <p className="text-slate-600 text-sm font-medium">Diviser par 0,5 revient à <strong className="text-slate-800">multiplier par 2</strong>. Exemple : 60 / 0,5 = 120.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4">2</div>
                <h4 className="font-bold text-slate-900 mb-2">Diviser par 0,25</h4>
                <p className="text-slate-600 text-sm font-medium">Diviser par 0,25 revient à <strong className="text-slate-800">multiplier par 4</strong>. Très courant dans les dilutions.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg mb-4">3</div>
                <h4 className="font-bold text-slate-900 mb-2">Trouver 10% puis ajuster</h4>
                <p className="text-slate-600 text-sm font-medium">Pour trouver 5%, calculez <strong className="text-slate-800">10% puis divisez par 2</strong>. Rapide et fiable.</p>
              </div>
            </div>
          </div>
        </section>
        </>
      )}

      {/* ==================== GÉNÉRATEUR D'EXERCICES ==================== */}
      {activeTab === 'exercices' && (
        <section className="py-12 bg-slate-50 flex-1">
          <div className="max-w-2xl mx-auto px-4">

            {/* Sélection catégorie */}
            <div className="flex justify-center gap-3 mb-8">
              <button onClick={() => { setExCategory('concentrations'); setExercise(null); setExState('idle') }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${exCategory === 'concentrations' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>Concentrations en %</button>
              <button onClick={() => { setExCategory('debit'); setExercise(null); setExState('idle') }} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${exCategory === 'debit' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}>Débit gouttes/min</button>
            </div>

            {/* Compteur */}
            <div className="text-center mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{exRemaining !== null ? `${exRemaining} exercice${exRemaining > 1 ? 's' : ''} restant${exRemaining > 1 ? 's' : ''} aujourd'hui` : '20 exercices / jour'}</span>
            </div>

            {/* Bouton générer */}
            {!exercise && (
              <div className="text-center">
                <button onClick={generateExercise} disabled={exLoading} className="bg-red-600 hover:bg-red-700 text-white font-black px-8 py-4 rounded-2xl transition shadow-lg shadow-red-200 text-sm cursor-pointer disabled:opacity-50">
                  {exLoading ? (
                    <span className="flex items-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Génération en cours...</span>
                  ) : 'Générer un exercice'}
                </button>
                {exError && <p className="text-red-600 font-bold text-sm mt-4">{exError}</p>}
              </div>
            )}

            {/* Exercice */}
            {exercise && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${exCategory === 'concentrations' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{exCategory === 'concentrations' ? 'Concentration' : 'Débit'}</span>
                  </div>
                  <p className="text-slate-900 font-bold text-lg leading-relaxed mb-6">{exercise.question}</p>

                  {exState === 'idle' && (
                    <div>
                      <div className="flex gap-3">
                        <input type="number" step="any" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && userAnswer && checkAnswer()} placeholder="Votre réponse" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400" />
                        <span className="flex items-center text-slate-500 font-bold text-sm">{exercise.unit}</span>
                      </div>
                      <button onClick={checkAnswer} disabled={!userAnswer} className="w-full mt-4 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition shadow-lg shadow-red-200 text-sm cursor-pointer disabled:opacity-50">Vérifier ma réponse</button>
                    </div>
                  )}

                  {exState === 'answered' && (
                    <div>
                      <div className={`rounded-2xl p-5 mb-4 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <><svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg><span className="font-black text-emerald-800">Bonne réponse !</span></>
                          ) : (
                            <><svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg><span className="font-black text-red-800">Mauvaise réponse — la bonne réponse est {exercise.answer} {exercise.unit}</span></>
                          )}
                        </div>
                        <p className="text-sm font-medium leading-relaxed mt-3 whitespace-pre-line" style={{color: isCorrect ? '#065f46' : '#991b1b'}}>{exercise.explanation}</p>
                      </div>
                      <button onClick={() => { setExercise(null); setUserAnswer(''); setExState('idle'); setIsCorrect(false) }} className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-black rounded-xl transition text-sm cursor-pointer">Exercice suivant</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Score session */}
            {sessionScore.total > 0 && (
              <div className="mt-6 text-center">
                <span className="text-sm font-bold text-slate-500">{sessionScore.correct}/{sessionScore.total} bonne{sessionScore.correct > 1 ? 's' : ''} réponse{sessionScore.correct > 1 ? 's' : ''} cette session</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-sm mt-auto">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4"><Stethoscope className="w-5 h-5 text-red-500" /><h4 className="text-white font-bold text-lg">Prépa FPC</h4></div>
            <p className="max-w-xs leading-relaxed">La plateforme d'entraînement de référence pour la réussite du concours infirmier.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Ressources IFSI</h4>
            <ul className="space-y-3">
              <li><a href="/blog/dates-concours-fpc-infirmier-2026" className="hover:text-white transition">Dates concours FPC</a></li>
              <li><a href="/blog" className="hover:text-white transition">Dossier Passerelle AS/AP</a></li>
              <li><a href="/calculs-doses" className="hover:text-white transition">Formules calculs de doses</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Légal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
              <li><a href="#" className="hover:text-white transition">CGV &amp; CGU</a></li>
              <li><a href="mailto:contact@prepa-fpc.fr" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center">
          <p>&copy; 2026 Prépa FPC (prepa-fpc.fr). Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
