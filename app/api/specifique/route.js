import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const apiKey = process.env.GEMINI_API_KEY

let annalesBase64 = null
try {
  const pdfPath = join(process.cwd(), 'data', 'annales-maths.pdf')
  const pdfBuffer = readFileSync(pdfPath)
  annalesBase64 = pdfBuffer.toString('base64')
} catch (e) {
  console.error('Impossible de charger le PDF des annales maths:', e.message)
}

async function callGeminiWithPdf(prompt) {
  const parts = []
  if (annalesBase64) {
    parts.push({ inlineData: { mimeType: 'application/pdf', data: annalesBase64 } })
  }
  parts.push({ text: prompt })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 8000 }
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', response.status, errorText)
    throw new Error(`Erreur API Gemini (${response.status})`)
  }

  const data = await response.json()
  const allText = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || ''
  if (!allText) throw new Error('Réponse vide de Gemini')
  return allText.replace(/```json/g, '').replace(/```/g, '').trim()
}

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8000 }
      })
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Gemini API error:', response.status, errorText)
    throw new Error(`Erreur API Gemini (${response.status})`)
  }

  const data = await response.json()
  const allText = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || ''
  if (!allText) throw new Error('Réponse vide de Gemini')
  return allText.replace(/```json/g, '').replace(/```/g, '').trim()
}

const familleDescriptions = {
  operations: "Opérations décimales : additions, soustractions, multiplications et divisions de nombres décimaux. Opérations posées à effectuer sans calculatrice.",
  pourcentages: "Pourcentages et proportionnalité : calculer un pourcentage, une augmentation/diminution, un taux d'intérêt, un prix après remise. Problèmes concrets.",
  conversions: "Conversions d'unités : heures en minutes, kg en grammes, cm3 en mL, litres en hectolitres, m2 en cm2. Tableaux de conversion. Exercices de type 1h25 = ? min, 1735 kg = ? g.",
  equations: "Équations et problèmes : mise en équation d'un problème concret. Problèmes de logique (âges, répartitions, provisions). Calculs appliqués."
}

export async function POST(request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Gemini manquante.' }, { status: 500 })
    }

    const body = await request.json()
    const { action, famille, exercices, reponses } = body

    if (action === 'generer') {
      if (!famille || !familleDescriptions[famille]) {
        return NextResponse.json({ error: 'Famille non reconnue.' }, { status: 400 })
      }

      const prompt = `Tu es un professeur de mathématiques qui prépare des candidats au concours IFSI FPC (Formation Professionnelle Continue).

Le document PDF ci-joint contient des annales réelles du concours. Inspire-toi des exercices correspondant à cette famille.

FAMILLE DEMANDÉE : ${familleDescriptions[famille]}

Génère un entraînement ciblé sur cette famille uniquement :
- 5 à 6 questions progressives (du plus facile au plus difficile)
- Sans calculatrice
- Chaque question doit avoir une réponse numérique ou textuelle courte
- Les calculs doivent être faisables à la main
- Adapte au niveau aide-soignant / auxiliaire de puériculture
- Pour chaque question, prépare une explication détaillée étape par étape de la méthode de résolution

IMPORTANT : Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "famille": "${famille}",
  "titre": "Titre de l'exercice",
  "questions": [
    {
      "id": "1",
      "question": "La question précise",
      "points": 2,
      "reponse": "La réponse attendue",
      "explication": "Explication détaillée étape par étape de la résolution"
    }
  ]
}`

      const raw = await callGeminiWithPdf(prompt)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      const sujetData = JSON.parse(jsonMatch[0])
      return NextResponse.json({ sujet: sujetData })
    }

    if (action === 'corriger') {
      if (!exercices || !reponses) {
        return NextResponse.json({ error: 'Exercices et réponses requis.' }, { status: 400 })
      }

      const reponsesFormatted = Object.entries(reponses).map(([id, val]) => `- Question ${id} : "${val}"`).join('\n')

      const prompt = `Tu es un professeur de mathématiques bienveillant. Tu corriges les réponses d'un candidat au concours IFSI FPC.

EXERCICES :
${JSON.stringify(exercices, null, 2)}

RÉPONSES DU CANDIDAT :
${reponsesFormatted}

Pour CHAQUE question :
1. Indique si la réponse est correcte, partiellement correcte ou incorrecte
2. Donne l'explication DÉTAILLÉE étape par étape de la méthode de résolution (c'est le plus important, le candidat doit comprendre comment faire)
3. Attribue les points

Sois pédagogue et bienveillant. L'objectif est que le candidat PROGRESSE.

IMPORTANT : Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "note": 7,
  "noteMax": 10,
  "appreciation": "Appréciation générale en 2-3 phrases",
  "corrections": [
    {
      "id": "1",
      "question": "La question",
      "reponse_candidat": "Ce que le candidat a répondu",
      "reponse_attendue": "La bonne réponse",
      "correct": true ou false ou "partiel",
      "points_obtenus": 2,
      "points_max": 2,
      "explication": "Explication DÉTAILLÉE étape par étape de la méthode de résolution"
    }
  ],
  "conseil": "Un conseil personnalisé pour progresser sur cette famille d'exercices"
}`

      const raw = await callGemini(prompt)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      const correction = JSON.parse(jsonMatch[0])
      return NextResponse.json({ correction })
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
