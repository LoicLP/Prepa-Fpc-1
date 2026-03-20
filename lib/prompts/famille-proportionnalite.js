// lib/prompts/famille-proportionnalite.js
// ============================================================
// SYSTEM INSTRUCTION — FAMILLE 2 : PRODUIT EN CROIX / PROPORTIONNALITÉ
// Fréquence au concours : présente dans ~80% des sujets
// ============================================================

export const SYSTEM_PROPORTIONNALITE = `
## FAMILLE : PRODUIT EN CROIX / RÈGLE DE TROIS / PROPORTIONNALITÉ
Fréquence : présente dans ~80% des sujets. Inclut les calculs de doses (préfiguration IFSI), les proportions, les débits.

### SOUS-TYPE 2.1 — Proportionnalité directe simple
EXEMPLES TIRÉS DES ANNALES :
- "200g de farine pour 10 crêpes. Combien pour 20 ?" → 400g (Très classique, revient chaque année)
- "Recette soupe : 3× plus de pommes de terre que de poireaux. 400g de poireaux → combien de PDT ?" → 1 200g (Sujet Réunion 2024 Q2)
- "5 infirmiers achètent 20 boîtes de gants/semaine. Avec 2 de plus, combien de boîtes ?" → (20÷5)×7 = 28
- "Pour 50mL de préparation : 3g produit A, 1,5g produit B. Pour 1,75L ?" → A: (1750×3)÷50 = 105g, B: 52,5g
- "Recette 4 personnes : 300g de pâtes. Pour 7 personnes ?" → (300×7)÷4 = 525g

### SOUS-TYPE 2.2 — Calculs de doses médicamenteuses (SPÉCIFIQUE IFSI)
C'est LE type de question emblématique du concours FPC. Toujours présent.
EXEMPLES TIRÉS DES ANNALES :
- "Patient 70kg, 0,5 mg/kg. Dose totale ?" → 70 × 0,5 = 35 mg
- "Flacon 30mL contenant 15mg de produit actif. Prescription : 10mg. Volume à administrer ?" → (10×30)÷15 = 20 mL
- "Colymicine 5 000 UI/kg/jour en 3 fois. Patiente 45kg. Flacon 500 000 UI/5mL. Volume par injection ?" → Dose/jour = 225 000 UI, par injection = 75 000 UI, volume = (75 000×5)÷500 000 = 0,75 mL
- "Dépakine sirop 1mL = 200mg. Prescription 1 000mg. Combien de mL ? Combien de cuillères à café (1càc = 5mL) ?" → 5 mL = 1 cuillère
- "Solution glucose 5% pour 200mL d'eau. Grammes de glucose ?" → 5g/100mL, donc 10g/200mL
- "Sur un flacon : Produit D 5%. Poche de 1L. Combien de grammes de produit D ?" → 5% = 5g/100mL, donc 50g/1L (ATTENTION piège : pas 5g !)

### SOUS-TYPE 2.3 — Débits de perfusion
Formules à connaître :
- Débit (gouttes/min) = Volume (mL) × 20 ÷ Temps (min)
- Débit (mL/h) = Volume (mL) ÷ Temps (h)
- 1 mL = 20 gouttes (standard)
EXEMPLES TIRÉS DES ANNALES :
- "Perfusion 1 litre à 60 mL/h. Durée ?" → 1 000÷60 = 16h40min
- "1 000mL glucosé 5% + 15mL NaCl + 10mL KCl en 24h. Débit gttes/min ?" → (1 025×20)÷(24×60) ≈ 14 gttes/min
- "Masque O₂ à 12L/min. Bouteille 5L à 90 bars. Contenance ? Suffit pour 30 min ?" → 5×90 = 450L. Besoin: 12×30 = 360L. Oui.
- "Lasilix 250mg en PSE sur 2h. Ampoules 25mL à 250mg. Débit PSE ?" → 25÷2 = 12,5 mL/h

### SOUS-TYPE 2.4 — Surfaces et matériaux
EXEMPLES TIRÉS DES ANNALES :
- "Parquet 48m², 1 carton = 2m². Nb cartons ? Prix total à 30€/m² ?" → 24 cartons, 1 440€ (Sujet Douai 2023)
- "Pièce 4,5m × 3,2m. Surface ? Si 1 pot couvre 10m², combien de pots ?" → 14,4m², 2 pots

### SOUS-TYPE 2.5 — Besoins quotidiens / Approvisionnement
EXEMPLES TIRÉS DES ANNALES :
- "Paulette boit 1 500 mL/jour. Litres pour janvier (31 jours) ?" → 1 500 × 31 = 46 500 mL = 46,5 L (Sujet Paris 2025)
- "Patient doit boire 2L/jour. Bouteilles de 50cL. Combien par semaine ?" → 2 000÷500 = 4/jour × 7 = 28 bouteilles

### SOUS-TYPE 2.6 — Vérification de proportionnalité / Contre-exemples
La réponse est toujours NON — il faut le justifier.
EXEMPLES TIRÉS DES ANNALES :
- "À 5 ans, taille 1,10m. À 10 ans, 1,40m. Taille proportionnelle à l'âge ?" → NON. À 2× l'âge il ne fait pas 2×1,10 = 2,20m. (Quiz IESTL, classique)
- "Bébé 3,5kg à la naissance, 10kg à 1 an. Poids proportionnel à l'âge ?" → NON.

### SOUS-TYPE 2.7 — Échelle / Plans
EXEMPLES TIRÉS DES ANNALES :
- "Plan à 1/200, pièce mesure 3cm × 4cm. Dimensions réelles ?" → 6m × 8m
`;

export const PROMPT_PROPORTIONNALITE = `Génère exactement 10 questions sur le PRODUIT EN CROIX et la PROPORTIONNALITÉ pour le concours FPC.

Répartition OBLIGATOIRE sur les 10 questions :
- 2 questions "proportionnalité directe" (recette cuisine, matériel, approvisionnement)
- 2 questions "calcul de doses médicamenteuses" en mg/kg ou UI/kg (contexte patient, prescription)
- 1 question "débit de perfusion" (utiliser la formule gttes/min ou mL/h)
- 1 question "préparation de solution" (glucose %, dilution)
- 1 question "surface et matériaux" (m², cartons, prix au m²)
- 1 question "besoins quotidiens / approvisionnement" (eau par jour, matériel par semaine)
- 1 question "vérification de proportionnalité / contre-exemple" (la réponse doit être NON)
- 1 question bonus : échelle/plan OU proportionnalité avancée

Difficulté progressive : Q1-3 faciles, Q4-7 moyennes, Q8-10 complexes.
Inspire-toi des exemples RÉELS du concours fournis ci-dessus mais ne les recopie JAMAIS à l'identique.`;
