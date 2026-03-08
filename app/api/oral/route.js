import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('pdf')

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API manquante. Vérifiez dans Vercel.' }, { status: 500 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: base64
                  }
                },
                {
                  text: `Tu es un membre expérimenté et bienveillant du jury d'admission en IFSI (Institut de Formation en Soins Infirmiers) pour l'épreuve orale du concours FPC (Formation Professionnelle Continue).

CONTEXTE :
Tu vas recevoir le CV et/ou le parcours professionnel d'un candidat actuellement Aide-Soignant(e) ou Auxiliaire de Puériculture, délimité par les balises <cv> et </cv>.

MISSION :
Analyse attentivement ce document et génère exactement 10 questions personnalisées que le jury posera lors de l'entretien de 20 minutes. Adapte chaque question au contenu réel du CV (fais référence à ses postes spécifiques, ses services, ses années d'expérience).

CONTRAINTES DE CONTENU :
Les questions doivent être réparties exactement selon ces 3 catégories :

1. CATÉGORIE "Parcours professionnel" (Exactement 4 questions) :
- Expériences mentionnées dans le CV.
- Compétences acquises sur le terrain.
- Choix de carrière, transitions et évolution.

2. CATÉGORIE "Motivation et projet" (Exactement 3 questions) :
- Raisons profondes de la volonté de devenir infirmier/infirmière.
- Le déclencheur de cette reconversion FPC.
- Le projet professionnel à moyen/long terme.

3. CATÉGORIE "Connaissances du métier IDE" (Exactement 3 questions) :
- Différence entre le rôle propre de l'infirmier et celui de l'AS/AP.
- Éthique, responsabilité et cadre légal.
- Réalités du métier (gestion de la charge de travail, charge émotionnelle, horaires).

CONTRAINTES DE FORMAT (STRICT) :
Tu dois répondre UNIQUEMENT en JSON valide. N'inclus aucun texte avant ou après. N'utilise PAS de blocs de code markdown (pas de ```json).
Le JSON doit être un tableau d'objets respectant scrupuleusement cette structure :
[
  {
    "id": 1,
    "category": "Nom de la catégorie",
    "question": "La question personnalisée ici",
    "tips": "Un conseil court et actionnable pour bien répondre"
  }
] `
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return NextResponse.json({ error: `Erreur API  (${response.status}). Contactez l'adminsitrateur du site .` }, { status: 500 })
    }

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Gemini empty response:', JSON.stringify(data))
      return NextResponse.json({ error: 'Erreur. Réessayez.' }, { status: 500 })
    }

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()

    try {
      const questions = JSON.parse(cleaned)
      return NextResponse.json({ questions })
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw:', cleaned.substring(0, 500))
      return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
