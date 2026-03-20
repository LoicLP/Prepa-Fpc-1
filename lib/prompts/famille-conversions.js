// lib/prompts/famille-conversions.js
// ============================================================
// SYSTEM INSTRUCTION — FAMILLE 3 : CONVERSIONS & OPÉRATIONS DE BASE
// Fréquence au concours : présente dans ~100% des sujets
// Les divisions = ~60% de l'épreuve
// ============================================================

export const SYSTEM_CONVERSIONS = `
## FAMILLE : CONVERSIONS D'UNITÉS & OPÉRATIONS DE BASE
Fréquence : présente dans ~100% des sujets. Les divisions à elles seules représentent ~60% de l'épreuve.
Les conversions médicales (µg, mg, g) sont les plus fréquentes.

### SOUS-TYPE 3.1 — Opérations posées (calculs bruts)
Calculs sans contexte, récurrents dans les sujets "faciles" (Marseille notamment).
EXEMPLES TIRÉS DES ANNALES :
- "3 789,18 + ..." (addition de décimaux) — Sujet Marseille 2024, Exercice 1a
- "658,63 ÷ 12,7" (division de décimaux) — Sujet Marseille 2024, Exercice 1b
- "952,48 − 399,25" (soustraction) — Sujet Marseille 2024, Exercice 1c
- "67,90 × 3,58" (multiplication de décimaux) — Sujet Marseille 2024, Exercice 1d
- "Calculer : 45,6 × 0,25"
- "Calculer : 1 234,5 ÷ 0,5"
- "7 livres à 14,50€, paye 15,35€ par CB, reste par chèque ?" → 7×14,50 = 101,50 ; 101,50−15,35 = 86,15€

### SOUS-TYPE 3.2 — Conversions de masses (LE PLUS FRÉQUENT AU CONCOURS)
Directement lié aux prescriptions médicales. Présent quasi systématiquement.
Rappel : 1 g = 1 000 mg = 1 000 000 µg | 1 kg = 1 000 g
EXEMPLES TIRÉS DES ANNALES :
- "2 500 microgrammes en milligrammes ?" → 2,5 mg (très fréquent)
- "1 735 kg en grammes ?" → 1 735 000 g (Sujet Marseille 2024, Exercice 2b)
- "0,25 g en mg ?" → 250 mg
- "750 mg en g ?" → 0,75 g
- "Ordonner : 500 µg, 0,05 g, 5 mg, 0,5 mg" → piège, tout convertir dans la même unité d'abord : 0,5 mg = 500 µg, donc 0,5 mg = 500 µg < 5 mg < 0,05 g (= 50 mg)

### SOUS-TYPE 3.3 — Conversions de volumes
Rappel : 1 L = 100 cL = 1 000 mL | 1 cm³ = 1 mL | 1 hL = 100 L
EXEMPLES TIRÉS DES ANNALES :
- "269 cm³ = ? mL" → 269 mL (1 cm³ = 1 mL) — Sujet Marseille 2024, Exercice 2c
- "106 L = ? hL" → 1,06 hL — Sujet Marseille 2024, Exercice 2d
- "1,75 L en mL ?" → 1 750 mL
- "Combien de flacons de 50mL dans 2L de solution ?" → 2 000 ÷ 50 = 40 flacons

### SOUS-TYPE 3.4 — Conversions de longueurs et surfaces
Rappel surfaces : on multiplie/divise par 100 (et non 10) entre chaque unité.
1 m² = 10 000 cm² | 1 km² = 1 000 000 m²
EXEMPLES TIRÉS DES ANNALES :
- "256,77 m en décamètres ?" → 25,677 dam
- "48 m² en cm² ?" → 48 × 10 000 = 480 000 cm² (Sujet Douai 2023)

### SOUS-TYPE 3.5 — Conversions de durées — PIÈGE base 60
Les durées ne sont PAS en base 10. Erreur très fréquente des candidats.
Rappel : 1 h = 60 min | 1 min = 60 s | 1 jour = 24 h
EXEMPLES TIRÉS DES ANNALES :
- "1h25 = ? min" → 85 min (Sujet Marseille 2024, Exercice 2a)
- "21h + 430 min = ?" → 430 min = 7h10 ; total = 28h10 = 1 jour 4h 10min
- "Trajet 2h45, départ 14h50. Heure d'arrivée ?" → 17h35
- "Perfusion 8h, début 22h. Fin ?" → 6h du matin

### SOUS-TYPE 3.6 — Fractions
EXEMPLES TIRÉS DES ANNALES :
- "(8/3) + (29/6) = ?" → (16/6) + (29/6) = 45/6 = 15/2 = 7,5
- "Simplifier 45/6" → 15/2
- "50% = 4/8 ?" → VRAI
- "Réservoir 60L rempli aux 3/5. Combien de litres ?" → 60 × 3/5 = 36 L

### SOUS-TYPE 3.7 — IMC (Indice de Masse Corporelle)
Formule : IMC = poids (kg) ÷ taille² (m)
Interprétation : <18,5 maigreur | 18,5-25 normal | 25-30 surpoids | >30 obésité
EXEMPLES TIRÉS DES ANNALES :
- "Patient 85kg, 1,72m. IMC ?" → 85 ÷ (1,72)² = 85 ÷ 2,9584 ≈ 28,7 (surpoids)
- "Patiente 1,65m, 72kg. IMC ? Surpoids ?" → 72 ÷ (1,65)² ≈ 26,4. Oui (>25).

### SOUS-TYPE 3.8 — Classement / Comparaison de nombres
EXEMPLES TIRÉS DES ANNALES :
- "Classer : 0,07 ; 7/100 ; 0,7 ; 0,007" → 0,007 < 0,07 = 7/100 < 0,7
- "Quel est le plus grand : 3 721 ou 7 239 ? Et entre 7 321 et 7 239 ?"

### SOUS-TYPE 3.9 — Chiffres romains (rare — prescriptions en gouttes)
Les prescriptions médicales en gouttes utilisent parfois les chiffres romains.
EXEMPLES TIRÉS DES ANNALES :
- "Écrire en chiffres romains : 15, 28, 42" → XV, XXVIII, XLII
- "Prescription XVIII gouttes = combien ?" → 18
`;

export const PROMPT_CONVERSIONS = `Génère exactement 10 questions sur les CONVERSIONS D'UNITÉS et les OPÉRATIONS DE BASE pour le concours FPC.

Répartition OBLIGATOIRE sur les 10 questions :
- 2 questions "conversions de masses" µg↔mg↔g↔kg (le sous-type LE PLUS fréquent au concours)
- 2 questions "opérations posées" : multiplication ET division de nombres décimaux (dans un contexte d'achat ou commande)
- 1 question "conversion de volumes" L↔mL↔cL↔cm³
- 1 question "conversion de durées" avec piège base 60 (heures+minutes, départ/arrivée)
- 1 question "fractions" : addition, simplification, ou fraction d'une grandeur
- 1 question "IMC" : poids ÷ taille² avec interprétation (surpoids >25, obésité >30)
- 1 question "classement / comparaison de nombres" (décimaux, fractions mélangées)
- 1 question bonus : conversion longueur/surface OU chiffres romains

Les divisions doivent dominer (au vrai concours elles = ~60% de l'épreuve).
Difficulté progressive : Q1-3 faciles, Q4-7 moyennes, Q8-10 complexes.
Inspire-toi des exemples RÉELS du concours fournis ci-dessus mais ne les recopie JAMAIS à l'identique.`;
