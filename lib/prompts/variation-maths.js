// lib/prompts/variation-maths.js
// ============================================================
// BRIEF DE VARIATION — tiré au sort à chaque génération
//
// Sans lui, le prompt envoyé au modèle est identique à chaque appel :
// le modèle recopie alors les valeurs des exemples (70 kg, 260 €, 48 m²…)
// et ne change que les prénoms.
//
// Ici, pour CHAQUE question, les DONNÉES et la RÉPONSE sont calculées en JS
// (réponses "propres", max 2 décimales). Le modèle ne fait que rédiger
// l'énoncé, l'indice et l'explication autour de ces valeurs imposées.
// ============================================================

// ---------- utilitaires ----------
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const choice = arr => arr[Math.floor(Math.random() * arr.length)]
const shuffle = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
// Tire n éléments distincts en évitant `exclude` (sauf s'il ne reste plus assez de choix)
const pick = (arr, n, exclude = []) => { let pool = arr.filter(x => !exclude.includes(x)); if (pool.length < n + 2) pool = arr; return shuffle(pool).slice(0, n) }
const r2 = x => Math.round(x * 100) / 100
const dec1 = (min, max) => rand(Math.round(min * 10), Math.round(max * 10)) / 10
// Décimal à 1 chiffre non entier (pour que "multiplication de décimaux" en soit vraiment une)
const dec1nz = (min, max) => { let v; do { v = dec1(min, max) } while (Number.isInteger(v)); return v }
const isClean = x => Number.isFinite(x) && Math.abs(r2(x) - x) < 1e-9
const isClean1 = x => Number.isFinite(x) && Math.abs(Math.round(x * 10) / 10 - x) < 1e-9
const pad = n => String(n).padStart(2, '0')
// Format français : 12 731 / 3,7
const fr = n => {
  const neg = n < 0
  const [i, d] = String(Math.abs(n)).split('.')
  const int = i.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return (neg ? '-' : '') + (d ? `${int},${d}` : int)
}

// ---------- catalogues ----------
export const CONTEXTES = [
  'un service de pédiatrie', 'un EHPAD', "une pharmacie d'officine", 'un bloc opératoire', 'une crèche', 'un cabinet infirmier libéral',
  'une cantine scolaire', 'une boulangerie', 'un marché de producteurs', 'une jardinerie', 'un garage automobile', 'une salle de sport',
  'une piscine municipale', 'une randonnée en montagne', 'un voyage en train', 'un déménagement', 'un chantier de rénovation',
  'une exploitation agricole', 'une association caritative', 'un festival de musique', 'une bibliothèque municipale', 'un camping',
  "un laboratoire d'analyses", 'une équipe du SAMU', 'un centre de vaccination', 'un cabinet de kinésithérapie', 'une maternité',
  'un service de dialyse', 'une école primaire', 'un restaurant', 'un club de football', 'un covoiturage', 'un potager partagé',
  'une station de ski', 'un atelier de couture', 'un magasin de bricolage', 'une clinique vétérinaire', 'un centre de radiologie',
  'une résidence étudiante', 'un service de réanimation', 'une auto-école', 'une colonie de vacances', 'un salon de coiffure', 'une brocante'
]

export const PRENOMS = [
  'Inès', 'Yanis', 'Léa', 'Nadia', 'Karim', 'Maëlle', 'Thomas', 'Aïcha', 'Baptiste', 'Camille', 'Omar', 'Solène', 'Rachid', 'Élise',
  'Mathéo', 'Fatou', 'Louis', 'Chloé', 'Samir', 'Hugo', 'Manon', 'Ibrahim', 'Zoé', 'Gabriel', 'Lina', 'Noah', 'Amina', 'Enzo', 'Jade',
  'Kevin', 'Mélanie', 'Ousmane', 'Clara', 'Anaïs', 'Théo', 'Salomé', 'Nolan', 'Yasmine', 'Florian', 'Océane', 'Adrien', 'Sarah',
  'Lucas', 'Émilie', 'Mehdi', 'Justine', 'Antoine', 'Leïla', 'Romain', 'Margot', 'Bilal', 'Agathe', 'Victor', 'Louna', 'Nathan',
  'Coralie', 'Jules', 'Maryam', 'Axel', 'Pauline', 'Marius', 'Élodie', 'Sofiane', 'Lucie', 'Tom', 'Roxane', 'Idriss', 'Célia'
]

const NIVEAUX = [
  { id: 'facile', label: 'FACILE (type Marseille) — nombres simples, calculs directs', hard: false, w: 30 },
  { id: 'moyen', label: 'MOYEN (type Alsace / Douai) — niveau standard du concours', hard: false, w: 45 },
  { id: 'difficile', label: 'DIFFICILE (type Réunion) — décimaux, pièges et multi-étapes', hard: true, w: 25 }
]
const tirerNiveau = () => { const total = NIVEAUX.reduce((s, n) => s + n.w, 0); let x = Math.random() * total; for (const n of NIVEAUX) { x -= n.w; if (x < 0) return n } return NIVEAUX[1] }

// ---------- conversions (tables : [de, vers, facteur, tirage de la valeur]) ----------
// Les tirages sont choisis pour que le résultat soit toujours "propre"
const MASSES = [
  ['kg', 'g', 1000, () => dec1(0.3, 9.9)], ['g', 'mg', 1000, () => dec1(0.2, 8.9)], ['mg', 'µg', 1000, () => dec1(0.1, 4.9)],
  ['g', 'kg', 0.001, () => rand(12, 990) * 10], ['mg', 'g', 0.001, () => rand(5, 99) * 10], ['µg', 'mg', 0.001, () => rand(15, 990) * 10],
  ['t', 'kg', 1000, () => dec1(0.4, 6.8)], ['kg', 't', 0.001, () => rand(12, 890) * 10]
]
const VOLUMES = [
  ['L', 'mL', 1000, () => dec1(0.2, 9.9)], ['L', 'cL', 100, () => dec1(0.5, 12.5)], ['cL', 'mL', 10, () => dec1(1.5, 95.5)],
  ['mL', 'L', 0.001, () => rand(15, 990) * 10], ['cm³', 'mL', 1, () => rand(45, 980)], ['L', 'hL', 0.01, () => rand(12, 980)],
  ['hL', 'L', 100, () => dec1(0.3, 9.9)], ['dL', 'mL', 100, () => dec1(0.5, 9.5)], ['mL', 'cL', 0.1, () => rand(15, 995)],
  ['m³', 'L', 1000, () => dec1(0.2, 4.8)], ['cL', 'L', 0.01, () => rand(15, 990)]
]
const LONGUEURS = [
  ['km', 'm', 1000, () => dec1(0.3, 9.9)], ['m', 'cm', 100, () => dec1(0.5, 49.5)], ['cm', 'mm', 10, () => dec1(1.5, 99.5)],
  ['m', 'km', 0.001, () => rand(12, 990) * 10], ['mm', 'cm', 0.1, () => rand(15, 995)], ['dam', 'm', 10, () => dec1(1.5, 49.5)],
  ['m', 'dam', 0.1, () => rand(15, 995)], ['hm', 'm', 100, () => dec1(0.5, 9.5)], ['cm', 'm', 0.01, () => rand(15, 990)]
]
const SURFACES = [
  ['m²', 'cm²', 10000, () => dec1(0.3, 9.9)], ['ha', 'm²', 10000, () => dec1(0.2, 4.9)], ['km²', 'm²', 1000000, () => dec1(0.1, 1.9)],
  ['cm²', 'm²', 0.0001, () => rand(3, 99) * 100], ['m²', 'dm²', 100, () => dec1(0.5, 29.5)], ['a', 'm²', 100, () => dec1(0.5, 9.5)],
  ['dm²', 'm²', 0.01, () => rand(15, 990)]
]
const conversion = table => () => {
  const [from, to, f, gen] = choice(table)
  const v = gen()
  const res = r2(v * f)
  return { donnees: `${fr(v)} ${from} à convertir en ${to}`, reponse: `${fr(res)} ${to}`, methode: f >= 1 ? `× ${fr(f)}` : `÷ ${fr(Math.round(1 / f))}` }
}

const PCTS = [4, 5, 6, 8, 12, 15, 18, 22, 25, 30, 35, 40, 45, 55, 60, 65, 75, 85]
const ARTICLES = ['manteau', 'blouson', 'tee-shirt', 'paire de baskets', 'jean', 'robe', 'sac à dos', 'montre', 'casque audio', 'cafetière', 'lampe', 'tapis', 'parka', 'écharpe', 'pantalon', 'chemise', 'paire de bottes', 'valise']
// Grandeurs pour hausse/baisse : fourchette réaliste, et `count` = grandeur dénombrable (valeur multiple de 100 → résultat entier)
const VALEURS = [
  { l: 'loyer mensuel', u: ' €', min: 400, max: 1500 }, { l: 'salaire mensuel', u: ' €', min: 1200, max: 3400 }, { l: 'production hebdomadaire', u: ' pièces', min: 500, max: 4800, count: true },
  { l: "prix d'un appareil", u: ' €', min: 150, max: 2400 }, { l: "facture d'électricité", u: ' €', min: 60, max: 600 }, { l: "nombre d'inscrits", u: ' inscrits', min: 200, max: 4800, count: true },
  { l: "prix d'un abonnement annuel", u: ' €', min: 150, max: 900 }, { l: 'effectif du service', u: ' agents', min: 100, max: 600, count: true },
  { l: 'consommation annuelle', u: ' kWh', min: 1500, max: 4800, count: true }, { l: 'nombre de repas servis par mois', u: ' repas', min: 500, max: 4800, count: true },
  { l: 'prix du séjour', u: ' €', min: 250, max: 1800 }, { l: 'nombre de visiteurs', u: ' visiteurs', min: 300, max: 4800, count: true }
]
const tirerValeur = w => { const step = w.count ? 100 : w.max >= 1000 ? 50 : 10; return rand(Math.ceil(w.min / step), Math.floor(w.max / step)) * step }
const FRACS = [[1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [2, 3], [5, 6], [3, 8], [5, 8], [7, 10], [1, 3], [3, 10]]
const FRAC_PCT = [[1, 4, 25], [3, 4, 75], [1, 5, 20], [2, 5, 40], [3, 5, 60], [4, 5, 80], [1, 8, 12.5], [3, 8, 37.5], [5, 8, 62.5], [7, 8, 87.5], [1, 2, 50], [1, 10, 10], [3, 10, 30], [7, 10, 70], [9, 10, 90], [1, 20, 5], [3, 20, 15], [7, 20, 35], [9, 20, 45], [3, 25, 12], [4, 25, 16], [6, 25, 24], [11, 25, 44], [17, 25, 68]]
const ACHATS = [
  { p1: 'cahiers', s1: 'cahier', p2: 'stylos', s2: 'stylo' }, { p1: 'seringues', s1: 'seringue', p2: 'paquets de compresses', s2: 'paquet de compresses' },
  { p1: 'baguettes', s1: 'baguette', p2: 'croissants', s2: 'croissant' }, { p1: 'ampoules', s1: 'ampoule', p2: 'multiprises', s2: 'multiprise' },
  { p1: 'plants de tomates', s1: 'plant de tomates', p2: 'sachets de graines', s2: 'sachet de graines' }, { p1: 'boîtes de gants', s1: 'boîte de gants', p2: 'flacons de gel', s2: 'flacon de gel' },
  { p1: 'tickets de bus', s1: 'ticket de bus', p2: 'tickets de tram', s2: 'ticket de tram' }, { p1: 'cafés', s1: 'café', p2: 'chocolats chauds', s2: 'chocolat chaud' }
]

// ---------- générateurs : chacun renvoie { donnees, reponse, methode } ----------
const GEN = {
  // ===== calculs & conversions =====
  addition_posee: hard => {
    if (hard) { const a = r2(rand(100000, 899999) / 100), b = r2(rand(10000, 99999) / 100); return { donnees: `${fr(a)} + ${fr(b)} (opération à poser)`, reponse: fr(r2(a + b)), methode: 'addition posée de décimaux, virgules alignées' } }
    const a = rand(1200, 48999), b = rand(800, 9999)
    return { donnees: `${fr(a)} + ${fr(b)} (opération à poser)`, reponse: fr(a + b), methode: 'addition posée' }
  },
  soustraction_posee: hard => {
    if (hard) { const b = r2(rand(10000, 79999) / 100), a = r2(b + rand(5000, 89999) / 100); return { donnees: `${fr(a)} − ${fr(b)} (opération à poser)`, reponse: fr(r2(a - b)), methode: 'soustraction posée de décimaux' } }
    const b = rand(800, 9999), a = b + rand(500, 39999)
    return { donnees: `${fr(a)} − ${fr(b)} (opération à poser)`, reponse: fr(a - b), methode: 'soustraction posée' }
  },
  multiplication_decimaux: hard => {
    const a = hard ? dec1nz(12, 98) : rand(12, 89)
    const b = dec1nz(2.5, 48.9)
    return { donnees: `${fr(a)} × ${fr(b)} (opération à poser)`, reponse: fr(r2(a * b)), methode: 'multiplication posée, compter les décimales' }
  },
  division_decimale: hard => {
    const d = hard ? dec1nz(2.5, 15.5) : rand(6, 36)
    const q = dec1nz(12, 480)
    return { donnees: `${fr(r2(d * q))} ÷ ${fr(d)} (opération à poser)`, reponse: fr(q), methode: 'division posée, résultat exact sans reste' }
  },
  conversion_masse: conversion(MASSES),
  conversion_volume: conversion(VOLUMES),
  conversion_longueur: conversion(LONGUEURS),
  conversion_surface: conversion(SURFACES),
  conversion_duree: () => {
    const v = rand(0, 2)
    if (v === 0) { const h = rand(1, 6), m = choice([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]); return { donnees: `${h} h ${pad(m)} à convertir en minutes`, reponse: `${h * 60 + m} min`, methode: `${h} × 60 + ${m} (piège : base 60, pas base 100)` } }
    if (v === 1) { const t = rand(95, 590); const h = Math.floor(t / 60), m = t % 60; return { donnees: `${t} min à convertir en heures et minutes`, reponse: `${h} h ${pad(m)} min`, methode: `${t} ÷ 60 = ${h} reste ${m}` } }
    const dh = rand(6, 18), dm = choice([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]), th = rand(1, 5), tm = choice([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
    const total = dh * 60 + dm + th * 60 + tm
    return { donnees: `départ à ${dh} h ${pad(dm)}, trajet de ${th} h ${pad(tm)} → heure d'arrivée`, reponse: `${Math.floor(total / 60) % 24} h ${pad(total % 60)}`, methode: 'additionner les heures puis les minutes, retenue à 60' }
  },
  fraction_quantite: () => {
    const [n, d] = choice(FRACS); const base = d * rand(5, 40); const unit = choice(['L', '€', 'km', 'kg', 'places', 'élèves', 'flacons'])
    return { donnees: `${n}/${d} de ${fr(base)} ${unit}`, reponse: `${fr(base * n / d)} ${unit}`, methode: `${fr(base)} ÷ ${d} × ${n}` }
  },
  fraction_pourcentage: () => {
    const [n, d, p] = choice(FRAC_PCT)
    return { donnees: `${n}/${d} à exprimer en pourcentage`, reponse: `${fr(p)} %`, methode: `${n} ÷ ${d} = ${fr(p / 100)}, puis × 100` }
  },
  comparaison_nombres: () => {
    const base = rand(1, 9)
    const vals = shuffle([0.02, 0.2, 0.12, 0.21, 0.102, 0.201, 0.012, 0.022, 0.202, 0.212]).slice(0, 4).map(v => Math.round((base + v) * 1000) / 1000)
    return { donnees: `comparer : ${vals.map(fr).join(' ; ')} → le plus grand nombre`, reponse: fr(Math.max(...vals)), methode: 'comparer chiffre par chiffre après la virgule (compléter avec des zéros)' }
  },
  imc: () => {
    const poids = rand(45, 118); const taille = choice([1.55, 1.6, 1.62, 1.65, 1.68, 1.7, 1.72, 1.75, 1.78, 1.8, 1.83, 1.85, 1.88])
    const imc = Math.round(poids / (taille * taille) * 10) / 10
    const cat = imc < 18.5 ? 'maigreur' : imc < 25 ? 'corpulence normale' : imc < 30 ? 'surpoids' : 'obésité'
    return { donnees: `${poids} kg pour ${fr(taille)} m → IMC arrondi au dixième`, reponse: `${fr(imc)} (${cat})`, methode: `${poids} ÷ (${fr(taille)} × ${fr(taille)}) = ${poids} ÷ ${fr(Math.round(taille * taille * 10000) / 10000)}` }
  },

  // ===== pourcentages =====
  pourcentage_quantite: () => {
    const total = rand(2, 98) * 100; const p = choice(PCTS); const what = choice(['patients', 'habitants', 'élèves', 'colis', 'flacons', 'adhérents', 'visiteurs', 'salariés', 'vaccins', 'repas'])
    return { donnees: `${fr(total)} ${what}, dont ${p} % concernés → combien ?`, reponse: `${fr(total * p / 100)} ${what}`, methode: `${fr(total)} × ${p} ÷ 100` }
  },
  taux_pourcentage: () => {
    const total = choice([40, 50, 60, 80, 120, 125, 150, 160, 200, 240, 250, 300, 320, 400, 480, 500, 600, 750, 800])
    const p = choice(PCTS.filter(x => (total * x) % 100 === 0)); const part = total * p / 100
    return { donnees: `${part} sur ${total} ${choice(['patients', 'prélèvements', 'candidats', 'commandes', 'enfants', 'trajets', 'analyses', 'appels'])} → pourcentage`, reponse: `${p} %`, methode: `${part} ÷ ${total} × 100` }
  },
  augmentation_pourcentage: () => {
    const w = choice(VALEURS); const v = tirerValeur(w); const p = choice([2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20, 25, 30])
    return { donnees: `${w.l} : ${fr(v)}${w.u}, augmentation de ${p} % → nouvelle valeur`, reponse: `${fr(r2(v * (1 + p / 100)))}${w.u}`, methode: `${fr(v)} × ${fr(1 + p / 100)}` }
  },
  reduction_soldes: () => {
    const p = choice([10, 15, 20, 25, 30, 40, 50, 60, 70]); const items = pick(ARTICLES, 3).map(a => [a, rand(3, 84) * 5])
    const soldes = items.map(([, pr]) => r2(pr * (1 - p / 100))); const total = r2(soldes.reduce((s, x) => s + x, 0))
    return { donnees: `remise de ${p} % sur trois articles : ${items.map(([a, pr]) => `${a} ${fr(pr)} €`).join(', ')} → montant total à payer après remise`, reponse: `${fr(total)} €`, methode: `chaque prix × ${fr(1 - p / 100)} : ${soldes.map(fr).join(' + ')}` }
  },
  tva_ht_ttc: () => {
    const t = choice([5.5, 10, 20]); const ht = t === 5.5 ? rand(2, 60) * 20 : rand(15, 990); const ttc = r2(ht * (1 + t / 100))
    return { donnees: `${choice(['appareil médical', 'vélo électrique', 'fauteuil roulant', 'ordinateur portable', 'prestation de nettoyage', 'lot de blouses', 'trottinette', 'canapé'])} : ${fr(ht)} € HT, TVA ${fr(t)} % → prix TTC`, reponse: `${fr(ttc)} € TTC`, methode: `${fr(ht)} × ${fr(1 + t / 100)}` }
  },
  tva_ttc_ht: () => {
    const t = choice([5.5, 10, 20]); const ht = t === 5.5 ? rand(2, 60) * 20 : rand(15, 990); const ttc = r2(ht * (1 + t / 100))
    return { donnees: `${choice(['repas de groupe', 'matériel de rééducation', 'tenue professionnelle', 'réparation automobile', 'abonnement annuel', 'imprimante'])} : ${fr(ttc)} € TTC, TVA ${fr(t)} % → prix HT`, reponse: `${fr(ht)} € HT`, methode: `${fr(ttc)} ÷ ${fr(1 + t / 100)} (piège : ne pas retirer ${fr(t)} % du TTC)` }
  },
  valeur_initiale: () => {
    const w = choice(VALEURS); const init = tirerValeur(w); const p = choice([-30, -25, -20, -15, -10, -5, 5, 8, 10, 12, 15, 20, 25, 30, 40]); const fin = r2(init * (1 + p / 100))
    return { donnees: `${w.l} : ${fr(fin)}${w.u} après une ${p > 0 ? 'hausse' : 'baisse'} de ${Math.abs(p)} % → valeur avant la variation`, reponse: `${fr(init)}${w.u}`, methode: `${fr(fin)} ÷ ${fr(1 + p / 100)} (piège : ne pas appliquer ${Math.abs(p)} % à la valeur finale)` }
  },
  pourcentages_successifs: () => {
    const type = choice(['hb', 'bh', 'bb']); const combos = []
    for (const P of [100, 120, 150, 160, 200, 240, 250, 300, 320, 400, 450, 500, 600, 750, 800, 1000, 1200, 1500, 2000, 2400])
      for (const a of [10, 15, 20, 25, 30, 40, 50]) for (const b of [10, 15, 20, 25, 30, 40, 50]) {
        const fin = type === 'bb' ? P * (1 - a / 100) * (1 - b / 100) : P * (1 + a / 100) * (1 - b / 100)
        if (isClean(fin)) combos.push([P, a, b, r2(fin)])
      }
    const [P, a, b, fin] = choice(combos)
    const what = choice(['un vélo', 'un téléphone', 'un abonnement', 'une machine à laver', 'un billet de train', 'une console de jeux'])
    if (type === 'bb') return { donnees: `${what} à ${fr(P)} €, soldé de ${a} % puis de nouveau ${b} % sur le prix déjà soldé → prix final`, reponse: `${fr(fin)} €`, methode: `${fr(P)} × ${fr(1 - a / 100)} × ${fr(1 - b / 100)} (piège : ce n'est PAS une baisse de ${a + b} %)` }
    if (type === 'bh') return { donnees: `${what} à ${fr(P)} €, baisse de ${b} % puis hausse de ${a} % → prix final`, reponse: `${fr(fin)} €`, methode: `${fr(P)} × ${fr(1 - b / 100)} × ${fr(1 + a / 100)} (piège : on ne retrouve pas ${fr(P)} €)` }
    return { donnees: `${what} à ${fr(P)} €, hausse de ${a} % puis baisse de ${b} % → prix final`, reponse: `${fr(fin)} €`, methode: `${fr(P)} × ${fr(1 + a / 100)} × ${fr(1 - b / 100)} (piège : +${a} % puis −${b} % ≠ ${a - b >= 0 ? '+' : '−'}${Math.abs(a - b)} %)` }
  },

  // ===== proportionnalité =====
  proportionnalite_recette: () => {
    const n1 = choice([4, 6, 8, 10]); const n2 = choice([3, 5, 6, 7, 9, 12, 15, 18].filter(x => x !== n1)); const q = n1 * rand(20, 120)
    const ing = choice(['g de farine', 'g de riz', 'cL de lait', 'g de sucre', 'mL de bouillon', 'g de pâtes', 'g de semoule', 'cL de crème', 'g de lentilles'])
    return { donnees: `${fr(q)} ${ing} pour ${n1} personnes → quantité pour ${n2} personnes`, reponse: `${fr(q / n1 * n2)} ${ing}`, methode: `${fr(q)} ÷ ${n1} × ${n2}` }
  },
  dose_mg_kg: () => {
    const child = Math.random() < 0.35; const poids = child ? rand(8, 38) : rand(44, 118)
    const dose = choice([0.2, 0.25, 0.4, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 8, 10, 15]); const total = r2(poids * dose)
    const conc = choice([5, 10, 20, 25, 40, 50]); const vol = total / conc
    if (isClean(vol) && vol >= 0.5) return { donnees: `${child ? 'enfant' : 'patient'} de ${poids} kg, prescription ${fr(dose)} mg/kg, médicament dosé à ${conc} mg/mL → volume à préparer`, reponse: `${fr(r2(vol))} mL`, methode: `${poids} × ${fr(dose)} = ${fr(total)} mg, puis ${fr(total)} ÷ ${conc}` }
    return { donnees: `${child ? 'enfant' : 'patient'} de ${poids} kg, prescription ${fr(dose)} mg/kg → dose totale`, reponse: `${fr(total)} mg`, methode: `${poids} × ${fr(dose)}` }
  },
  dilution_concentration: () => {
    const p = choice([0.9, 5, 10, 20, 30]); const vol = choice([250, 500, 750, 1000, 1500, 2000]); const g = r2(p * vol / 100)
    const sol = p === 0.9 ? 'sérum physiologique (NaCl)' : choice(['solution glucosée', 'solution antiseptique', 'solution de dextrose'])
    return { donnees: `${sol} à ${fr(p)} %, poche de ${fr(vol)} mL → masse de produit dissous`, reponse: `${fr(g)} g`, methode: `${fr(p)} % = ${fr(p)} g pour 100 mL, donc ${fr(p)} × ${fr(vol / 100)} (piège : pas ${fr(p)} g pour toute la poche)` }
  },
  debit_perfusion: () => {
    const vols = [250, 500, 750, 1000, 1500]
    if (Math.random() < 0.5) {
      const combos = []; for (const v of vols) for (const h of [2, 3, 4, 5, 6, 8, 10, 12, 24]) if (Number.isInteger(v / h)) combos.push([v, h])
      const [v, h] = choice(combos)
      return { donnees: `perfusion de ${fr(v)} mL à passer en ${h} h → débit en mL/h`, reponse: `${v / h} mL/h`, methode: `${fr(v)} ÷ ${h}` }
    }
    const combos = []; for (const v of vols) for (const d of [50, 60, 75, 100, 125, 150, 200, 250]) { const min = v * 60 / d; if (Number.isInteger(min) && min >= 60) combos.push([v, d, min]) }
    const [v, d, min] = choice(combos)
    return { donnees: `perfusion de ${fr(v)} mL réglée à ${d} mL/h → durée totale`, reponse: `${Math.floor(min / 60)} h ${pad(min % 60)} min`, methode: `${fr(v)} × 60 ÷ ${d} = ${min} min, puis en heures et minutes` }
  },
  besoins_quotidiens: () => {
    const ml = choice([1200, 1500, 1800, 2000, 2500]); const [days, lbl] = choice([[7, 'une semaine'], [14, 'deux semaines'], [21, 'trois semaines'], [28, 'quatre semaines'], [30, 'un mois de 30 jours'], [31, 'un mois de 31 jours']])
    return { donnees: `${fr(ml)} mL d'eau par jour pendant ${lbl} (${days} jours) → total en litres`, reponse: `${fr(ml * days / 1000)} L`, methode: `${fr(ml)} × ${days} = ${fr(ml * days)} mL, puis ÷ 1 000` }
  },
  echelle_plan: () => {
    const e = choice([50, 100, 200, 250, 500, 1000, 25000]); const cm = e === 25000 ? choice([2, 4, 6, 8, 12]) : choice([2.5, 3, 4, 4.5, 5, 6, 7.5, 8, 12])
    const m = r2(cm * e / 100)
    return { donnees: `${e >= 25000 ? 'carte' : 'plan'} à l'échelle 1/${fr(e)}, longueur mesurée ${fr(cm)} cm → longueur réelle`, reponse: m >= 1000 ? `${fr(m / 1000)} km` : `${fr(m)} m`, methode: `${fr(cm)} × ${fr(e)} = ${fr(cm * e)} cm, puis convertir` }
  },
  surface_materiaux: () => {
    const L = dec1(3.2, 7.8), l = dec1(2.4, 5.6); const s = r2(L * l); const prix = choice([18, 22, 25, 28, 32, 35, 40, 45, 55]); const carton = choice([1.5, 2, 2.5])
    return { donnees: `pièce de ${fr(L)} m × ${fr(l)} m, revêtement à ${prix} €/m² (vendu par cartons de ${fr(carton)} m²) → coût du revêtement (surface × prix au m²)`, reponse: `${fr(r2(s * prix))} €`, methode: `surface ${fr(L)} × ${fr(l)} = ${fr(s)} m² (soit ${Math.ceil(s / carton)} cartons), puis ${fr(s)} × ${prix}` }
  },
  vitesse_distance: () => {
    const combos = []
    for (const d of [12, 18, 24, 36, 45, 60, 72, 90, 120, 150, 180, 210, 240, 300]) for (const v of [4, 5, 6, 15, 18, 20, 30, 40, 45, 50, 60, 72, 80, 90, 100, 110, 120]) { const min = d * 60 / v; if (Number.isInteger(min) && min >= 20 && min <= 600) combos.push([d, v, min]) }
    const [d, v, min] = choice(combos); const h = Math.floor(min / 60), m = min % 60
    return { donnees: `${d} km ${v <= 6 ? 'à pied' : v <= 20 ? 'à vélo' : 'en voiture'} à ${v} km/h → durée du trajet`, reponse: h ? `${h} h ${pad(m)} min` : `${m} min`, methode: `${d} ÷ ${v} h, soit ${min} min` }
  },
  consommation_carburant: () => {
    const conso = dec1(4.5, 8.5); const dist = rand(2, 9) * 100; const prix = choice([1.5, 1.6, 1.7, 1.8, 1.9, 2]); const litres = r2(conso * dist / 100)
    return { donnees: `${fr(conso)} L/100 km, trajet de ${fr(dist)} km, carburant à ${fr(prix)} €/L → coût du carburant`, reponse: `${fr(r2(litres * prix))} €`, methode: `${fr(conso)} × ${dist} ÷ 100 = ${fr(litres)} L, puis × ${fr(prix)}` }
  },
  verification_proportionnalite: () => {
    const a1 = rand(2, 6), k = choice([2, 3]); const t1 = rand(80, 115) / 100; const t2 = r2(t1 + rand(15, 40) / 100)
    return { donnees: `à ${a1} ans un enfant mesure ${fr(t1)} m, à ${a1 * k} ans il mesure ${fr(t2)} m → la taille est-elle proportionnelle à l'âge ? Si elle l'était, quelle taille aurait-il à ${a1 * k} ans ?`, reponse: `${fr(r2(t1 * k))} m (donc NON, ce n'est pas proportionnel)`, methode: `${fr(t1)} × ${k} = ${fr(r2(t1 * k))} ≠ ${fr(t2)}` }
  },

  // ===== problèmes =====
  probleme_ages: () => {
    const v = rand(0, 2)
    if (v === 0) { const c = rand(5, 15), k = choice([3, 4, 5]); const f = k * c; return { donnees: `un père de ${f} ans a ${k} fois l'âge de son fils → dans combien d'années aura-t-il le double de l'âge de son fils ?`, reponse: `${f - 2 * c} ans`, methode: `fils = ${c} ans ; ${f} + x = 2 × (${c} + x) → x = ${f - 2 * c}` } }
    if (v === 1) { const a = rand(4, 16), d = rand(2, 9); return { donnees: `deux sœurs : la somme de leurs âges est ${2 * a + d} ans, l'aînée a ${d} ans de plus → âge de la plus jeune`, reponse: `${a} ans`, methode: `x + (x + ${d}) = ${2 * a + d} → x = ${a}` } }
    let c = 6, n = 9, k = 3, m = 36
    for (let i = 0; i < 50; i++) { const cc = rand(3, 12), nn = rand(2, 10), kk = choice([2, 3]); const mm = kk * (cc + nn) - nn; if (mm >= cc + 18 && mm <= 60) { c = cc; n = nn; k = kk; m = mm; break } }
    return { donnees: `une mère de ${m} ans et sa fille de ${c} ans → dans combien d'années la mère aura-t-elle ${k} fois l'âge de sa fille ?`, reponse: `${n} ans`, methode: `${m} + x = ${k} × (${c} + x) → x = ${n}` }
  },
  moyenne_manquante: () => {
    let notes = [12, 14, 10, 15], target = 13, x = 14
    for (let i = 0; i < 60; i++) { const nn = Array.from({ length: rand(3, 5) }, () => rand(6, 18)); const t = choice([11, 12, 13, 14, 15]); const xx = t * (nn.length + 1) - nn.reduce((s, v) => s + v, 0); if (xx >= 0 && xx <= 20) { notes = nn; target = t; x = xx; break } }
    return { donnees: `notes obtenues : ${notes.join(', ')} → note à obtenir au ${notes.length + 1}e contrôle pour avoir ${target} de moyenne`, reponse: `${x}/20`, methode: `${target} × ${notes.length + 1} = ${target * (notes.length + 1)}, moins ${notes.reduce((s, v) => s + v, 0)} déjà obtenus` }
  },
  vitesse_rencontre: () => {
    const combos = []
    for (const [v1, v2] of [[4, 6], [5, 15], [5, 7], [4, 8], [6, 18], [12, 18], [15, 25], [20, 30], [30, 50], [40, 60], [45, 75], [10, 14], [60, 90]]) for (const m of [10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 60]) { const D = (v1 + v2) * m / 60; if (isClean1(D) && D >= 2) combos.push([v1, v2, m, D]) }
    const [v1, v2, m, D] = choice(combos)
    return { donnees: `deux personnes partent en même temps l'une vers l'autre, distantes de ${fr(D)} km, à ${v1} km/h et ${v2} km/h → temps avant de se croiser`, reponse: `${m} min`, methode: `vitesse de rapprochement ${v1 + v2} km/h ; ${fr(D)} ÷ ${v1 + v2} h = ${m} min` }
  },
  vitesse_moyenne_piege: () => {
    const [a, b, moy] = choice([[40, 60, 48], [30, 60, 40], [20, 30, 24], [60, 90, 72], [50, 75, 60], [24, 40, 30], [30, 70, 42], [40, 120, 60], [45, 90, 60], [20, 80, 32], [60, 120, 80], [30, 45, 36], [70, 105, 84], [10, 40, 16]])
    const ds = [120, 180, 240, 360, 420, 600, 840, 1260].filter(d => d % a === 0 && d % b === 0); const d = ds.length ? choice(ds) : a * b
    return { donnees: `aller de ${fr(d)} km à ${a} km/h, retour par la même route à ${b} km/h → vitesse moyenne sur l'aller-retour`, reponse: `${moy} km/h`, methode: `aller ${fr(d / a)} h + retour ${fr(d / b)} h = ${fr(d / a + d / b)} h ; ${fr(2 * d)} km ÷ ${fr(d / a + d / b)} h = ${moy} km/h (piège : ce n'est PAS (${a} + ${b}) ÷ 2)` }
  },
  placement_interets: () => {
    const v = rand(0, 2); const Cs = [1000, 1500, 2000, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000], Ts = [2, 2.5, 3, 3.5, 4, 5]
    const C = choice(Cs), t = choice(Ts), I = r2(C * t / 100)
    if (v === 0) return { donnees: `capital de ${fr(C)} € placé à ${fr(t)} % par an → intérêts au bout d'un an`, reponse: `${fr(I)} €`, methode: `${fr(C)} × ${fr(t)} ÷ 100` }
    if (v === 1) return { donnees: `un capital de ${fr(C)} € rapporte ${fr(I)} € d'intérêts en un an → taux annuel`, reponse: `${fr(t)} %`, methode: `${fr(I)} ÷ ${fr(C)} × 100` }
    const combos = []; for (const c of Cs) for (const tt of Ts) { const f = c * (1 + tt / 100) * (1 + tt / 100); if (isClean(f)) combos.push([c, tt, r2(f)]) }
    const [c2, t2, f] = choice(combos)
    return { donnees: `${fr(c2)} € placés à ${fr(t2)} % par an, intérêts composés → capital après 2 ans`, reponse: `${fr(f)} €`, methode: `${fr(c2)} × ${fr(1 + t2 / 100)} × ${fr(1 + t2 / 100)}` }
  },
  achats_repartition: () => {
    const a = choice(ACHATS); const n1 = rand(2, 6), n2 = rand(2, 5); const p1 = choice([1.2, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6.5]); const x = choice([1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 6])
    const total = r2(n1 * p1 + n2 * x)
    return { donnees: `${n1} ${a.p1} et ${n2} ${a.p2} coûtent ${fr(total)} € en tout ; un ${a.s1} coûte ${fr(p1)} € → prix d'un ${a.s2}`, reponse: `${fr(x)} €`, methode: `${fr(total)} − ${n1} × ${fr(p1)} = ${fr(r2(n2 * x))}, puis ÷ ${n2}` }
  },
  remplissage_vidange: () => {
    const V = choice([120, 150, 200, 240, 300, 360, 400, 480, 600])
    if (Math.random() < 0.5) {
      const [a, b, t] = choice([[10, 15, 30], [20, 30, 60], [12, 20, 30], [15, 20, 60], [6, 10, 15], [8, 24, 12], [30, 45, 90], [18, 30, 45], [24, 40, 60]])
      return { donnees: `bassin de ${V} L : un robinet le remplit en ${a} min, une bonde le vide en ${b} min ; les deux ouverts en même temps → temps de remplissage`, reponse: `${t} min`, methode: `par minute : 1/${a} − 1/${b} = 1/${t} du bassin → ${t} min` }
    }
    const [a, b, t] = choice([[10, 15, 6], [20, 30, 12], [12, 24, 8], [6, 12, 4], [15, 30, 10], [9, 18, 6], [5, 20, 4], [30, 60, 20], [40, 60, 24]])
    return { donnees: `cuve de ${V} L : un premier robinet la remplit seul en ${a} min, un second seul en ${b} min ; les deux ouverts ensemble → temps de remplissage`, reponse: `${t} min`, methode: `par minute : 1/${a} + 1/${b} = 1/${t} de la cuve → ${t} min` }
  },
  logique_escargot: () => {
    const H = rand(7, 20), u = rand(3, 5), d = rand(1, u - 1); const days = H <= u ? 1 : Math.ceil((H - u) / (u - d)) + 1
    const w = choice([['un escargot', 'un mur', 'monte', 'glisse'], ['une grenouille', 'la paroi d\'un puits', 'grimpe', 'retombe'], ['un alpiniste', 'une paroi', 'progresse', 'recule']])
    return { donnees: `${w[0]} doit gravir ${w[1]} de ${H} m : chaque jour il ${w[2]} de ${u} m, chaque nuit il ${w[3]} de ${d} m → nombre de jours pour atteindre le sommet`, reponse: `${days} jours`, methode: `gain net ${u - d} m par cycle jour/nuit ; le dernier jour il atteint le sommet AVANT de redescendre` }
  },
  budget_economies: () => {
    const combos = []
    for (const O of [300, 450, 600, 750, 900, 1200, 1500, 1800, 2000, 2400]) for (const E of [0, 50, 100, 150, 200, 300, 400]) for (const s of [40, 50, 60, 75, 80, 100, 120, 150]) { if (E < O && Number.isInteger((O - E) / s) && (O - E) / s >= 3) combos.push([O, E, s, (O - E) / s]) }
    const [O, E, s, n] = choice(combos); const goal = choice(['un vélo', 'un voyage', 'un ordinateur', 'une formation', 'un permis de conduire', 'un canapé', 'un séjour linguistique'])
    return { donnees: `objectif ${fr(O)} € pour ${goal}, ${E ? `déjà ${fr(E)} € de côté, ` : ''}épargne de ${s} € par mois → nombre de mois nécessaires`, reponse: `${n} mois`, methode: `(${fr(O)} − ${fr(E)}) ÷ ${s}` }
  },
  partage_proportionnel: () => {
    const ratio = choice([[1, 2], [2, 3], [1, 2, 3], [2, 3, 5], [1, 3, 4], [3, 4, 5], [1, 1, 2], [2, 5], [1, 4]]); const sum = ratio.reduce((s, v) => s + v, 0); const k = rand(4, 60) * 5
    return { donnees: `${choice(['une prime', 'un bénéfice', 'un héritage', 'une cagnotte', 'un gain'])} de ${fr(sum * k)} € partagé entre ${ratio.length} personnes proportionnellement à ${ratio.join(', ')} → la part la plus élevée`, reponse: `${fr(Math.max(...ratio) * k)} €`, methode: `${fr(sum * k)} ÷ ${sum} = ${fr(k)} € par part, × ${Math.max(...ratio)}` }
  }
}

// famille (champ JSON) de chaque sous-type
const FAMILLE = {}
for (const id of ['addition_posee', 'soustraction_posee', 'multiplication_decimaux', 'division_decimale', 'conversion_masse', 'conversion_volume', 'conversion_longueur', 'conversion_surface', 'conversion_duree', 'fraction_quantite', 'fraction_pourcentage', 'comparaison_nombres', 'imc']) FAMILLE[id] = 'conversions'
for (const id of ['pourcentage_quantite', 'taux_pourcentage', 'augmentation_pourcentage', 'reduction_soldes', 'tva_ht_ttc', 'tva_ttc_ht', 'valeur_initiale', 'pourcentages_successifs']) FAMILLE[id] = 'pourcentages'
for (const id of ['proportionnalite_recette', 'dose_mg_kg', 'dilution_concentration', 'debit_perfusion', 'besoins_quotidiens', 'echelle_plan', 'surface_materiaux', 'vitesse_distance', 'consommation_carburant', 'verification_proportionnalite']) FAMILLE[id] = 'proportionnalite'
for (const id of ['probleme_ages', 'moyenne_manquante', 'vitesse_rencontre', 'vitesse_moyenne_piege', 'placement_interets', 'achats_repartition', 'remplissage_vidange', 'logique_escargot', 'budget_economies', 'partage_proportionnel']) FAMILLE[id] = 'equations'

// pools de l'examen blanc
const EX1_POOL = ['addition_posee', 'soustraction_posee', 'multiplication_decimaux', 'division_decimale', 'conversion_masse', 'conversion_volume', 'conversion_longueur', 'conversion_surface', 'conversion_duree', 'fraction_quantite']
const EX2_POOL = ['pourcentage_quantite', 'taux_pourcentage', 'augmentation_pourcentage', 'reduction_soldes', 'tva_ht_ttc', 'tva_ttc_ht', 'valeur_initiale', 'proportionnalite_recette', 'dose_mg_kg', 'dilution_concentration', 'debit_perfusion', 'besoins_quotidiens', 'echelle_plan', 'imc', 'vitesse_distance', 'consommation_carburant', 'surface_materiaux']
const EX3_POOL = ['probleme_ages', 'moyenne_manquante', 'vitesse_rencontre', 'vitesse_moyenne_piege', 'pourcentages_successifs', 'placement_interets', 'achats_repartition', 'remplissage_vidange', 'logique_escargot', 'budget_economies', 'partage_proportionnel']
const EX3_FACILE = ['moyenne_manquante', 'achats_repartition', 'logique_escargot', 'budget_economies', 'partage_proportionnel', 'placement_interets']
const EX3_DIFFICILE = ['probleme_ages', 'vitesse_rencontre', 'vitesse_moyenne_piege', 'pourcentages_successifs', 'remplissage_vidange', 'placement_interets']
const MEDICAL = ['dose_mg_kg', 'dilution_concentration', 'debit_perfusion', 'besoins_quotidiens', 'imc']
const PIEGES = ['conversion_duree', 'tva_ttc_ht', 'valeur_initiale', 'dilution_concentration', 'pourcentages_successifs', 'vitesse_moyenne_piege', 'logique_escargot', 'remplissage_vidange']
const EX3_PIEGES = ['pourcentages_successifs', 'vitesse_moyenne_piege', 'logique_escargot', 'remplissage_vidange']

const ligne = (prefix, id, hard) => {
  const q = GEN[id](hard)
  return `${prefix} [${id} — famille : ${FAMILLE[id]}] Données : ${q.donnees} → Réponse attendue : ${q.reponse} — Méthode : ${q.methode}`
}

const REGLES_COMMUNES = `1. Chaque question reprend EXACTEMENT les données imposées, et sa "reponse" est EXACTEMENT la réponse attendue indiquée (déjà vérifiée par calcul). Tu rédiges l'énoncé (mise en situation, prénoms), l'indice et l'explication à partir de la méthode.
2. INTERDIT de reprendre les nombres des exemples du system prompt ou du PDF (70 kg, 0,5 mg/kg, 260 €, 55 €, 134 €, 48 m², 2 700 gâteaux, 400 g de poireaux, 1 500 mL, 1 000 € à 2 %, 1 200 €, 350 €, 200 g de farine, 160 g de fromage, 9 452 ÷ 12…). Ces exemples montrent le NIVEAU et la FORME, jamais les chiffres.
3. N'écris jamais le mot « brief », ni les identifiants entre crochets, ni la mention « réponse attendue » dans les énoncés.
4. Les contextes et les prénoms ci-dessus remplacent toute autre consigne de variation ou d'alternance.`

// ============================================================
// EXAMEN BLANC (route /api/maths) — 8 questions en 3 exercices
// `recent` = { sousTypes: [...], contextes: [...] } des derniers sujets
// du candidat, pour éviter de retomber sur les mêmes
// ============================================================
export function buildBriefExamen(recent = {}) {
  const exclude = Array.isArray(recent?.sousTypes) ? recent.sousTypes : []
  const exclCtx = Array.isArray(recent?.contextes) ? recent.contextes : []
  const niveau = tirerNiveau()
  const hard = niveau.hard

  const ex1 = pick(EX1_POOL, 3, exclude)
  const ex2 = pick(EX2_POOL, 3, exclude)
  const ex3 = pick(niveau.id === 'difficile' ? EX3_DIFFICILE : niveau.id === 'facile' ? EX3_FACILE : EX3_POOL, 2, exclude)
  // garanties du concours : au moins 1 question médicale et 1 piège classique
  if (!ex2.some(id => MEDICAL.includes(id))) ex2[2] = choice(MEDICAL.filter(id => !ex2.includes(id)))
  if (![...ex1, ...ex2, ...ex3].some(id => PIEGES.includes(id))) ex3[1] = choice(EX3_PIEGES.filter(id => id !== ex3[0]))

  const contextes = pick(CONTEXTES, 3, exclCtx)
  const prenoms = pick(PRENOMS, 6)

  const text = `## BRIEF DE VARIATION — IMPOSÉ POUR CE SUJET
Ce brief est tiré au sort à chaque génération pour garantir un sujet réellement différent des précédents (sous-types, contextes, prénoms ET nombres).

Difficulté globale : ${niveau.label}
Contexte de l'exercice 2 : ${contextes[0]}
Contextes de l'exercice 3 : ${contextes[1]} (question 3a) ; ${contextes[2]} (question 3b)
Prénoms à utiliser (uniquement ceux-ci, jamais d'autres) : ${prenoms.join(', ')}

### Exercice 1 — calculs et conversions (sans mise en situation, comme au concours)
${ex1.map((id, i) => ligne(`1${'abc'[i]}`, id, hard)).join('\n')}

### Exercice 2 — pourcentages et proportionnalité (contexte : ${contextes[0]})
${ex2.map((id, i) => ligne(`2${'abc'[i]}`, id, hard)).join('\n')}

### Exercice 3 — problèmes (une petite histoire par question)
${ex3.map((id, i) => ligne(`3${'ab'[i]}`, id, hard)).join('\n')}

### Règles du brief (prioritaires sur toute autre consigne)
${REGLES_COMMUNES}
5. Le champ "sous_type" de chaque question reprend l'identifiant entre crochets, le champ "famille" la famille indiquée.
6. La difficulté globale ci-dessus remplace la consigne d'alternance entre sessions.`

  return { text, meta: { niveau: niveau.id, sousTypes: [...ex1, ...ex2, ...ex3], contextes } }
}

// ============================================================
// ENTRAÎNEMENT SPÉCIFIQUE (route /api/specifique) — 10 questions d'une famille
// L'ordre suit la répartition des prompts famille, du plus facile au plus dur
// ============================================================
const FAMILLES_SPECIFIQUE = {
  pourcentages: () => ['pourcentage_quantite', 'pourcentage_quantite', 'taux_pourcentage', 'augmentation_pourcentage', 'reduction_soldes', choice(['tva_ht_ttc', 'tva_ttc_ht']), 'augmentation_pourcentage', 'fraction_pourcentage', 'valeur_initiale', 'pourcentages_successifs'],
  operations: () => ['proportionnalite_recette', 'proportionnalite_recette', 'besoins_quotidiens', 'dose_mg_kg', 'surface_materiaux', 'dose_mg_kg', 'dilution_concentration', 'echelle_plan', 'debit_perfusion', 'verification_proportionnalite'],
  conversions: () => ['conversion_masse', 'conversion_volume', 'multiplication_decimaux', 'conversion_masse', 'division_decimale', 'conversion_duree', 'fraction_quantite', choice(['conversion_surface', 'conversion_longueur']), 'imc', 'comparaison_nombres'],
  equations: () => ['achats_repartition', 'moyenne_manquante', 'probleme_ages', 'budget_economies', 'partage_proportionnel', 'valeur_initiale', 'placement_interets', 'vitesse_rencontre', 'probleme_ages', choice(['logique_escargot', 'remplissage_vidange'])]
}

export function buildBriefFamille(famille) {
  const plan = FAMILLES_SPECIFIQUE[famille]
  if (!plan) return { text: '', meta: null }
  const ids = plan()
  const contextes = pick(CONTEXTES, 4)
  const prenoms = pick(PRENOMS, 6)
  const text = `## BRIEF DE VARIATION — IMPOSÉ POUR CETTE SÉRIE
Ce brief est tiré au sort à chaque génération pour garantir des questions réellement différentes des séries précédentes (contextes, prénoms ET nombres).

Contextes à répartir sur les 10 questions : ${contextes.join(' ; ')}
Prénoms à utiliser (uniquement ceux-ci, jamais d'autres) : ${prenoms.join(', ')}

### Données imposées, question par question (l'ordre est imposé : difficulté progressive)
${ids.map((id, i) => ligne(`Q${i + 1}`, id, i >= 7)).join('\n')}

### Règles du brief (prioritaires sur toute autre consigne)
${REGLES_COMMUNES}
5. Ce brief fixe l'ordre et les données des 10 questions : il prévaut sur la répartition indicative donnée plus haut.`
  return { text, meta: { sousTypes: ids, contextes } }
}
