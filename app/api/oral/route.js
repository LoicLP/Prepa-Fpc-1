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
      return NextResponse.json({ error: 'Clé API Gemini manquante. Vérifiez GEMINI_API_KEY dans Vercel.' }, { status: 500 })
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
                  text: `Tu es un membre du jury d'admission en IFSI (Institut de Formation en Soins Infirmiers) pour l'épreuve orale du concours FPC (Formation Professionnelle Continue).

VOICI LE CV / PARCOURS DU CANDIDAT (actuellement Aide-Soignant(e) ou Auxiliaire de Puériculture) :
Le document PDF ci-joint contient le CV du candidat.

MISSION :
Analyse attentivement ce document et génère EXACTEMENT 7 questions personnalisées que le jury posera lors de l'entretien oral de 20 minutes.
Adapte chaque question au contenu réel du CV. Sois précis en faisant référence aux postes, formations ou expériences spécifiques du candidat pour éviter les questions trop génériques.

RÉPARTITION OBLIGATOIRE DES QUESTIONS :

CATÉGORIE 1 - PARCOURS PROFESSIONNEL (3 questions) :
- Questions sur les expériences mentionnées dans le CV.
- Questions sur les compétences acquises.
- Questions sur les choix de carrière et les transitions.

CATÉGORIE 2 - MOTIVATION ET PROJET (2 questions) :
- Pourquoi vouloir devenir infirmier/infirmière (IDE).
- Ce qui a déclenché cette envie de reconversion.
- Le projet professionnel à moyen/long terme.

CATÉGORIE 3 - CONNAISSANCES DU MÉTIER IDE (2 questions) :
- Questions sur le rôle propre de l'infirmier vs l'aide-soignant / l'auxiliaire de puériculture.
- Questions sur l'éthique, la responsabilité, le cadre légal.
- Questions sur les réalités du métier (gardes, charge émotionnelle, travail en équipe, etc.).

FORMAT DE SORTIE :
Tu dois répondre UNIQUEMENT au format JSON strict, sans aucun texte avant ou après, en respectant cette structure. Pour le champ "tips", tu dois fournir les éléments de réponse pertinents que le jury s'attend à entendre.

{
  "questions": [
    {
      "id": 1,
      "category": "Parcours professionnel",
      "question": "La question précise et personnalisée posée par le jury",
      "tips": "Ce que le jury attend comme éléments de réponse (compétences à valoriser, pièges à éviter)"
    }
  ]
}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4000,
            responseMimeType: "application/json"
          }
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, errorText)
      return NextResponse.json({ error: `Erreur API Gemini (${response.status}). Vérifiez votre clé API.` }, { status: 500 })
    }

    const data = await response.json()
    
    // Gemini 2.5 avec thinking peut avoir plusieurs parts, on les combine
    const allText = data.candidates?.[0]?.content?.parts
      ?.map(p => p.text || '')
      .join('\n') || ''

    if (!allText) {
      console.error('Gemini empty response:', JSON.stringify(data))
      return NextResponse.json({ error: 'Réponse vide de Gemini. Réessayez.' }, { status: 500 })
    }

    const cleaned = allText.replace(/```json/g, '').replace(/```/g, '').trim()
    
    try {
      // Extraire le JSON (objet ou tableau)
      const jsonObjMatch = cleaned.match(/\{[\s\S]*\}/)
      const jsonArrMatch = cleaned.match(/\[[\s\S]*\]/)
      if (!jsonObjMatch && !jsonArrMatch) {
        console.error('No JSON found in:', cleaned.substring(0, 500))
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      let questions
      if (jsonObjMatch) {
        const parsed = JSON.parse(jsonObjMatch[0])
        questions = parsed.questions || parsed
      } else {
        questions = JSON.parse(jsonArrMatch[0])
      }
      // S'assurer que c'est un tableau
      if (!Array.isArray(questions)) questions = Object.values(questions)
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
