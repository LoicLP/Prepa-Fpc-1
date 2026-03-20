// lib/prompts/famille-equations.js
// ============================================================
// SYSTEM INSTRUCTION — FAMILLE 4 : ÉQUATIONS SIMPLES & PROBLÈMES
// Fréquence au concours : présente dans ~50% des sujets
// TOUJOURS du 1er degré (jamais de x², jamais de systèmes complexes)
// ============================================================

export const SYSTEM_EQUATIONS = `
## FAMILLE : ÉQUATIONS SIMPLES & PROBLÈMES
Fréquence : présente dans ~50% des sujets. Famille la moins fréquente mais discriminante.
RÈGLE ABSOLUE : uniquement des équations du 1er degré. Jamais de x², jamais de systèmes à 2 inconnues complexes.

### SOUS-TYPE 4.1 — Problèmes d'âges (CLASSIQUE du concours FPC)
C'est le type de problème le plus emblématique. Revient très régulièrement.
EXEMPLES TIRÉS DES ANNALES :
- "Pierre et Paul sont frères. Somme de leurs âges = âge du père. Pierre a 4 ans de plus que Paul. Pierre est né quand le père avait son âge actuel. Âge du père ?" (Sujet Paris 2025)
  → Si Paul = x, Pierre = x+4, Père = 2x+4. Pierre est né quand le père avait (x+4) ans, donc Père = 2(x+4). Résolution...
- "Trois femmes, moyenne 40 ans. Aînée 50 ans. Moyenne des 2 autres ? Si une a 30 ans, âge de la 3ème ?"
  → Total = 120. Reste 70 pour 2 → moyenne = 35. Si une = 30, l'autre = 40.
- "Père 42 ans = 3× l'âge de son fils. Dans combien d'années aura-t-il le double ?"
  → Fils = 14. Équation : 42+x = 2(14+x) → 42+x = 28+2x → x = 14 ans.

### SOUS-TYPE 4.2 — Problèmes de production / stock
EXEMPLES TIRÉS DES ANNALES :
- "421 065 stylos (S1) + 137 265 (S2) = 558 330 en 2018. C'est +30% vs 2017. Production 2017 ?"
  → 558 330 ÷ 1,30 = 429 484 (Sujet type annales, très fréquent)

### SOUS-TYPE 4.3 — Problèmes de placement / intérêts
EXEMPLES TIRÉS DES ANNALES :
- "Placement rapporte 400€ (année 1) puis 416€ (année 2, intérêts composés). Somme initiale et taux ?"
  → Taux = (416-400)÷400 = 4%. Capital × 0,04 = 400 → Capital = 10 000€
- "5 000€ placés à 3%/an. Montant après 2 ans ?"
  → 5 000 × 1,03² = 5 304,50€

### SOUS-TYPE 4.4 — Problèmes de vitesse et rencontre
ATTENTION : la vitesse moyenne n'est PAS la moyenne des vitesses. C'est un piège fréquent.
EXEMPLES TIRÉS DES ANNALES :
- "Henri marche à 5 km/h, Aline pédale à 15 km/h, 5km de distance, sens opposé. Quand se croisent-ils ?"
  → 5 ÷ (5+15) = 0,25h = 15 min
- "Taxi Poitiers–La Rochelle (130km) à 32,5 km/h, retour à 130 km/h. Vitesse moyenne A/R ?"
  → Aller: 4h. Retour: 1h. Total: 260km en 5h = 52 km/h. (PAS (32,5+130)÷2 = 81,25 !)
- "Trajet 150km : 90km à 60km/h + 60km à 80km/h. Durée totale ?"
  → 90/60 + 60/80 = 1,5 + 0,75 = 2h15min
- "Alain part à 5km/h du village A. Pierre part du village B (2km en aval) à 7km/h, 15 min plus tard. Quand Pierre rattrape-t-il Alain ?"
  → Avance Alain: 2 + 5×0,25 = 3,25km. Vitesse relative: 7-5 = 2km/h. Temps: 3,25÷2 = 1h37min30s

### SOUS-TYPE 4.5 — Problèmes de répartition / achats
EXEMPLES TIRÉS DES ANNALES :
- "3 cahiers + 2 stylos = 11,50€. Cahier = 2,50€. Prix d'un stylo ?"
  → 3×2,50 = 7,50 ; (11,50-7,50)÷2 = 2€
- "7 livres à 14,50€, paye 15,35€ par CB, reste par chèque ?"
  → 7×14,50 = 101,50 ; 101,50-15,35 = 86,15€

### SOUS-TYPE 4.6 — Problèmes de moyennes
EXEMPLES TIRÉS DES ANNALES :
- "Notes : 12, 15, 9, 14. Note au 5ème contrôle pour avoir 13 de moyenne ?"
  → (12+15+9+14+x)÷5 = 13, donc 50+x = 65, x = 15
- "3 femmes, moyenne 40 ans. Aînée 50. Moyenne des 2 autres ?"
  → (120-50)÷2 = 35

### SOUS-TYPE 4.7 — Problèmes de remplissage / vidange
EXEMPLES TIRÉS DES ANNALES :
- "Robinet remplit baignoire 200L en 10 min. Autre la vide en 15 min. Ensemble, combien de temps pour remplir ?"
  → Débit remplissage: 20 L/min. Débit vidange: 13,33 L/min. Net: 6,67 L/min. Temps: 200÷6,67 = 30 min

### SOUS-TYPE 4.8 — Raisonnement logique / Questions pièges
EXEMPLES TIRÉS DES ANNALES :
- "Soldé 20% puis re-soldé 20% = -40% ? NON → 100×0,80×0,80 = 64. Baisse de 36%."
- "Escargot monte mur de 10m. Jour: +3m. Nuit: -2m. Combien de jours pour atteindre le sommet ?"
  → 8 jours (le 8ème jour il atteint 10m AVANT de glisser la nuit, donc c'est fini)
- "Classer 3/7, 2/5, 5/12 du plus petit au plus grand"
  → Mise au même dénominateur (420) : 180, 168, 175 → 2/5 < 5/12 < 3/7
`;

export const PROMPT_EQUATIONS = `Génère exactement 10 questions sur les ÉQUATIONS SIMPLES et les PROBLÈMES pour le concours FPC.

IMPORTANT : uniquement du 1er degré. Jamais de x². Jamais de systèmes à 2 inconnues complexes.

Répartition OBLIGATOIRE sur les 10 questions :
- 2 questions "problème d'âges" avec mise en équation (LE classique du concours FPC)
- 1 question "problème de moyenne" (trouver valeur manquante pour atteindre une moyenne cible)
- 1 question "problème de vitesse / rencontre / durée de trajet"
- 1 question "problème de répartition / achats" (prix, partage)
- 1 question "problème de production avec pourcentage" (retrouver valeur initiale)
- 1 question "problème de placement / intérêts" (trouver capital ou taux)
- 1 question "raisonnement logique / question piège" (escargot, pourcentages cumulés, etc.)
- 1 question bonus : remplissage/vidange OU répartition avancée

Chaque problème DOIT raconter une petite histoire concrète avec des prénoms français.
Difficulté progressive : Q1-4 faciles (équation directe), Q5-7 moyennes, Q8-10 complexes (multi-étapes).
Inspire-toi des exemples RÉELS du concours fournis ci-dessus mais ne les recopie JAMAIS à l'identique.`;
