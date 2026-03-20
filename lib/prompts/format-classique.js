// lib/prompts/format-classique.js
// ============================================================
// SYSTEM INSTRUCTION — FORMAT 1 : SUJET CLASSIQUE (60% des sujets)
// Texte de 15 à 20 lignes + 2 ou 3 questions
// ============================================================

export const SYSTEM_CLASSIQUE = `
## FORMAT : SUJET CLASSIQUE (texte + questions)
C'est le format dominant au concours FPC (~60% des sujets au niveau national).
Le candidat reçoit un texte de 15 à 20 lignes issu de la presse (Le Monde, Le Point, L'Express, Marianne, Le Nouvel Observateur) ou d'un rapport de santé publique, suivi de 2 à 3 questions.

### STRUCTURE TYPE
1. Un texte de ~2 000 caractères (15-20 lignes) avec une source crédible
2. Le texte contient des données chiffrées, des arguments et souvent une phrase en gras à analyser
3. 2 à 3 questions progressives :
   - Q1 : compréhension / résumé (idées principales, explication d'un passage)
   - Q2 : analyse / argumentation (causes, conséquences, commentaire de la phrase en gras)
   - Q3 : positionnement professionnel ("En tant que futur professionnel de santé...")

### EXEMPLES RÉELS TIRÉS DES ANNALES

SUJET PARIS 2025 (rentrée sept. 2025) :
Texte sur la prévention de l'alcool chez les jeunes. Données : 41 000 décès/an, vulnérabilité du cerveau adolescent.
Q1: Expliquer pourquoi la prévention de la consommation d'alcool chez les jeunes est un enjeu sanitaire prioritaire.
Q2: Donner 4 exemples de conséquences de la consommation d'alcool chez les jeunes.
Q3: En tant que futur professionnel de santé, indiquez et argumentez 4 mesures pour réduire la consommation d'alcool chez les jeunes.

SUJET PACA/MARSEILLE 2024 :
Texte sur les conséquences du Covid sur les jeunes et les écrans. Données : troubles de l'attention, du sommeil, frein à l'empathie.
Q1: Résumez les idées principales du texte.
Q2: En tant que futur professionnel de santé, quels arguments donneriez-vous à des adolescents pour les encourager à moins utiliser les écrans ?

SUJET BRETAGNE 2024 :
Texte sur l'obésité infantile. Phrase en gras : "nos collégiens préparent leur infarctus à 30 ans". Données : surpoids 7-12 ans = +30% de risques cardiaques avant 35 ans.
Q1: Commentez la phrase en gras.
Q2: Citez 4 causes et 4 moyens de prévention.

SUJET 2024 — Les PUFF :
Texte sur la cigarette électronique jetable PUFF (format compact, 10€, 500-600 bouffées = 2 paquets).
Q1: Dégagez et argumentez les idées principales du texte.
Q2: En qualité de futur professionnel, quels arguments utiliseriez-vous pour sensibiliser un proche aux risques des PUFF ?

SUJET 2024 — Le sommeil :
Texte : "Améliorer un seul critère de qualité du sommeil parmi les 5 identifiés diminuerait de 20% les risques cardiovasculaires". Données : 65% des Français disent mal dormir (sondage Ipsos).
Questions d'analyse sur les 5 critères et le rôle de l'infirmier.

SUJET 2024 — Les aidants :
Texte : "On peut être aidant à tout âge. L'âge moyen d'entrée dans l'aidance c'est 37 ans." Données : 260 acteurs mobilisables, millefeuille administratif.
Q1: Citez les difficultés des aidants en vous aidant du texte.
Q2: En tant que future infirmière, qu'est-ce qu'on peut mettre en place pour aider les aidants (citez en 3) ?

SUJET 2024 — Outils de communication :
Texte : "Les outils de communication sont nombreux. Il semblerait que nous avons des difficultés à les gérer."
Q1: Comment expliquez-vous ce paradoxe ?
Q2: Quelles sont les conséquences ?
Q3: Quelles sont les solutions ?
Q4: Qu'est-ce que cela apporte à la profession d'infirmière ?

SUJET 2024 — Infirmier scolaire (mise en situation) :
Texte : "Vous êtes infirmier en internat au lycée Marie Curie. Tom est prostré sur son lit, sa copine vient de le quitter."
Q1: Signes du mal-être chez l'adolescent.
Q2: Comment évalue-t-on le risque suicidaire ?
Q3: Prise en charge si pas de risque avéré ?
Q4: Actions de prévention au lycée.

SUJET 2025 — L'alcool en France :
Texte : "Ancré dans les habitudes, festif, convivial... l'alcool continue de bénéficier de représentations favorables. 20% des Français pensent que l'alcool est bon pour la santé."
Q1: Développez et argumentez sur les raisons de la consommation d'alcool.
Q2: Citez les différents moyens de prévention.

### CARACTÉRISTIQUES DU TEXTE À GÉNÉRER
- Longueur : 150 à 250 mots (15-20 lignes imprimées)
- Registre : journalistique / informatif, niveau première
- Doit contenir AU MOINS 2 données chiffrées (pourcentages, nombres, dates)
- Doit contenir une phrase qui se prête au commentaire (éventuellement en gras)
- Doit présenter un enjeu de santé publique ou social clair
- Source fictive mais crédible (Le Monde, Santé Publique France, OMS, INSERM, etc.)
`;

export const PROMPT_CLASSIQUE = `Génère un sujet de rédaction au FORMAT CLASSIQUE pour le concours FPC.

Le sujet doit contenir :
1. Un TEXTE de 150-250 mots (15-20 lignes), style journalistique, niveau première, avec au moins 2 données chiffrées et une phrase forte à commenter
2. Une SOURCE fictive crédible (Le Monde, Santé Publique France, INSERM, OMS...)
3. Exactement 3 QUESTIONS progressives :
   - Q1 : compréhension/résumé (résumer les idées, expliquer un passage, proposer un titre)
   - Q2 : analyse (commenter la phrase en gras, citer causes/conséquences/moyens de prévention)
   - Q3 : "En tant que futur professionnel de santé..." (positionnement, arguments, mesures)
4. Pour chaque question : les POINTS CLÉS attendus dans la correction (3 à 5 points)
5. Un barème indicatif (ex: Q1 = 3 pts, Q2 = 3 pts, Q3 = 4 pts, total = 10)

Choisis un thème parmi les 20 thématiques récurrentes du concours.
Le sujet doit être réalisable en 30 minutes.
Inspire-toi des sujets RÉELS fournis ci-dessus mais ne recopie JAMAIS un sujet existant.`;
