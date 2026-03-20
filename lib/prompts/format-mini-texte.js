// lib/prompts/format-mini-texte.js
// ============================================================
// SYSTEM INSTRUCTION — FORMAT 2 : MINI-TEXTE (25% des sujets)
// Court extrait de 3 à 5 lignes + plusieurs questions directives courtes
// ============================================================

export const SYSTEM_MINI_TEXTE = `
## FORMAT : MINI-TEXTE (extrait court + questions directives)
Représente ~25% des sujets. En augmentation depuis 2023, surtout à Paris et en PACA.
Le candidat reçoit un court extrait (3 à 5 lignes, ~50-80 mots) suivi de 3 à 5 questions directives courtes.

### STRUCTURE TYPE
1. Un extrait très court (3-5 lignes / 50-80 mots) avec une donnée forte ou une citation
2. 3 à 5 questions directives, courtes et ciblées
3. Les questions sont plus factuelles que dans le format classique
4. On attend des réponses concises, directes, ordonnées — PAS une dissertation

### EXEMPLES RÉELS TIRÉS DES ANNALES

SUJET PARIS 2024 — Le cancer :
Extrait : "40% des cancers sont liés à nos habitudes de vie et à notre environnement et pourraient être évités."
Q1: Citez 4 facteurs de risques ou comportements à risques évitables du cancer.
Q2: Expliquez ce qui peut être conseillé en tant que futur professionnel de santé pour limiter ces risques.
(4 questions directives courtes au total)

SUJET 2024 — Mobilier urbain adapté :
Extrait : "Le choix des bancs publics ne s'effectue pas seulement sur des critères esthétiques. Depuis 2015, cette commune s'est dotée de bancs adaptés pour faciliter les déplacements des personnes âgées. Objectif : lutter contre la sédentarité et l'isolement social."
Q1: Que signifie "sédentarité" ?
Q2: Quels sont les objectifs de ce mobilier adapté ?
Q3: En tant que futur professionnel, quelles actions proposeriez-vous pour lutter contre l'isolement des personnes âgées ?

SUJET 2024 — Les médicaments contre l'obésité :
Extrait court sur les nouveaux médicaments contre l'obésité.
Q1: Pourquoi certains craignent ces médicaments ?
Q2: Pourquoi les professionnels disent que ce ne sont pas des médicaments miracles ?

SUJET 2024 — Espaces verts :
Extrait : "Assurer un espace vert à moins de 10 min à pied."
Q1: Qu'est-ce que l'indice de bien-être ?
Q2: Que signifie "aseptisé" dans ce contexte ?
Q3: Que pensez-vous de la végétalisation des villes ?

SUJET 2025 — Alcool et représentations :
Extrait : "20% des Français pensent que l'alcool est bon pour la santé."
Q1: Développez et argumentez sur les raisons de la consommation d'alcool.
Q2: Citez les différents moyens de prévention.

SUJET 2024 — Obligations infirmier Éducation Nationale :
Extrait sur le rôle de l'infirmier scolaire.
Q1: Quelles sont vos obligations professionnelles en qualité d'agent de la fonction publique (citez en 5) ?
Q2: Présentez la liste des vaccins obligatoires.
Q3: Citez 5 maladies à déclaration obligatoire.

### TYPES DE QUESTIONS SPÉCIFIQUES AU MINI-TEXTE
Ce format privilégie :
- Questions de VOCABULAIRE : "Que signifie [mot] ?" / "Donnez un synonyme de [mot]"
- Questions de LISTES : "Citez X causes / facteurs / moyens / conséquences"
- Questions de DÉFINITION : "Qu'est-ce que [concept] ?"
- Questions de POSITIONNEMENT court : "En tant que futur professionnel, que proposeriez-vous ?"

### CARACTÉRISTIQUES DE L'EXTRAIT À GÉNÉRER
- Longueur : 50 à 80 mots (3 à 5 lignes)
- Doit contenir une donnée chiffrée frappante OU une citation forte
- Registre : extrait de presse ou rapport officiel
- Source fictive crédible
`;

export const PROMPT_MINI_TEXTE = `Génère un sujet de rédaction au FORMAT MINI-TEXTE pour le concours FPC.

Le sujet doit contenir :
1. Un EXTRAIT court de 50-80 mots (3-5 lignes), avec une donnée chiffrée frappante ou une citation forte
2. Une SOURCE fictive crédible
3. Exactement 4 QUESTIONS directives courtes et ciblées :
   - Q1 : vocabulaire ou compréhension ("Que signifie..." / "Définissez...")
   - Q2 : liste factuelle ("Citez X causes / facteurs / conséquences")
   - Q3 : analyse courte ("Pourquoi... ?" / "Comment expliquez-vous... ?")
   - Q4 : positionnement professionnel court ("En tant que futur professionnel de santé...")
4. Pour chaque question : les POINTS CLÉS attendus (3 à 5 points)
5. Barème indicatif (total = 10 points)

Choisis un thème parmi les 20 thématiques récurrentes du concours.
Les réponses attendues doivent être concises et directes (pas de dissertation).
Inspire-toi des sujets RÉELS fournis ci-dessus mais ne recopie JAMAIS un sujet existant.`;
