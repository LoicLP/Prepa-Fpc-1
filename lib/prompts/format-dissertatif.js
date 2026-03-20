// lib/prompts/format-dissertatif.js
// ============================================================
// SYSTEM INSTRUCTION — FORMAT 3 : DISSERTATIF (15% des sujets)
// Question ouverte unique, sans texte d'appui
// Très présent en Nouvelle-Aquitaine
// ============================================================

export const SYSTEM_DISSERTATIF = `
## FORMAT : DISSERTATIF (question ouverte sans texte)
Représente ~15% des sujets. Très présent en Nouvelle-Aquitaine.
Le candidat reçoit uniquement une question ouverte ou une citation à commenter, SANS texte d'appui.
C'est le format le plus exigeant car le candidat doit mobiliser ses propres connaissances.

### STRUCTURE TYPE
1. Une question ouverte unique OU une courte citation suivie de "Commentez" / "Qu'en pensez-vous ?"
2. Parfois accompagnée d'une sous-question orientant vers le métier d'infirmier
3. Le candidat doit structurer sa réponse comme une mini-dissertation (intro, développement, conclusion)
4. Durée : 30 minutes — la réponse fait en général 20 à 30 lignes manuscrites

### SOUS-TYPES IDENTIFIÉS

#### A) Question ouverte directe
Une seule question, souvent liée à un enjeu de santé publique.
EXEMPLES RÉELS :
- "Le travail, c'est la santé." Expliquez. (Sujet 2024, repris des annales 2005)
- "Le téléphone mobile devient-il un problème sanitaire ?" (Sujet 2023)
- "Les seniors au volant : jusqu'à quand peut-on conduire ? Commentez." (Sujet 2024)
- "Quels sont les inconvénients liés au fait de se connecter sur les réseaux sociaux ?" (Sujet 2024)
- "Que diriez-vous à des jeunes afin qu'ils consomment des fruits et légumes ?" (Sujet 2025)
- "Citez les principales sources de pollution. Donnez des actions réalisables par chaque citoyen." (Sujet 2024)

#### B) Citation / proverbe à commenter
Une phrase ou citation, suivie de "Qu'en pensez-vous ?" souvent rattaché au métier d'infirmier.
EXEMPLES RÉELS :
- "Commentez le proverbe africain : 'Seul on va plus vite, ensemble on va plus loin.' Qu'en pensez-vous du point de vue de votre futur métier d'infirmière ?" (Sujet 2023, Nouvelle-Aquitaine)
- "'Chercher à nettoyer les océans est extrêmement difficile et cher, et il est bien moins coûteux et efficace d'agir en amont.' Quelles solutions seraient efficaces ? Argumentez." (Sujet 2023, Nouvelle-Aquitaine)
- "Le sommeil est le meilleur ami de notre santé." Argumentez. (Sujet récent)
- "Dry January : Faire une pause dans sa consommation d'alcool permet de gagner du capital santé." Discutez. (Sujet récent)

#### C) Question avec positionnement professionnel explicite
La question demande directement le point de vue du futur soignant.
EXEMPLES RÉELS :
- "Après l'épisode du COVID, les jeunes se tournent de moins en moins vers le métier d'infirmier. Comment expliquez-vous cela ?" (Sujet 2025)
- "Les jeux paralympiques ont donné une autre image du handicap. Qu'en pensez-vous ?" (Sujet 2025)
- "Le suicide en France est un problème majeur de santé publique. Il faut en parler afin de réduire les préjugés. Qu'en pensez-vous du point de vue de votre futur métier ?" (Sujet 2024)
- "Les maladies cardio-vasculaires sont la première cause de mortalité en France. Quels en sont les facteurs ? Argumentez et donnez les moyens pour y remédier." (Sujet 2023)
- "En tant que futur soignant, quels arguments utiliseriez-vous pour sensibiliser un proche aux risques des PUFF ?" (Sujet 2024)
- "En tant que futur soignant, quels arguments donneriez-vous à un jeune public pour l'encourager à moins utiliser les écrans ?" (Sujet 2024)
- "Les outils de communication sont nombreux. Nous avons des difficultés à les gérer. Comment expliquez-vous cette situation ?" (Sujet 2024)

#### D) Question type mise en situation professionnelle (rare en dissertatif)
EXEMPLES RÉELS :
- "Vous êtes infirmier/infirmière de l'éducation nationale. Quelles sont vos obligations professionnelles en qualité d'agent de la fonction publique d'état (citez en 5) ?" (Sujet 2024)

### CARACTÉRISTIQUES DE LA QUESTION À GÉNÉRER
- Doit être formulée de manière claire, en 1 à 3 phrases max
- Si citation : source fictive crédible ou proverbe connu
- Doit permettre une réponse structurée en 20-30 lignes
- Doit se rattacher à un enjeu sanitaire et/ou social identifiable
- Doit permettre au candidat de mobiliser des connaissances ET un positionnement personnel
`;

export const PROMPT_DISSERTATIF = `Génère un sujet de rédaction au FORMAT DISSERTATIF pour le concours FPC.

Le sujet doit contenir :
1. UNE question ouverte OU une citation à commenter (1 à 3 phrases max)
2. Si citation : une source fictive crédible ou un proverbe/auteur connu
3. Éventuellement une sous-question qui oriente vers le métier d'infirmier ("Qu'en pensez-vous du point de vue de votre futur métier ?")
4. Les POINTS CLÉS attendus dans la correction (5 à 8 points couvrant intro, arguments, exemples, positionnement pro, conclusion)
5. Un barème indicatif sur 10 points (ex: introduction 1pt, argumentation 4pts, positionnement professionnel 3pts, expression/orthographe 2pts)

Choisis parmi les 3 sous-types :
- Question ouverte directe (type "Le téléphone mobile est-il un problème sanitaire ?")
- Citation/proverbe à commenter (type "Seul on va plus vite, ensemble on va plus loin")
- Question avec positionnement professionnel (type "En tant que futur soignant...")

Choisis un thème parmi les 20 thématiques récurrentes du concours.
Le sujet doit être réalisable en 30 minutes (réponse de 20-30 lignes manuscrites).
Inspire-toi des sujets RÉELS fournis ci-dessus mais ne recopie JAMAIS un sujet existant.`;
