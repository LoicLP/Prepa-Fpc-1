---
name: Réfléchir avant d'agir
description: Prendre le temps de vérifier les impacts avant chaque modification, éviter les erreurs en cascade
type: feedback
---

Réfléchir davantage avant de faire des modifications. Trop d'erreurs évitables récemment.

**Why:** Plusieurs erreurs en cascade : oublier le champ `views` en optimisant la requête blog, casser le QCM avec une variable non définie, etc. L'utilisateur est frustré par ces allers-retours.

**How to apply:** Avant chaque modification, se poser : "qu'est-ce que ça va casser ?", "quels fichiers référencent ce que je modifie ?", "est-ce que je retire quelque chose qui est utilisé ailleurs ?". Vérifier les impacts avant de commit.
