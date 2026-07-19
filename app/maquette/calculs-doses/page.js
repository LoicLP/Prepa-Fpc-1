'use client'
import { useState, useEffect, useRef } from 'react'

// Les 4 thèmes du sélecteur
const THEMES = [
  { court: 'Produit en croix', titre: 'Le produit en croix', couleur: '#dc2626', marqueur: '#ef4444', clair: 'rgba(239,68,68,0.06)', grad: 'linear-gradient(145deg, #ef4444, #dc2626)' },
  { court: 'Débit gouttes/min', titre: 'Débit en gouttes / min', couleur: '#2563eb', marqueur: '#3b82f6', clair: 'rgba(59,130,246,0.06)', grad: 'linear-gradient(145deg, #3b82f6, #2563eb)' },
  { court: 'Conversions', titre: 'Conversions de masse', couleur: '#ca8a04', marqueur: '#eab308', clair: 'rgba(234,179,8,0.08)', grad: 'linear-gradient(145deg, #eab308, #ca8a04)' },
  { court: 'Concentration %', titre: 'Concentration en %', couleur: '#7c3aed', marqueur: '#8b5cf6', clair: 'rgba(139,92,246,0.06)', grad: 'linear-gradient(145deg, #8b5cf6, #7c3aed)' },
]

// Petit intitulé de section coloré
const Eyebrow = ({ couleur, children }) => (
  <p className="text-xs font-extrabold uppercase tracking-widest mb-6 text-center" style={{ color: couleur }}>{children}</p>
)

// Étapes numérotées (pastille dégradée + texte)
const Etapes = ({ theme, items }) => (
  <div className="space-y-5 max-w-2xl mx-auto">
    {items.map((contenu, i) => (
      <div key={i} className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-full text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-md" style={{ background: theme.grad, boxShadow: `0 6px 14px ${theme.couleur}40` }}>{i + 1}</div>
        <p className="text-[15px] sm:text-base text-black/60 font-medium leading-relaxed pt-1.5">{contenu}</p>
      </div>
    ))}
  </div>
)

// Pièges : post-it de papier teinté, inclinés, scotchés en haut
const Pieges = ({ theme, items }) => (
  <div className="grid sm:grid-cols-2 gap-x-5 gap-y-7 max-w-2xl mx-auto pt-3">
    {items.map((p, i) => (
      <div
        key={i}
        className="relative rounded-lg p-5 pt-6"
        style={{
          backgroundColor: '#fffdf6',
          backgroundImage: `linear-gradient(${theme.couleur}10, ${theme.couleur}10)`,
          boxShadow: '0 14px 28px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.05)',
          transform: `rotate(${[-1.4, 1.1, -0.8, 1.5][i % 4]}deg)`
        }}
      >
        {/* Morceau de scotch */}
        <div aria-hidden="true" className="absolute -top-2.5 left-1/2 w-16 h-5" style={{transform: 'translateX(-50%) rotate(-2.5deg)', background: 'rgba(255,255,255,0.6)', boxShadow: '0 1px 3px rgba(0,0,0,0.10)', backdropFilter: 'blur(1px)'}}></div>
        <p className="flex items-center gap-2 font-extrabold text-[15px] text-black/80 mb-1.5">
          <svg className="w-4 h-4 shrink-0" style={{ color: theme.couleur }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {p.titre}
        </p>
        <p className="text-sm text-black/55 font-medium leading-relaxed">{p.texte}</p>
      </div>
    ))}
  </div>
)

// Carte d'exercice générique : l'utilisateur répond, « Vérifier » mène à la correction
const Exemple = ({ theme, num, titre, niveau, enonce, children, resultat, unite, bonneReponse, tolerance = 0.01 }) => {
  const [reponse, setReponse] = useState('')
  const [statut, setStatut] = useState('attente') // attente | bravo | rate
  const fini = statut !== 'attente'

  const verifier = () => {
    const v = parseFloat(String(reponse).replace(/[^\d,.-]/g, '').replace(',', '.'))
    setStatut(Math.abs(v - bonneReponse) <= tolerance ? 'bravo' : 'rate')
  }

  return (
    <div className="bg-white ring-1 ring-black/[0.06] rounded-[24px] p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: theme.couleur, background: theme.clair }}>Exercice {num}</span>
        <span className="text-sm font-extrabold text-black/80">{titre}</span>
        {niveau && <Difficulte niveau={niveau} theme={theme} />}
      </div>
      <p className="text-sm sm:text-[15px] text-black/60 font-medium leading-relaxed mb-5">{enonce}</p>

      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
        <span className="text-sm font-bold text-black/60">Ma réponse :</span>
        <input
          type="text" inputMode="decimal" placeholder="…" value={reponse} disabled={fini}
          onChange={(e) => setReponse(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !fini) verifier() }}
          className="w-24 px-3 py-2.5 text-center font-extrabold rounded-xl bg-black/[0.03] outline-none transition-all placeholder:text-black/25"
          style={statut === 'bravo' ? {boxShadow: 'inset 0 0 0 2px #10b981', background: 'rgba(16,185,129,0.08)'} : statut === 'rate' ? {boxShadow: 'inset 0 0 0 2px #dc2626', background: 'rgba(220,38,38,0.05)'} : {boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'}}
          aria-label="Votre réponse"
        />
        <span className="text-sm font-bold text-black/60">{unite}</span>
        {!fini && (
          <button onClick={verifier} className="ml-1 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer" style={{background: theme.grad, boxShadow: `0 6px 14px ${theme.couleur}40`}}>Vérifier</button>
        )}
      </div>
      {statut === 'rate' && <p className="mt-2.5 text-sm font-bold text-red-600 text-center sm:text-left">Pas tout à fait — voici la correction :</p>}
      {statut === 'bravo' && <p className="mt-2.5 text-sm font-bold text-emerald-600 text-center sm:text-left">Bonne réponse !</p>}
      {fini && (
        <div className="slide-in mt-4">
          {children}
          <div className="mt-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-white font-extrabold text-base px-5 py-2 rounded-full shadow-md" style={{ background: theme.couleur, boxShadow: `0 8px 18px ${theme.couleur}35` }}>{resultat}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Ligne de calcul intermédiaire
const Ligne = ({ children }) => (
  <p className="text-sm text-black/55 font-semibold">{children}</p>
)

// Badge de niveau de difficulté (Facile / Moyen / Difficile), aux couleurs du thème
const NIVEAUX = { 1: 'Facile', 2: 'Moyen', 3: 'Difficile' }
const Difficulte = ({ niveau, theme }) => (
  <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: theme.couleur, background: theme.clair }}>
    <span className="flex gap-0.5">
      {[1, 2, 3].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i <= niveau ? theme.couleur : 'rgba(0,0,0,0.12)' }}></span>
      ))}
    </span>
    {NIVEAUX[niveau]}
  </span>
)

// Exercice interactif du produit en croix : tableau à remplir + case réponse.
// « Vérifier » affiche directement la correction, bonne réponse ou non.
function ExerciceCroix({ theme, num, titre, niveau, enonce, avant, attendus, unite, bonneReponse, tolerance = 0.01, calcul, resultat }) {
  const [cellules, setCellules] = useState(['', '', ''])
  const [reponse, setReponse] = useState('')
  const [statut, setStatut] = useState('attente') // attente | bravo | rate

  const parse = (s) => parseFloat(String(s).replace(/[^\d,.-]/g, '').replace(',', '.'))
  const celluleOk = (i) => Math.abs(parse(cellules[i]) - attendus[i]) < 0.001
  const fini = statut !== 'attente'

  const verifier = () => {
    const ok = Math.abs(parse(reponse) - bonneReponse) <= tolerance
    setCellules(attendus.map(String))
    setStatut(ok ? 'bravo' : 'rate')
  }

  const caseInput = (i) => (
    <div className={`border-t ${i === 1 ? 'border-l' : ''} border-black/[0.06] flex items-center justify-center transition-colors`} style={fini || celluleOk(i) ? {background: 'rgba(16,185,129,0.10)'} : {}}>
      <input
        type="text" inputMode="decimal" placeholder="…" value={cellules[i]} disabled={fini}
        onChange={(e) => setCellules(c => c.map((v, j) => j === i ? e.target.value : v))}
        className="w-20 py-2.5 text-center text-sm font-bold bg-transparent outline-none placeholder:text-black/25"
        aria-label={`Case ${i + 1} du tableau`}
      />
    </div>
  )

  return (
    <div className="bg-white ring-1 ring-black/[0.06] rounded-[24px] p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full" style={{ color: theme.couleur, background: theme.clair }}>Exercice {num}</span>
        <span className="text-sm font-extrabold text-black/80">{titre}</span>
        {niveau && <Difficulte niveau={niveau} theme={theme} />}
      </div>
      <p className="text-sm sm:text-[15px] text-black/60 font-medium leading-relaxed mb-5">{enonce}</p>
      {avant && <p className="text-sm text-black/50 font-semibold mb-4">{avant}</p>}

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Tableau à remplir */}
        <div className="grid grid-cols-3 rounded-xl overflow-hidden ring-1 ring-black/[0.08] bg-white text-center shrink-0 w-max mx-auto sm:mx-0">
          <div className="bg-black/[0.03] p-2 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35"></div>
          <div className="bg-black/[0.03] p-2 px-4 text-[9px] font-extrabold uppercase tracking-wider text-black/35">Quantité</div>
          <div className="bg-black/[0.03] p-2 px-4 text-[9px] font-extrabold uppercase tracking-wider text-black/35">Volume</div>
          <div className="bg-black/[0.03] p-2.5 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35 flex items-center justify-center">Je sais</div>
          {caseInput(0)}
          {caseInput(1)}
          <div className="bg-black/[0.03] p-2.5 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35 flex items-center justify-center">Je cherche</div>
          {caseInput(2)}
          <div className="p-2.5 px-4 font-black border-t border-l border-black/[0.06]" style={{color: theme.couleur, background: theme.clair}}>?</div>
        </div>

        {/* Case réponse */}
        <div className="flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="text-sm font-bold text-black/60">Ma réponse :</span>
            <input
              type="text" inputMode="decimal" placeholder="…" value={reponse} disabled={fini}
              onChange={(e) => setReponse(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !fini) verifier() }}
              className="w-24 px-3 py-2.5 text-center font-extrabold rounded-xl bg-black/[0.03] outline-none transition-all placeholder:text-black/25"
              style={statut === 'bravo' ? {boxShadow: 'inset 0 0 0 2px #10b981', background: 'rgba(16,185,129,0.08)'} : statut === 'rate' ? {boxShadow: 'inset 0 0 0 2px #dc2626', background: 'rgba(220,38,38,0.05)'} : {boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)'}}
              aria-label="Votre réponse"
            />
            <span className="text-sm font-bold text-black/60">{unite}</span>
            {!fini && (
              <button onClick={verifier} className="ml-1 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer" style={{background: theme.grad, boxShadow: `0 6px 14px ${theme.couleur}40`}}>Vérifier</button>
            )}
          </div>
          {statut === 'rate' && <p className="mt-2.5 text-sm font-bold text-red-600 text-center sm:text-left">Pas tout à fait — voici la correction :</p>}
          {statut === 'bravo' && <p className="mt-2.5 text-sm font-bold text-emerald-600 text-center sm:text-left">Bonne réponse !</p>}
          {fini && (
            <div className="slide-in mt-3 flex flex-col sm:flex-row items-center sm:items-baseline gap-2.5">
              <Ligne>{calcul}</Ligne>
              <span className="inline-flex items-center gap-1.5 text-white font-extrabold text-base px-5 py-2 rounded-full shadow-md" style={{ background: theme.couleur, boxShadow: `0 8px 18px ${theme.couleur}35` }}>{resultat}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mini tableau « Je sais / Je cherche » (la case ? prend la couleur du thème)
const MiniTableau = ({ theme, c1, c2, sais, cherche }) => {
  const cellule = (v, bordG) => v === '?'
    ? <div key={v + bordG} className={`p-2.5 px-4 font-black border-t ${bordG ? 'border-l' : ''} border-black/[0.06]`} style={{color: theme.couleur, background: theme.clair}}>?</div>
    : <div key={v + bordG} className={`p-2.5 px-4 font-bold text-sm text-black/80 border-t ${bordG ? 'border-l' : ''} border-black/[0.06]`}>{v}</div>
  return (
    <div className="grid grid-cols-3 rounded-xl overflow-hidden ring-1 ring-black/[0.08] bg-white text-center shrink-0 w-max">
      <div className="bg-black/[0.03] p-2 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35"></div>
      <div className="bg-black/[0.03] p-2 px-4 text-[9px] font-extrabold uppercase tracking-wider text-black/35">{c1}</div>
      <div className="bg-black/[0.03] p-2 px-4 text-[9px] font-extrabold uppercase tracking-wider text-black/35">{c2}</div>
      <div className="bg-black/[0.03] p-2.5 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35 flex items-center justify-center">Je sais</div>
      {cellule(sais[0], false)}
      {cellule(sais[1], true)}
      <div className="bg-black/[0.03] p-2.5 px-3 text-[9px] font-extrabold uppercase tracking-wider text-black/35 flex items-center justify-center">Je cherche</div>
      {cellule(cherche[0], false)}
      {cellule(cherche[1], true)}
    </div>
  )
}

// Tableau de données du débit (Volume / Temps / Tubulure)
const TableauDonnees = ({ theme, donnees }) => (
  <div className="grid grid-cols-3 rounded-xl overflow-hidden ring-1 ring-black/[0.08] bg-white text-center shrink-0 w-max">
    {donnees.map(([label]) => (
      <div key={label} className="bg-black/[0.03] p-2 px-4 text-[9px] font-extrabold uppercase tracking-wider text-black/35">{label}</div>
    ))}
    {donnees.map(([label, valeur], i) => (
      <div key={label + 'v'} className={`p-2.5 px-4 font-bold text-sm border-t border-black/[0.06] ${i > 0 ? 'border-l' : ''}`} style={i === donnees.length - 1 ? {color: theme.couleur} : {color: 'rgba(0,0,0,0.8)'}}>{valeur}</div>
    ))}
  </div>
)

// ==================== 1. PRODUIT EN CROIX ====================
function ThemeCroix({ theme }) {
  return (
    <>
      <p className="text-center text-xl sm:text-[1.4rem] leading-relaxed font-medium text-black/60 max-w-2xl mx-auto mb-16">
        Tu connais <strong className="font-bold" style={{color: theme.couleur}}>3 valeurs sur 4</strong> dans un tableau, tu veux la 4e&nbsp;: tu <strong className="font-bold text-black/85">multiplies en diagonale</strong>, puis tu <strong className="font-bold text-black/85">divises par la valeur restante</strong>.
      </p>

      {/* Visuel signature : le tableau et sa diagonale */}
      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>Le geste à retenir</Eyebrow>
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[380px]">
            <p aria-hidden="true" className="absolute -right-4 sm:-right-32 -top-10 sm:-top-3 text-[1.4rem] text-red-500 whitespace-nowrap" style={{fontFamily: "'Caveat', cursive", fontWeight: 700, transform: 'rotate(-5deg)'}}>en diagonale&nbsp;!</p>
            {/* Cellules flottantes 2×2, chorégraphie : × diagonale → ÷ restante → = résultat */}
            <div className="grid grid-cols-2 gap-3.5 text-center" style={{perspective: '700px'}}>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-black/35 pb-0.5">Quantité</div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-black/35 pb-0.5">Volume</div>
              <div className="pc-500 py-6 rounded-2xl bg-white font-bold text-lg text-black/75">500 mg</div>
              <div className="pc-5 py-6 rounded-2xl bg-white font-extrabold text-lg" style={{color: theme.couleur}}>5 ml</div>
              <div className="pc-750 py-6 rounded-2xl bg-white font-extrabold text-lg" style={{color: theme.couleur}}>750 mg</div>
              <div className="pc-q relative py-6 rounded-2xl font-black text-xl text-white" style={{background: theme.grad}}>
                <span className="invisible">? ml</span>
                <span className="pc-q-face1 absolute inset-0 flex items-center justify-center">? ml</span>
                <span className="pc-q-face2 absolute inset-0 flex items-center justify-center">7,5 ml</span>
              </div>
            </div>
            {/* Badge d'opération au centre : × puis ÷ puis = */}
            <div aria-hidden="true" className="pc-badge absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white font-extrabold text-lg" style={{top: '58%', color: theme.couleur, boxShadow: `0 0 0 2.5px ${theme.couleur}, 0 6px 16px rgba(0,0,0,0.12)`}}>
              <span className="pc-op1 absolute inset-0 flex items-center justify-center">×</span>
              <span className="pc-op2 absolute inset-0 flex items-center justify-center">÷</span>
              <span className="pc-op3 absolute inset-0 flex items-center justify-center">=</span>
            </div>
          </div>
          {/* Le calcul s'écrit au rythme des phases de l'animation */}
          <div className="mt-7 flex items-center justify-center gap-2.5 text-lg font-bold text-black/70 h-7" aria-hidden="true">
            <span className="pc-txt1" style={{color: theme.couleur}}>(750 × 5)</span>
            <span className="pc-txt2">÷ 500</span>
            <span className="pc-txt3 inline-flex items-center gap-2.5"><span className="text-black/30">=</span><span style={{color: theme.couleur}}>7,5 ml</span></span>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La méthode en 3 étapes</Eyebrow>
        <Etapes theme={theme} items={[
          <span key="1"><strong className="font-bold text-black/85">Pose ton tableau</strong> — à gauche ce que tu as, à droite ce que tu cherches. Vérifie que les <mark className="bg-red-100 text-inherit px-1 rounded">unités correspondent</mark> ligne par ligne.</span>,
          <span key="2"><strong className="font-bold text-black/85">Multiplie en diagonale</strong> — les deux valeurs qui se font face (celles que tu connais).</span>,
          <span key="3"><strong className="font-bold text-black/85">Divise par la valeur restante</strong> — celle qui est seule dans son coin.</span>,
        ]} />
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>On s&apos;entraîne</Eyebrow>
        <div className="space-y-5 max-w-2xl mx-auto">
          <ExerciceCroix theme={theme} num="1" niveau={1} titre="Amoxicilline"
            enonce={<>Le médecin prescrit <strong className="font-bold" style={{color: theme.couleur}}>750 mg</strong> d&apos;amoxicilline à votre patient. Vous disposez de flacons dosés à <strong className="font-bold" style={{color: theme.couleur}}>500 mg pour 5 ml</strong>. Quel volume devez-vous prélever&nbsp;?</>}
            attendus={[500, 5, 750]} unite="ml" bonneReponse={7.5}
            calcul="(750 × 5) ÷ 500 = 3 750 ÷ 500" resultat="= 7,5 ml"
          />
          <ExerciceCroix theme={theme} num="2" niveau={2} titre="Paracétamol"
            enonce={<>Un enfant doit recevoir <strong className="font-bold" style={{color: theme.couleur}}>200 mg</strong> de paracétamol. Le sirop disponible est dosé à <strong className="font-bold" style={{color: theme.couleur}}>120 mg pour 5 ml</strong>. Quelle quantité de sirop faut-il administrer&nbsp;?</>}
            attendus={[120, 5, 200]} unite="ml" bonneReponse={8.33} tolerance={0.06}
            calcul="(200 × 5) ÷ 120 = 1 000 ÷ 120" resultat="≈ 8,3 ml"
          />
          <ExerciceCroix theme={theme} num="3" niveau={3} titre="Piège unités !"
            enonce={<>La prescription indique <strong className="font-bold" style={{color: theme.couleur}}>0,5 g</strong> d&apos;un médicament, mais vous ne disposez que d&apos;ampoules de <strong className="font-bold" style={{color: theme.couleur}}>250 mg pour 2 ml</strong>. Quel volume devez-vous injecter&nbsp;?</>}
            avant={<>Indice : convertissez d&apos;abord les grammes en milligrammes avant de poser le tableau.</>}
            attendus={[250, 2, 500]} unite="ml" bonneReponse={4}
            calcul="0,5 g = 500 mg, puis (500 × 2) ÷ 250 = 1 000 ÷ 250" resultat="= 4 ml"
          />
        </div>
      </div>

      <Eyebrow couleur={theme.couleur}>Pièges fréquents</Eyebrow>
      <Pieges theme={theme} items={[
        { titre: 'Unités différentes', texte: "Si la prescription est en g et le flacon en mg, convertis d'abord ! (1 g = 1 000 mg)" },
        { titre: 'Valeurs inversées', texte: 'Assure-toi que mg est avec mg et ml avec ml, sur la même colonne.' },
        { titre: 'Résultat aberrant ?', texte: "Si tu trouves 75 ml de sirop pour un enfant, c'est probablement faux. Vérifie toujours !" },
      ]} />
    </>
  )
}

// ==================== 2. DÉBIT EN GOUTTES/MIN ====================
function ThemeDebit({ theme }) {
  return (
    <>
      <p className="text-center text-xl sm:text-[1.4rem] leading-relaxed font-medium text-black/60 max-w-2xl mx-auto mb-16">
        Tu connais le <strong className="font-bold" style={{color: theme.couleur}}>volume à perfuser</strong> et le <strong className="font-bold" style={{color: theme.couleur}}>temps prévu</strong>&nbsp;: tu calcules combien de <strong className="font-bold text-black/85">gouttes par minute</strong> doivent tomber pour finir à temps.
      </p>

      {/* Visuel signature : la perfusion qui goutte + les deux tubulures */}
      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La clé : le type de tubulure</Eyebrow>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
          {/* Chambre compte-gouttes animée : gouttes qui remplissent, puis vidange */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-1 h-8 bg-black/10 rounded-t"></div>
            <div className="relative w-20 h-32 rounded-b-[2rem] rounded-t-xl ring-1 ring-black/10 bg-white overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
              <div className="goutte absolute left-1/2 -translate-x-1/2 w-3 h-3">
                <div className="w-full h-full" style={{background: theme.couleur, borderRadius: '0 50% 50% 50%', transform: 'rotate(45deg)'}}></div>
              </div>
              <div className="niveau-liquide absolute bottom-0 inset-x-0" style={{background: `${theme.couleur}26`}}>
                <div className="absolute top-0 inset-x-0 h-1 rounded-full opacity-40" style={{background: theme.couleur}}></div>
              </div>
            </div>
            <div className="w-1 h-8 bg-black/10 rounded-b"></div>
            <p className="mt-2 text-[11px] font-extrabold uppercase tracking-widest text-black/35">1 goutte à la fois</p>
          </div>
          {/* Tubulures */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 text-center ring-1 ring-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-black/40 mb-2">Standard</p>
              <p className="text-4xl font-extrabold tracking-tight mb-1.5" style={{color: theme.couleur}}>×20</p>
              <p className="text-xs font-bold text-black/45">1 ml = 20 gouttes</p>
            </div>
            <div className="rounded-3xl p-6 text-center ring-1 ring-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-black/40 mb-2">Pédiatrique</p>
              <p className="text-4xl font-extrabold tracking-tight mb-1.5" style={{color: theme.couleur}}>×60</p>
              <p className="text-xs font-bold text-black/45">1 ml = 60 gouttes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formule décomposée */}
      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La formule décomposée</Eyebrow>
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap max-w-2xl mx-auto">
          <div className="text-center"><div className="text-white font-extrabold text-lg px-4 py-2.5 rounded-2xl shadow-md" style={{background: theme.grad, boxShadow: `0 8px 18px ${theme.couleur}35`}}>?</div><p className="text-[10px] font-bold text-black/40 mt-1.5 uppercase">Débit</p></div>
          <span className="text-2xl font-extrabold text-black/25">=</span>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 pb-2.5">
              <div className="text-center"><div className="bg-white ring-1 ring-black/[0.08] font-extrabold text-lg px-4 py-2.5 rounded-2xl text-black/80">Vol</div><p className="text-[10px] font-bold text-black/40 mt-1.5">en ml</p></div>
              <span className="text-xl font-extrabold text-black/25">×</span>
              <div className="text-center"><div className="bg-white ring-1 ring-black/[0.08] font-extrabold text-lg px-4 py-2.5 rounded-2xl" style={{color: theme.couleur}}>20</div><p className="text-[10px] font-bold text-black/40 mt-1.5">gttes/ml</p></div>
            </div>
            <div className="w-full h-[3px] rounded" style={{background: theme.couleur, opacity: 0.5}}></div>
            <div className="flex items-center gap-2 pt-2.5">
              <div className="text-center"><div className="bg-white ring-1 ring-black/[0.08] font-extrabold text-base sm:text-lg px-3 sm:px-4 py-2.5 rounded-2xl text-black/80">Heures</div><p className="text-[10px] font-bold text-black/40 mt-1.5">durée</p></div>
              <span className="text-xl font-extrabold text-black/25">×</span>
              <div className="text-center"><div className="bg-white ring-1 ring-black/[0.08] font-extrabold text-lg px-4 py-2.5 rounded-2xl text-black/80">60</div><p className="text-[10px] font-bold text-black/40 mt-1.5">min/h</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La méthode en 3 étapes</Eyebrow>
        <Etapes theme={theme} items={[
          <span key="1"><strong className="font-bold text-black/85">Repère tes données</strong> — le volume en ml et le temps en heures. Note le type de tubulure (<strong className="font-bold" style={{color: theme.couleur}}>×20</strong> ou <strong className="font-bold" style={{color: theme.couleur}}>×60</strong>).</span>,
          <span key="2"><strong className="font-bold text-black/85">Au numérateur</strong> — multiplie le volume par le facteur de gouttes (20 ou 60). C&apos;est le nombre total de gouttes.</span>,
          <span key="3"><strong className="font-bold text-black/85">Au dénominateur</strong> — convertis le temps en minutes (heures × 60). Puis divise, et arrondis à l&apos;entier !</span>,
        ]} />
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>On s&apos;entraîne</Eyebrow>
        <div className="space-y-5 max-w-2xl mx-auto">
          <Exemple theme={theme} num="1" niveau={1} titre="Perfusion standard"
            enonce={<>Vous devez perfuser <strong className="font-bold" style={{color: theme.couleur}}>1 000 ml</strong> de NaCl sur <strong className="font-bold" style={{color: theme.couleur}}>6 heures</strong> avec une tubulure standard (×20). À quel débit devez-vous régler la perfusion&nbsp;?</>}
            unite="gouttes/min" bonneReponse={56} tolerance={0.7} resultat="≈ 56 gouttes/min">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <TableauDonnees theme={theme} donnees={[['Volume', '1 000 ml'], ['Temps', '360 min'], ['Tubulure', '×20']]} />
              <div className="space-y-1.5">
                <Ligne>Numérateur : 1 000 × 20 = 20 000 gouttes</Ligne>
                <Ligne>Dénominateur : 6 × 60 = 360 minutes</Ligne>
                <Ligne>20 000 / 360</Ligne>
              </div>
            </div>
          </Exemple>
          <Exemple theme={theme} num="2" niveau={2} titre="Formule simplifiée"
            enonce={<>Une poche de <strong className="font-bold" style={{color: theme.couleur}}>250 ml</strong> doit passer en <strong className="font-bold" style={{color: theme.couleur}}>2 heures</strong> avec une tubulure standard (×20). Calculez le débit — et gagnez du temps avec l&apos;astuce 20 / 60 = 1/3.</>}
            unite="gouttes/min" bonneReponse={42} tolerance={0.7} resultat="≈ 42 gouttes/min">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <TableauDonnees theme={theme} donnees={[['Volume', '250 ml'], ['Temps', '120 min'], ['Tubulure', '×20']]} />
              <div className="space-y-1.5">
                <Ligne>(Vol × 20) / (Heures × 60) = Vol / (Heures × 3)</Ligne>
                <Ligne>= 250 / (2 × 3) = 250 / 6</Ligne>
              </div>
            </div>
          </Exemple>
          <Exemple theme={theme} num="3" niveau={3} titre="Perfusion pédiatrique"
            enonce={<>En pédiatrie, vous devez administrer <strong className="font-bold" style={{color: theme.couleur}}>100 ml</strong> de G5% sur <strong className="font-bold" style={{color: theme.couleur}}>4 heures</strong> avec une tubulure pédiatrique (×60). Quel débit régler&nbsp;?</>}
            unite="gouttes/min" bonneReponse={25} resultat="= 25 gouttes/min">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <TableauDonnees theme={theme} donnees={[['Volume', '100 ml'], ['Temps', '240 min'], ['Tubulure', '×60']]} />
              <div className="space-y-1.5">
                <Ligne>Numérateur : 100 × 60 = 6 000 gouttes</Ligne>
                <Ligne>Dénominateur : 4 × 60 = 240 minutes</Ligne>
                <Ligne>6 000 / 240</Ligne>
              </div>
            </div>
          </Exemple>
        </div>
      </div>

      <Eyebrow couleur={theme.couleur}>Pièges fréquents</Eyebrow>
      <Pieges theme={theme} items={[
        { titre: 'Standard ou pédiatrique ?', texte: 'Confondre ×20 et ×60 change complètement le résultat.' },
        { titre: 'Heures ≠ minutes', texte: "Si on te donne 6h, convertis : 6 × 60 = 360 min. Si c'est déjà en minutes, ne multiplie pas !" },
        { titre: "Toujours arrondir à l'entier", texte: 'Une goutte ne se coupe pas en deux. 41,6 → 42 gouttes/min.' },
        { titre: 'Résultat aberrant ?', texte: "Un débit > 150 ou < 5 gttes/min devrait te mettre la puce à l'oreille." },
      ]} />
    </>
  )
}

// ==================== 3. CONVERSIONS DE MASSE ====================
function ThemeConversions({ theme }) {
  const marche = "rounded-3xl p-5 sm:p-6 text-center ring-1 ring-black/[0.06] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] w-32 sm:w-36"
  return (
    <>
      <p className="text-center text-xl sm:text-[1.4rem] leading-relaxed font-medium text-black/60 max-w-2xl mx-auto mb-16">
        Les doses s&apos;expriment en <strong className="font-bold" style={{color: theme.couleur}}>g</strong>, <strong className="font-bold" style={{color: theme.couleur}}>mg</strong> ou <strong className="font-bold" style={{color: theme.couleur}}>µg</strong>&nbsp;: pour changer d&apos;unité, on <strong className="font-bold text-black/85">multiplie ou divise par 1 000</strong> — la virgule se déplace de <strong className="font-bold text-black/85">3 rangs</strong>.
      </p>

      {/* Visuel signature : l'escalier des unités */}
      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>L&apos;escalier des unités</Eyebrow>
        <div className="flex items-start justify-center gap-2 sm:gap-4">
          <div className={marche}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/40 mb-1.5">Gramme</p>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{color: theme.couleur}}>1 g</p>
          </div>
          <div className="flex flex-col items-center pt-10 sm:pt-12 shrink-0">
            <p className="text-[11px] font-extrabold whitespace-nowrap" style={{color: theme.couleur}}>× 1 000</p>
            <svg className="w-9 h-7" style={{color: theme.couleur}} viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6 C 14 10, 24 16, 30 22"/><path d="M22 22 30 22 29 14"/></svg>
            <p className="text-[11px] font-bold text-black/35 mt-1 whitespace-nowrap">÷ 1 000 ↑</p>
          </div>
          <div className={marche} style={{marginTop: '44px'}}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/40 mb-1.5">Milligramme</p>
            <p className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{color: theme.couleur}}>1 000 mg</p>
          </div>
          <div className="flex flex-col items-center pt-[84px] sm:pt-[92px] shrink-0">
            <p className="text-[11px] font-extrabold whitespace-nowrap" style={{color: theme.couleur}}>× 1 000</p>
            <svg className="w-9 h-7" style={{color: theme.couleur}} viewBox="0 0 36 28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6 C 14 10, 24 16, 30 22"/><path d="M22 22 30 22 29 14"/></svg>
            <p className="text-[11px] font-bold text-black/35 mt-1 whitespace-nowrap">÷ 1 000 ↑</p>
          </div>
          <div className={marche} style={{marginTop: '88px'}}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-black/40 mb-1.5">Microgramme</p>
            <p className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{color: theme.couleur}}>1 000 000 µg</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2.5 bg-white ring-1 ring-black/[0.08] rounded-full px-5 py-2.5 text-sm font-bold text-black/70 shadow-sm">
            <span className="font-extrabold" style={{color: theme.couleur}}>→ Descendre</span> vers plus petit : <span className="font-extrabold text-black/85">× 1 000</span>
          </div>
          <div className="inline-flex items-center gap-2.5 bg-white ring-1 ring-black/[0.08] rounded-full px-5 py-2.5 text-sm font-bold text-black/70 shadow-sm">
            <span className="font-extrabold" style={{color: theme.couleur}}>← Monter</span> vers plus grand : <span className="font-extrabold text-black/85">÷ 1 000</span>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La méthode en 2 étapes</Eyebrow>
        <Etapes theme={theme} items={[
          <span key="1"><strong className="font-bold text-black/85">Dans quel sens je vais ?</strong> — De g vers mg = unité plus petite → je multiplie. De µg vers mg = unité plus grande → je divise.</span>,
          <span key="2"><strong className="font-bold text-black/85">Je déplace la virgule de 3 rangs</strong> — vers la droite si × 1 000, vers la gauche si ÷ 1 000. S&apos;il manque des chiffres, j&apos;ajoute des zéros.</span>,
        ]} />
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>On s&apos;entraîne</Eyebrow>
        <div className="space-y-5 max-w-2xl mx-auto">
          <Exemple theme={theme} num="1" niveau={1} titre="Gramme vers milligramme"
            enonce={<>La prescription est rédigée en grammes — <strong className="font-bold" style={{color: theme.couleur}}>0,075 g</strong> — mais votre matériel est gradué en <strong className="font-bold" style={{color: theme.couleur}}>milligrammes</strong>. Convertissez pour préparer la dose.</>}
            unite="mg" bonneReponse={75} resultat="= 75 mg">
            <div className="bg-black/[0.03] rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85">0<span style={{color: theme.couleur}}>,</span>075</p>
              <p className="text-xs font-bold my-1.5" style={{color: theme.couleur}}>virgule → 3 rangs vers la droite</p>
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85">0<span style={{color: theme.couleur}}>75,</span>0</p>
            </div>
          </Exemple>
          <Exemple theme={theme} num="2" niveau={2} titre="Microgramme vers milligramme"
            enonce={<>Le flacon affiche <strong className="font-bold" style={{color: theme.couleur}}>2 500 µg</strong>, mais la feuille de prescription parle en <strong className="font-bold" style={{color: theme.couleur}}>mg</strong>. Combien cela fait-il&nbsp;?</>}
            unite="mg" bonneReponse={2.5} resultat="= 2,5 mg">
            <div className="bg-black/[0.03] rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85">2500<span style={{color: theme.couleur}}>,</span>0</p>
              <p className="text-xs font-bold my-1.5" style={{color: theme.couleur}}>virgule ← 3 rangs vers la gauche</p>
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85">2<span style={{color: theme.couleur}}>,500</span></p>
            </div>
          </Exemple>
          <Exemple theme={theme} num="3" niveau={3} titre="Double saut : g vers µg"
            enonce={<>Un traitement très concentré indique <strong className="font-bold" style={{color: theme.couleur}}>0,003 g</strong> de principe actif. Exprimez cette dose en <strong className="font-bold" style={{color: theme.couleur}}>microgrammes</strong> — attention, il y a deux paliers à franchir.</>}
            unite="µg" bonneReponse={3000} resultat="= 3 000 µg">
            <div className="bg-black/[0.03] rounded-2xl p-4 text-center">
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85">0<span style={{color: theme.couleur}}>,</span>003000</p>
              <p className="text-xs font-bold my-1.5" style={{color: theme.couleur}}>virgule → 6 rangs vers la droite</p>
              <p className="text-2xl font-extrabold tracking-[0.15em] text-black/85"><span style={{color: theme.couleur}}>3000,</span>0</p>
            </div>
          </Exemple>
        </div>
      </div>

      <Eyebrow couleur={theme.couleur}>Pièges fréquents</Eyebrow>
      <Pieges theme={theme} items={[
        { titre: 'Virgule dans le mauvais sens', texte: "Plus petit = droite (×), plus grand = gauche (÷). Pense à l'escalier." },
        { titre: 'Convertir AVANT de calculer', texte: "Si la prescription est en g et le flacon en mg, convertis d'abord. Puis fais le produit en croix." },
        { titre: 'mg ≠ µg → facteur 1 000 !', texte: 'Confondre = donner 1 000 fois trop ou pas assez. Risque de surdosage.' },
        { titre: 'Zéros manquants', texte: 'Si la virgule se déplace au-delà des chiffres, ajoute des zéros ! 5 mg → µg = 5 000 µg.' },
      ]} />
    </>
  )
}

// ==================== 4. CONCENTRATION EN % ====================
function ThemeConcentration({ theme }) {
  const Flacon = ({ pct, remplissage }) => (
    <div className="relative w-10 h-14 shrink-0">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3.5 h-2.5 rounded-t bg-black/15"></div>
      <div className="absolute inset-x-0 top-2 bottom-0 rounded-xl ring-1 ring-black/10 bg-white overflow-hidden">
        <div className="absolute bottom-0 inset-x-0" style={{height: remplissage, background: `${theme.couleur}30`}}></div>
        <p className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold" style={{color: theme.couleur}}>{pct}</p>
      </div>
    </div>
  )
  return (
    <>
      <p className="text-center text-xl sm:text-[1.4rem] leading-relaxed font-medium text-black/60 max-w-2xl mx-auto mb-14">
        Un produit dosé en <strong className="font-bold" style={{color: theme.couleur}}>pourcentage</strong>, c&apos;est un nombre de <strong className="font-bold text-black/85">grammes pour 100 ml</strong>. Avec le volume total, tu retrouves la <strong className="font-bold text-black/85">masse de principe actif</strong>.
      </p>

      {/* Visuel signature : la règle d'or en très grand */}
      <div className="mb-16 text-center">
        <Eyebrow couleur={theme.couleur}>La règle d&apos;or</Eyebrow>
        <p className="text-4xl sm:text-6xl font-extrabold tracking-[-0.03em]" style={{color: theme.couleur}}>X&nbsp;% <span className="text-black/25">=</span> X&nbsp;g <span className="text-2xl sm:text-4xl text-black/45 font-bold">pour 100 ml</span></p>
        <p className="mt-4 text-black/50 font-medium">Le % te donne directement le nombre de grammes — il suffit de lire le chiffre.</p>
      </div>

      {/* Traduction concrète */}
      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>Traduction concrète</Eyebrow>
        <div className="space-y-3 max-w-xl mx-auto">
          {[
            ['G5%', '65%', <><strong className="font-bold" style={{color: theme.couleur}}>5 g</strong> de glucose dans 100 ml</>],
            ['10%', '80%', <><strong className="font-bold" style={{color: theme.couleur}}>10 g</strong> de povidone iodée dans 100 ml (Bétadine)</>],
            ['0,9%', '35%', <><strong className="font-bold" style={{color: theme.couleur}}>0,9 g</strong> de chlorure de sodium dans 100 ml (NaCl)</>],
          ].map(([pct, remplissage, texte], i) => (
            <div key={i} className="flex items-center gap-4 bg-white ring-1 ring-black/[0.06] rounded-2xl px-5 py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
              <Flacon pct={pct} remplissage={remplissage} />
              <p className="text-sm sm:text-[15px] font-medium text-black/60">{texte}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>La méthode en 3 étapes</Eyebrow>
        <Etapes theme={theme} items={[
          <span key="1"><strong className="font-bold text-black/85">Lis le %</strong> — c&apos;est le nombre de grammes pour 100 ml. Ex : G5% → 5 g / 100 ml.</span>,
          <span key="2"><strong className="font-bold text-black/85">Regarde le volume réel</strong> — le flacon fait combien de ml ? Si c&apos;est en litres, convertis d&apos;abord (1 L = 1 000 ml).</span>,
          <span key="3"><strong className="font-bold text-black/85">Produit en croix</strong> — si c&apos;est 100 ml, lis directement. Sinon, pose le tableau et calcule.</span>,
        ]} />
      </div>

      <div className="mb-16">
        <Eyebrow couleur={theme.couleur}>On s&apos;entraîne</Eyebrow>
        <div className="space-y-5 max-w-2xl mx-auto">
          <Exemple theme={theme} num="1" niveau={1} titre="G5%, flacon 500 ml"
            enonce={<>Vous posez un flacon de <strong className="font-bold" style={{color: theme.couleur}}>G5%</strong> de <strong className="font-bold" style={{color: theme.couleur}}>500 ml</strong> à votre patient. Quelle quantité de glucose va-t-il recevoir au total&nbsp;?</>}
            unite="g" bonneReponse={25} resultat="= 25 g de glucose">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <MiniTableau theme={theme} c1="Masse" c2="Volume" sais={['5 g', '100 ml']} cherche={['?', '500 ml']} />
              <div className="space-y-1.5">
                <Ligne>G5% = 5 g pour 100 ml</Ligne>
                <Ligne>(5 × 500) / 100 = 2 500 / 100</Ligne>
              </div>
            </div>
          </Exemple>
          <Exemple theme={theme} num="2" niveau={2} titre="Bétadine 10%, flacon 125 ml"
            enonce={<>Vous préparez un pansement avec un flacon de <strong className="font-bold" style={{color: theme.couleur}}>Bétadine 10%</strong> de <strong className="font-bold" style={{color: theme.couleur}}>125 ml</strong>. Quelle masse de povidone iodée contient-il&nbsp;?</>}
            unite="g" bonneReponse={12.5} resultat="= 12,5 g">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <MiniTableau theme={theme} c1="Masse" c2="Volume" sais={['10 g', '100 ml']} cherche={['?', '125 ml']} />
              <div className="space-y-1.5">
                <Ligne>10% = 10 g pour 100 ml</Ligne>
                <Ligne>(10 × 125) / 100 = 1 250 / 100</Ligne>
              </div>
            </div>
          </Exemple>
          <Exemple theme={theme} num="3" niveau={3} titre="NaCl 0,9%, poche 1 L (piège !)"
            enonce={<>Une poche de <strong className="font-bold" style={{color: theme.couleur}}>NaCl 0,9%</strong> d&apos;<strong className="font-bold" style={{color: theme.couleur}}>1 litre</strong> est posée dans la chambre 12. Quelle quantité de chlorure de sodium contient-elle&nbsp;? Attention au piège du litre&nbsp;!</>}
            unite="g" bonneReponse={9} resultat="= 9 g de NaCl">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <MiniTableau theme={theme} c1="Masse" c2="Volume" sais={['0,9 g', '100 ml']} cherche={['?', '1 000 ml']} />
              <div className="space-y-1.5">
                <Ligne>0,9% = <strong className="text-black/80">0,9 g</strong> pour 100 ml (pas 9 g !)</Ligne>
                <Ligne>1 L = 1 000 ml</Ligne>
                <Ligne>(0,9 × 1 000) / 100 = 900 / 100</Ligne>
              </div>
            </div>
          </Exemple>
        </div>
      </div>

      <Eyebrow couleur={theme.couleur}>Pièges fréquents</Eyebrow>
      <Pieges theme={theme} items={[
        { titre: '0,9% ≠ 9 g pour 100 ml', texte: 'Le chiffre du % EST le nombre de grammes. 0,9% = 0,9 g. Lis tel quel !' },
        { titre: 'Litres → millilitres', texte: "Le % est défini pour 100 ml. Si l'énoncé donne des litres, convertis d'abord." },
        { titre: '% ≠ g/L', texte: '5% = 5 g pour 100 ml = 50 g/L. Ne confonds pas, le facteur est de 10 !' },
        { titre: '100 ml pile ?', texte: 'Pas besoin de calcul ! G5% en 100 ml = 5 g, point.' },
      ]} />
    </>
  )
}

export default function MaquetteCalculsDosesPage() {
  const [actif, setActif] = useState(0)
  const contenuRef = useRef(null)

  // Au changement de thème, on remonte jusqu'au titre de la page (visible en haut d'écran)
  const choisirTheme = (i) => {
    setActif(i)
    const titre = document.querySelector('h1')
    if (titre) {
      window.scrollTo({ top: titre.getBoundingClientRect().top + window.scrollY - 40 })
    }
  }

  // Fade-in au scroll (même mécanique que la page d'accueil)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const theme = THEMES[actif]

  return (
    <>
      <style>{`
        /* Compte-gouttes : 5 gouttes tombent (de moins en moins bas, le niveau monte),
           puis la chambre pleine se vide et la boucle repart (8s) */
        @keyframes goutte-chute {
          0% { top: 6%; opacity: 0; } 1.5% { opacity: 1; } 9% { top: 64%; opacity: 1; } 10% { top: 66%; opacity: 0; }
          13% { top: 6%; opacity: 0; } 14.5% { opacity: 1; } 22% { top: 61%; opacity: 1; } 23% { top: 63%; opacity: 0; }
          26% { top: 6%; opacity: 0; } 27.5% { opacity: 1; } 35% { top: 57%; opacity: 1; } 36% { top: 59%; opacity: 0; }
          39% { top: 6%; opacity: 0; } 40.5% { opacity: 1; } 48% { top: 53%; opacity: 1; } 49% { top: 55%; opacity: 0; }
          52% { top: 6%; opacity: 0; } 53.5% { opacity: 1; } 61% { top: 49%; opacity: 1; } 62% { top: 51%; opacity: 0; }
          63%, 100% { top: 6%; opacity: 0; }
        }
        .goutte { animation: goutte-chute 8s linear infinite; }
        @keyframes niveau-monte {
          0%, 9% { height: 14%; }
          11%, 22% { height: 22%; }
          24%, 35% { height: 30%; }
          37%, 48% { height: 38%; }
          50%, 61% { height: 46%; }
          64%, 74% { height: 55%; }
          86%, 100% { height: 14%; }
        }
        .niveau-liquide { animation: niveau-monte 8s linear infinite; }

        /* ===== Chorégraphie du tableau en croix (boucle 7s) ===== */
        /* Apparition en cascade des cellules */
        @keyframes pc-pop { from { opacity: 0; transform: scale(0.85) translateY(10px); } to { opacity: 1; transform: none; } }
        /* Phase 1 (×) : la diagonale 750 puis 5 s'illumine */
        @keyframes pc-anim-750 {
          0%, 4%, 36%, 100% { transform: none; box-shadow: inset 0 0 0 2px rgba(220,38,38,0.33), 0 10px 28px rgba(0,0,0,0.05); }
          10%, 30% { transform: translateY(-5px) scale(1.05); box-shadow: inset 0 0 0 2.5px #dc2626, 0 18px 36px rgba(220,38,38,0.30); }
        }
        @keyframes pc-anim-5 {
          0%, 8%, 38%, 100% { transform: none; box-shadow: inset 0 0 0 2px rgba(220,38,38,0.33), 0 10px 28px rgba(0,0,0,0.05); }
          14%, 32% { transform: translateY(-5px) scale(1.05); box-shadow: inset 0 0 0 2.5px #dc2626, 0 18px 36px rgba(220,38,38,0.30); }
        }
        /* Phase 2 (÷) : la valeur restante */
        @keyframes pc-anim-500 {
          0%, 40%, 60%, 100% { transform: none; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 28px rgba(0,0,0,0.05); }
          46%, 56% { transform: translateY(-5px) scale(1.05); box-shadow: inset 0 0 0 2.5px #dc2626, 0 18px 36px rgba(220,38,38,0.30); }
        }
        /* Phase 3 (=) : la case résultat s'élève */
        @keyframes pc-anim-q {
          0%, 60%, 97%, 100% { transform: none; box-shadow: 0 14px 30px rgba(220,38,38,0.27); }
          66%, 92% { transform: translateY(-5px) scale(1.06); box-shadow: 0 24px 46px rgba(220,38,38,0.45); }
        }
        .pc-500 { box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 28px rgba(0,0,0,0.05); animation: pc-pop 0.5s cubic-bezier(0.2,1.2,0.4,1) both, pc-anim-500 7s 0.6s ease-in-out infinite; }
        .pc-5 { box-shadow: inset 0 0 0 2px rgba(220,38,38,0.33), 0 10px 28px rgba(0,0,0,0.05); animation: pc-pop 0.5s cubic-bezier(0.2,1.2,0.4,1) 0.12s both, pc-anim-5 7s 0.6s ease-in-out infinite; }
        .pc-750 { box-shadow: inset 0 0 0 2px rgba(220,38,38,0.33), 0 10px 28px rgba(0,0,0,0.05); animation: pc-pop 0.5s cubic-bezier(0.2,1.2,0.4,1) 0.24s both, pc-anim-750 7s 0.6s ease-in-out infinite; }
        .pc-q { box-shadow: 0 14px 30px rgba(220,38,38,0.27); animation: pc-pop 0.5s cubic-bezier(0.2,1.2,0.4,1) 0.36s both, pc-anim-q 7s 0.6s ease-in-out infinite; }
        /* La case « ? ml » se retourne pour révéler « 7,5 ml », puis revient */
        @keyframes pc-face-q {
          0%, 58% { transform: rotateX(0); opacity: 1; }
          63%, 94% { transform: rotateX(88deg); opacity: 0; }
          99%, 100% { transform: rotateX(0); opacity: 1; }
        }
        @keyframes pc-face-r {
          0%, 60% { transform: rotateX(-88deg); opacity: 0; }
          66%, 92% { transform: rotateX(0); opacity: 1; }
          97%, 100% { transform: rotateX(-88deg); opacity: 0; }
        }
        .pc-q-face1 { animation: pc-face-q 7s 0.6s ease-in-out infinite; backface-visibility: hidden; }
        .pc-q-face2 { animation: pc-face-r 7s 0.6s ease-in-out infinite; backface-visibility: hidden; }
        /* Le badge central bascule × → ÷ → = au fil des phases */
        .pc-badge { animation: pc-pop 0.5s cubic-bezier(0.2,1.2,0.4,1) 0.45s both; }
        @keyframes pc-anim-op1 { 0%, 38% { opacity: 1; transform: scale(1); } 42%, 96% { opacity: 0; transform: scale(0.35); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pc-anim-op2 { 0%, 40% { opacity: 0; transform: scale(0.35); } 44%, 58% { opacity: 1; transform: scale(1); } 62%, 100% { opacity: 0; transform: scale(0.35); } }
        @keyframes pc-anim-op3 { 0%, 61% { opacity: 0; transform: scale(0.35); } 65%, 93% { opacity: 1; transform: scale(1); } 97%, 100% { opacity: 0; transform: scale(0.35); } }
        .pc-op1 { animation: pc-anim-op1 7s 0.6s ease-in-out infinite; }
        .pc-op2 { animation: pc-anim-op2 7s 0.6s ease-in-out infinite; }
        .pc-op3 { animation: pc-anim-op3 7s 0.6s ease-in-out infinite; }
        /* La ligne de calcul s'écrit morceau par morceau, en phase avec le tableau */
        @keyframes pc-anim-txt1 { 0%, 7% { opacity: 0; transform: translateY(7px); } 12%, 94% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; transform: translateY(7px); } }
        @keyframes pc-anim-txt2 { 0%, 41% { opacity: 0; transform: translateY(7px); } 46%, 94% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; transform: translateY(7px); } }
        @keyframes pc-anim-txt3 { 0%, 62% { opacity: 0; transform: translateY(7px); } 67%, 94% { opacity: 1; transform: none; } 99%, 100% { opacity: 0; transform: translateY(7px); } }
        .pc-txt1 { opacity: 0; animation: pc-anim-txt1 7s 0.6s ease-out infinite; }
        .pc-txt2 { opacity: 0; animation: pc-anim-txt2 7s 0.6s ease-out infinite; }
        .pc-txt3 { opacity: 0; animation: pc-anim-txt3 7s 0.6s ease-out infinite; }
      `}</style>

      {/* ===================== EN-TÊTE ===================== */}
      <section className="relative px-5 pt-[110px] md:pt-[150px] pb-4 text-center">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-[2.4rem] sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08]">
            Maîtrisez les <span className="surligne" style={{background: `linear-gradient(100deg, ${theme.marqueur}00 0.8%, ${theme.marqueur}61 2.8%, ${theme.marqueur}4d 50%, ${theme.marqueur}61 97%, ${theme.marqueur}00 99.2%)`}}>calculs du concours</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-black/55 font-medium leading-relaxed">
            Les 4 notions indispensables pour l&apos;épreuve de calculs, expliquées simplement.
          </p>
        </div>
      </section>

      {/* ===================== SÉLECTEUR + CONTENU ===================== */}
      <section className="relative px-5 pt-8 pb-5 sm:pb-8 overflow-hidden" style={{background: `linear-gradient(to bottom, #ffffff 0%, ${theme.couleur}0b 160px, ${theme.couleur}0b calc(100% - 90px), #ffffff 100%)`}}>
        {/* Décorations au ton du thème */}
        <div aria-hidden="true" className="absolute top-40 -left-24 w-96 h-72 rounded-full blur-3xl pointer-events-none" style={{background: `${theme.couleur}14`}}></div>
        <div aria-hidden="true" className="absolute top-[45%] -right-28 w-80 h-64 rounded-full blur-3xl pointer-events-none" style={{background: `${theme.couleur}10`}}></div>
        <div aria-hidden="true" className="absolute bottom-32 -left-20 w-72 h-56 rounded-full blur-3xl pointer-events-none" style={{background: `${theme.couleur}0d`}}></div>

        <div ref={contenuRef} className="relative max-w-3xl mx-auto">
          {/* Les 4 interrupteurs de thème (collants au défilement) */}
          <div className="sticky top-4 z-30 flex justify-center mb-14">
            <div className="grid grid-cols-2 sm:flex gap-1.5 bg-white/80 backdrop-blur-xl ring-1 ring-black/[0.07] rounded-3xl sm:rounded-full p-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              {THEMES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => choisirTheme(i)}
                  className="px-4 py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
                  style={actif === i
                    ? { background: t.grad, color: '#ffffff', boxShadow: `0 6px 16px ${t.couleur}50` }
                    : { color: 'rgba(0,0,0,0.5)' }}
                >{t.court}</button>
              ))}
            </div>
          </div>

          {/* Le thème actif */}
          <div key={actif} className="slide-in">
            <h2 className="text-center text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] mb-10">{theme.titre}</h2>
            {actif === 0 && <ThemeCroix theme={theme} />}
            {actif === 1 && <ThemeDebit theme={theme} />}
            {actif === 2 && <ThemeConversions theme={theme} />}
            {actif === 3 && <ThemeConcentration theme={theme} />}
          </div>
        </div>
      </section>

      {/* ===================== APPEL À L'ACTION ===================== */}
      <section className="relative overflow-hidden bg-[#0d0d0d] py-16 sm:py-20 px-5 fade-in-up">
        <div aria-hidden="true" className="absolute -top-24 -right-24 w-[28rem] h-[20rem] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white mb-4">Prêt à passer à la pratique&nbsp;?</h2>
          <p className="text-white/55 font-medium leading-relaxed mb-8">Inscrivez-vous et entraînez-vous sur des exercices illimités, avec correction détaillée à chaque question.</p>
          <a href="/maquette/auth?mode=signup" className="btn-shine inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-full transition shadow-lg shadow-red-600/25 group">
            Commencer à m&apos;entraîner
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </>
  )
}
