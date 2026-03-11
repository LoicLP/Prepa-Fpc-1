import { NextResponse } from 'next/server'

const apiKey = process.env.GEMINI_API_KEY

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
  const allText = data.candidates?.[0]?.content?.parts
    ?.map(p => p.text || '')
    .join('\n') || ''

  if (!allText) throw new Error('Réponse vide de Gemini')
  return allText.replace(/```json/g, '').replace(/```/g, '').trim()
}

export async function POST(request) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API Gemini manquante.' }, { status: 500 })
    }

    const body = await request.json()
    const { action, sujet, redaction } = body

    // === GÉNÉRER UN SUJET ===
    if (action === 'generer') {
      const prompt = `Tu es un examinateur du concours IFSI FPC (Formation Professionnelle Continue) pour l'épreuve écrite.

Génère un sujet d'épreuve écrite original et réaliste, du niveau de ce concours. Le sujet doit être adapté à des aides-soignants ou auxiliaires de puériculture qui veulent devenir infirmiers.

Le sujet peut être de l'un de ces types (choisis-en un au hasard) :
- Analyse de texte : un texte d'environ 200-300 mots sur un thème sanitaire ou social, suivi de 2-3 questions d'analyse et de réflexion personnelle
- Dissertation/réflexion : un sujet de réflexion argumentée sur un thème lié à la santé, l'éthique soignante, le système de santé, la relation patient-soignant
- Résumé et commentaire : un texte à résumer puis à commenter avec un avis personnel argumenté

Thèmes possibles : éthique soignante, bientraitance, fin de vie, relation soignant-soigné, travail en équipe, secret professionnel, éducation thérapeutique, santé publique, vieillissement, handicap, droits des patients, burn-out des soignants, télémédecine, déserts médicaux.

IMPORTANT : Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "type": "analyse" ou "dissertation" ou "resume",
  "titre": "Titre court du sujet",
  "texte": "Le texte source si analyse ou résumé (null si dissertation)",
  "consigne": "La consigne complète et détaillée pour le candidat",
  "bareme": "Indication du barème (ex: argumentation 8pts, orthographe 4pts, etc.)"
}`

      const raw = await callGemini(prompt)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      const sujetData = JSON.parse(jsonMatch[0])
      return NextResponse.json({ sujet: sujetData })
    }

    // === CORRIGER UNE RÉDACTION ===
    if (action === 'corriger') {
      if (!sujet || !redaction) {
        return NextResponse.json({ error: 'Sujet et rédaction requis.' }, { status: 400 })
      }

      const prompt = `Tu es un correcteur du concours IFSI FPC. Tu dois corriger la copie d'un candidat de manière détaillée et bienveillante.

SUJET :
Type : ${sujet.type}
Titre : ${sujet.titre}
${sujet.texte ? `Texte : ${sujet.texte}` : ''}
Consigne : ${sujet.consigne}
Barème : ${sujet.bareme}

COPIE DU CANDIDAT :
${redaction}

Corrige cette copie en analysant :
1. La compréhension du sujet et la pertinence des arguments
2. La structure et l'organisation (introduction, développement, conclusion)
3. La qualité de l'expression écrite (syntaxe, vocabulaire, style)
4. L'orthographe et la grammaire (liste les fautes trouvées)
5. La connaissance du domaine sanitaire et social

IMPORTANT : Réponds UNIQUEMENT en JSON valide avec cette structure :
{
  "note": 14,
  "noteMax": 20,
  "appreciation": "Appréciation générale en 2-3 phrases",
  "points_forts": ["point fort 1", "point fort 2", "..."],
  "points_ameliorer": ["point à améliorer 1", "point à améliorer 2", "..."],
  "fautes": [
    { "original": "le mot ou passage fautif", "correction": "la correction", "type": "orthographe/grammaire/syntaxe/conjugaison" }
  ],
  "conseil": "Un conseil personnalisé pour progresser"
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
