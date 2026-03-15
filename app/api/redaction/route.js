import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

const apiKey = process.env.GEMINI_API_KEY

// Charger le PDF des annales au démarrage
let annalesBase64 = null
try {
  const pdfPath = join(process.cwd(), 'data', 'annales-redaction.pdf')
  const pdfBuffer = readFileSync(pdfPath)
  annalesBase64 = pdfBuffer.toString('base64')
} catch (e) {
  console.error('Impossible de charger le PDF des annales:', e.message)
}

async function callGeminiWithPdf(prompt) {
  const parts = []

  if (annalesBase64) {
    parts.push({
      inlineData: {
        mimeType: 'application/pdf',
        data: annalesBase64
      }
    })
  }

  parts.push({ text: prompt })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 8000, responseMimeType: "application/json" }
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

async function callGemini(prompt) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8000, responseMimeType: "application/json" }
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
      // Choix côté serveur : 1/4 annale, 3/4 original
      const useAnnale = Math.random() < 0.25
      // 2 fois sur 5 : forcer une dissertation
      const forceDissertation = Math.random() < 0.4
      const formatInstruction = forceDissertation
        ? 'OBLIGATOIREMENT UNE DISSERTATION COURTE (réflexion argumentée, pas de questions).'
        : '2 à 3 questions d\'analyse ou une dissertation courte.'

      const promptAnnale = `Tu es un examinateur du concours IFSI FPC (Formation Professionnelle Continue) pour l'épreuve écrite de sous-admissibilité (rédaction/analyse).

Le document PDF ci-joint contient des annales réelles. Tu dois t'en servir comme base exclusive.

MISSION :
Reprends un sujet tel quel ou très proche d'un sujet présent dans les annales du PDF. Reproduis fidèlement le texte source et les consignes.

RÈGLES IMPORTANTES :
- Public cible : Aides-soignants (AS) ou auxiliaires de puériculture (AP) souhaitant devenir infirmiers (IDE).
- Temps imparti : 30 MINUTES.
- Format attendu : ${formatInstruction}
- Texte source : Compris entre 150 et 300 mots.
- La note maximale du sujet est de 10 points (PAS sur 20).

FORMAT DE SORTIE :
Tu dois répondre UNIQUEMENT au format JSON strict en respectant cette structure :

{
  "type": "dissertation ou questions",
  "titre": "Titre du sujet (ex: Annale 2024 - Titre du texte)",
  "source": "annale",
  "annee": "Année d'origine",
  "texte": "Le texte source intégral à analyser (150 à 300 mots)",
  "consigne": "Les questions posées ou le sujet de la dissertation",
  "bareme": "Explication brève de la répartition des 10 points"
}`

      const promptOriginal = `Tu es un examinateur du concours IFSI FPC (Formation Professionnelle Continue) pour l'épreuve écrite de sous-admissibilité (rédaction/analyse).

Le document PDF ci-joint contient des annales réelles. Tu dois t'en servir comme modèle pour comprendre les thèmes (santé publique, éthique, rôle soignant), le format et le niveau attendus.

MISSION :
Crée un sujet ORIGINAL et INÉDIT en t'inspirant fortement des thèmes et du style des annales du PDF. Le sujet doit être réaliste et pertinent pour le concours.

RÈGLES IMPORTANTES :
- Public cible : Aides-soignants (AS) ou auxiliaires de puériculture (AP) souhaitant devenir infirmiers (IDE). Le jury évalue l'analyse, l'argumentation et la capacité à se projeter dans le rôle de l'IDE.
- Temps imparti : 30 MINUTES.
- Format attendu : ${formatInstruction}
- Texte source : Rédige ou adapte un texte source pertinent, compris entre 150 et 300 mots.
- La note maximale du sujet est de 10 points (PAS sur 20).

FORMAT DE SORTIE :
Tu dois répondre UNIQUEMENT au format JSON strict en respectant cette structure :

{
  "type": "dissertation ou questions",
  "titre": "Titre du sujet original",
  "source": "original",
  "annee": null,
  "texte": "Le texte source inédit à analyser (150 à 300 mots)",
  "consigne": "Les questions posées ou le sujet de la dissertation",
  "bareme": "Explication brève de la répartition des 10 points"
}`

      const prompt = useAnnale ? promptAnnale : promptOriginal
      const raw = await callGeminiWithPdf(prompt)
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

      const prompt = `Tu es un correcteur du concours IFSI FPC pour l'épreuve écrite de sous-admissibilité.
Tu dois corriger la copie d'un candidat (aide-soignant ou auxiliaire de puériculture) de manière détaillée, exigeante mais bienveillante. Le candidat disposait de 30 minutes.

VOICI LE SUJET (au format JSON) :
${JSON.stringify(sujet, null, 2)}

VOICI LA COPIE DU CANDIDAT :
${redaction}

MISSION D'ÉVALUATION (sur 10 points) :
Analyse la copie en te basant sur ces critères précis :
1. Qualités rédactionnelles et structure (introduction, développement, conclusion).
2. Pertinence du questionnement, de l'analyse et de l'argumentation face au texte.
3. Capacité de projection dans le rôle et les responsabilités du futur métier d'infirmier (IDE).

MISSION ORTHOGRAPHE (Pénalité) :
Repère TOUTES les fautes d'orthographe, de grammaire et de conjugaison.
Règle stricte : Chaque faute entraîne un retrait de 0.25 point sur la note finale.

FORMAT DE SORTIE :
Tu dois répondre UNIQUEMENT au format JSON strict, sans aucun texte avant ou après, en respectant cette structure :

{
  "note_fond": 8.5,
  "note_fond_max": 10,
  "fautes": [
    { "original": "mot avec erreur", "correction": "mot corrigé", "type": "orthographe/grammaire" }
  ],
  "penalite_orthographe": -0.5,
  "note_finale": 8.0,
  "noteMax": 10,
  "appreciation": "Appréciation globale sur la réflexion et la rédaction",
  "points_forts": ["Point fort 1", "Point fort 2"],
  "points_ameliorer": ["Axe d'amélioration 1", "Axe d'amélioration 2"],
  "conseil": "Un conseil pratique et encourageant pour progresser"
}`

      const raw = await callGemini(prompt)
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      const correction = JSON.parse(jsonMatch[0])
      // Recalculer la note finale côté serveur pour être sûr
      const nbFautes = correction.fautes?.length || 0
      const penalite = nbFautes * 0.25
      const noteFond = correction.note_fond ?? correction.note_finale ?? 10
      correction.penalite_orthographe = -penalite
      correction.note_finale = Math.max(0, Math.round((noteFond - penalite) * 10) / 10)
      correction.noteMax = 10
      // Compatibilité avec le front qui utilise correction.note
      correction.note = correction.note_finale
      return NextResponse.json({ correction })
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
