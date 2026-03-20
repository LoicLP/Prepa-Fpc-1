// lib/prompts/famille-pourcentages.js
// ============================================================
// SYSTEM INSTRUCTION — FAMILLE 1 : POURCENTAGES
// Fréquence au concours : présente dans ~100% des sujets
// ============================================================

export const SYSTEM_POURCENTAGES = `
## FAMILLE : POURCENTAGES
Fréquence : présente dans quasiment 100% des sujets de maths du concours FPC.
C'est la famille la plus importante à maîtriser.

### SOUS-TYPE 1.1 — Calculer un pourcentage d'une quantité
On donne un total et un pourcentage, trouver la partie.
EXEMPLES TIRÉS DES ANNALES :
- "En France, 70 millions d'habitants dont 13% de gauchers. Combien de gauchers ?" → 70 000 000 × 0,13 = 9 100 000
- "40% des cancers sont liés à nos habitudes de vie. Sur 350 000 nouveaux cas, combien évitables ?" → 140 000 (Sujet PACA 2024)
- "62% des 2 250 membres d'un club sont des femmes. Nombre de femmes ?" → 2 250 × 0,62 = 1 395
- "Un lycée compte 1 200 élèves. 35% sont internes. Combien d'internes ?" → 420

### SOUS-TYPE 1.2 — Calculer un taux de pourcentage
On donne une partie et un total, trouver le pourcentage.
EXEMPLES TIRÉS DES ANNALES :
- "4 infirmières sur 7 prennent un café à la pause. Quel % d'IDE ?" → (4÷7)×100 ≈ 57%
- "Fromage de 160g contient 40g de matières grasses. % de MG ?" → (40÷160)×100 = 25% (Sujet Réunion 2024)
- "Sur 250 patients admis aux urgences, 45 hospitalisés. Quel % ?" → (45÷250)×100 = 18%
- "Infirmier réussit 18 prélèvements sur 20. Taux de réussite ?" → 90%

### SOUS-TYPE 1.3 — Augmentation en pourcentage
Valeur initiale + taux d'augmentation → nouvelle valeur.
EXEMPLES TIRÉS DES ANNALES :
- "Location 1 200€ en janvier, augmentation de 7% en février. Prix pour 2 semaines ?" (Sujet Douai 2023)
- "Entreprise fabrique 2 700 gâteaux/semaine. Hausse de 20% pour les fêtes. Combien ?" → 3 240 (Sujet Réunion 2024 Q1)
- "Taux d'intérêt de 2% sur 1 000€. Intérêts 1ère année ?" → 20€ (Sujet Douai 2023)
- "Loyer 350€ augmente de 3% (année 1) puis 2% (année 2). Après 2 ans ?" → 350 × 1,03 × 1,02 = 367,71€
- "Jouet à 200€, augmentation de 40% en janvier. Nouveau prix ?" → 280€

### SOUS-TYPE 1.4 — Diminution / Soldes
Valeur initiale + taux de réduction → prix soldé.
EXEMPLES TIRÉS DES ANNALES :
- "Articles soldés à 20%. Calculer nouveau prix ET réduction en euros." (Sujet Marseille 2024 — plusieurs articles avec prix différents)
- "Jouet vendu 240€, soldé 192€. Taux de réduction ?" → (240-192)÷240×100 = 20%
- "Jouet à 280€ après augmentation, diminue de 5% en février. Prix ?" → 280 × 0,95 = 266€
- "Téléphone à 599€, soldes -15%. Prix soldé ?" → 599 × 0,85 = 509,15€

### SOUS-TYPE 1.5 — Retrouver la valeur initiale
On connaît la valeur finale et le % d'augmentation ou diminution.
EXEMPLES TIRÉS DES ANNALES :
- "Production 2018 = 558 330 stylos. C'est +30% vs 2017. Production 2017 ?" → 558 330 ÷ 1,30 = 429 484 (Sujet type annales, très fréquent)
- "Après +10% puis +22%, aspirateur coûte 161,04€. Prix initial ?" → 161,04 ÷ (1,10 × 1,22) = 120€
- "1 395 femmes = 62% des membres d'un club. Total membres ?" → 1 395 ÷ 0,62 = 2 250

### SOUS-TYPE 1.6 — TVA
EXEMPLES TIRÉS DES ANNALES :
- "Appareil médical 450€ HT, TVA 20%. Prix TTC ?" → 450 × 1,20 = 540€
- "Article 66€ TTC, TVA 10%. Prix HT ?" → 66 ÷ 1,10 = 60€

### SOUS-TYPE 1.7 — Pourcentages successifs / Piège classique
C'est la question piège la plus fréquente au concours.
EXEMPLES TIRÉS DES ANNALES :
- "+10% puis -10% = retour au prix initial ? NON. 100 × 1,10 × 0,90 = 99. Baisse de 1%."
- "Soldé 20% puis re-soldé 20% = -40% ? NON. 100 × 0,80 × 0,80 = 64. Baisse de 36%."

### SOUS-TYPE 1.8 — Conversion fraction ↔ pourcentage
EXEMPLES TIRÉS DES ANNALES :
- "1/4 = 2,5% ? FAUX. 1/4 = 0,25 = 25%"
- "50% = 4/8 ? VRAI. 4/8 = 0,5 = 50%"
- "Convertir 3/8 en %. → 3÷8 = 0,375 = 37,5%"
`;

export const PROMPT_POURCENTAGES = `Génère exactement 10 questions de mathématiques sur les POURCENTAGES pour le concours FPC.

Répartition OBLIGATOIRE sur les 10 questions :
- 2 questions "calculer un % d'une quantité" (contexte santé publique, population, hôpital)
- 2 questions "augmentation en %" (loyer, production, prix, salaire)
- 1 question "calculer un taux de %" (partie/total, contexte médical)
- 1 question "diminution / soldes" (magasin, pharmacie, article médical)
- 1 question "retrouver la valeur initiale" après augmentation ou diminution
- 1 question "TVA" (HT→TTC ou TTC→HT)
- 1 question "pourcentages successifs" (piège : +X% puis -X% ≠ retour au départ)
- 1 question "conversion fraction ↔ %" ou question bonus d'un sous-type ci-dessus

Difficulté progressive : Q1-3 faciles, Q4-7 moyennes, Q8-10 complexes.
Inspire-toi des exemples RÉELS du concours fournis ci-dessus mais ne les recopie JAMAIS à l'identique.`;
