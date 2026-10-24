import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { BASE_SYSTEM, buildHistoryContext } from '@/lib/prompts/base-maths'
import { SYSTEM_EXAMEN_MATHS, buildPromptExamenMaths } from '@/lib/prompts/examen-maths'
import { buildBriefExamen } from '@/lib/prompts/variation-maths'
import { checkRateLimit } from '@/lib/rate-limit'
import { verifierAccesExercices } from '@/lib/acces'
import { callClaude, callClaudeWithPDF } from '@/lib/anthropic'

let annalesBase64 = null
try {
  const pdfPath = join(process.cwd(), 'data', 'annales-maths.pdf')
  const pdfBuffer = readFileSync(pdfPath)
  annalesBase64 = pdfBuffer.toString('base64')
} catch (e) {
  console.error('Impossible de charger le PDF des annales maths:', e.message)
}

export async function POST(request) {
  try {
    // Rate limiting par IP
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 })
    // Compte connecté avec essai ou abonnement valide, vérifié ici et pas seulement dans la page
    const acces = await verifierAccesExercices(request)
    if (acces.erreur) return acces.erreur
    if (!checkRateLimit('compte:' + acces.user.id)) return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Clé API manquante.' }, { status: 500 })
    }

    const body = await request.json()
    const { action, exercices, reponses, history, recent } = body

    // === GÉNÉRER UN SUJET ===
    if (action === 'generer') {
      const historyContext = buildHistoryContext(history)
      const systemInstruction = BASE_SYSTEM + '\n\n' + SYSTEM_EXAMEN_MATHS + (historyContext ? '\n\n' + historyContext : '')

      // Brief tiré au sort : sous-types, contextes, prénoms et NOMBRES imposés (réponses calculées côté serveur).
      // `recent` = sous-types/contextes des derniers sujets du candidat, pour ne pas retomber dessus.
      const brief = buildBriefExamen(recent)
      const userPrompt = buildPromptExamenMaths(brief.text)

      let text
      if (annalesBase64) {
        text = await callClaudeWithPDF(systemInstruction, userPrompt, annalesBase64, { temperature: 0.95, maxTokens: 12000 })
      } else {
        text = await callClaude(systemInstruction, userPrompt, { temperature: 0.95, maxTokens: 12000 })
      }

      let raw
      try {
        raw = JSON.parse(text)
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) return NextResponse.json({ error: 'Erreur de format.' }, { status: 500 })
        raw = JSON.parse(jsonMatch[0])
      }

      // Mapper vers le format attendu par le front (numero→id, enonce→question)
      const sujetData = {
        source: raw.type === 'examen_blanc' ? 'original' : (raw.source || 'original'),
        titre: raw.theme || 'Épreuve de Mathématiques',
        annee: null,
        ville: null,
        duree: '30 minutes',
        calculatrice: false,
        noteMax: raw.total_points || 10,
        exercices: (raw.exercices || []).map((ex, idx) => ({
          numero: ex.numero || idx + 1,
          titre: ex.titre || `Exercice ${idx + 1}`,
          enonce: ex.consigne || ex.enonce || '',
          categorie: ex.questions?.[0]?.famille || 'operations',
          points: ex.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0,
          questions: (ex.questions || []).map((q, qIdx) => ({
            id: q.numero || `${idx + 1}${String.fromCharCode(97 + qIdx)}`,
            question: q.enonce || q.question || '',
            points: q.points || 0,
            reponse: q.reponse || ''
          }))
        }))
      }

      // Barème ramené à 10 points : le modèle ne respecte pas toujours le total demandé (12 ou 15 points
      // pour un sujet « sur 10 »), ce qui donnait des notes au-dessus de 10/10 à la correction.
      // Points au quart de point ; l'écart d'arrondi est réparti par quarts de point en partant de la fin.
      const questions = sujetData.exercices.flatMap(ex => ex.questions)
      if (questions.length) {
        const somme = questions.reduce((s, q) => s + (Number(q.points) || 0), 0)
        questions.forEach(q => { q.points = Math.max(0.25, somme > 0 ? Math.round((Number(q.points) || 0) * 10 / somme * 4) / 4 : Math.round(10 / questions.length * 4) / 4) })
        let quarts = Math.round((10 - questions.reduce((s, q) => s + q.points, 0)) * 4)
        for (let n = 0; quarts !== 0 && n < questions.length * 40; n++) {
          const q = questions[questions.length - 1 - (n % questions.length)]
          const pas = quarts > 0 ? 0.25 : -0.25
          if (q.points + pas > 0) { q.points += pas; quarts -= Math.sign(quarts) }
        }
        sujetData.exercices.forEach(ex => { ex.points = ex.questions.reduce((s, q) => s + q.points, 0) })
      }
      sujetData.noteMax = 10

      return NextResponse.json({ sujet: sujetData, brief: brief.meta })
    }

    // === CORRIGER LES RÉPONSES ===
    if (action === 'corriger') {
      if (!exercices || !reponses) {
        return NextResponse.json({ error: 'Exercices et réponses requis.' }, { status: 400 })
      }

      const reponsesFormatted = Object.entries(reponses).map(([id, val]) => `- Question ${id} : "${val}"`).join('\n')

      const systemInstruction = `Tu es un correcteur du concours IFSI FPC pour l'épreuve de mathématiques.
Tu dois corriger les réponses d'un candidat de manière détaillée, juste et bienveillante.
Rappel du contexte : le candidat disposait de 30 minutes, sans calculatrice.`

      const userPrompt = `VOICI LE SUJET ET LE BARÈME (au format JSON) :
${JSON.stringify(exercices, null, 2)}

VOICI LES RÉPONSES DU CANDIDAT :
${reponsesFormatted}

MISSION :
Corrige chaque réponse en :
1. Comparant avec la réponse attendue.
2. Expliquant la méthode de résolution étape par étape de manière pédagogique.
3. Attribuant les points avec justesse. Valorise les méthodes correctes même si le résultat final est faux en accordant des points partiels.
4. Rédigeant un bilan constructif (points forts, points à améliorer, conseil).

RÈGLE IMPORTANTE POUR "reponse_attendue" :
- Si la réponse du candidat est CORRECTE : mets simplement le résultat final (ex: "15 ml").
- Si la réponse du candidat est INCORRECTE ou PARTIELLE : mets le détail des calculs menant au résultat (ex: "1500 / 500 × 5 = 15 ml").

FORMAT DE SORTIE :
Tu dois répondre UNIQUEMENT au format JSON strict :

{
  "note": 7.5,
  "noteMax": 10,
  "appreciation": "Appréciation globale bienveillante sur le travail fourni",
  "corrections": [
    {
      "id": "1a",
      "question": "Rappel de la question",
      "reponse_candidat": "Ce qu'a répondu le candidat",
      "reponse_attendue": "La vraie réponse attendue",
      "correct": "true, false, ou partiel",
      "points_obtenus": 1.5,
      "points_max": 1.5,
      "explication": "Explication pédagogique de la correction"
    }
  ],
  "points_forts": ["Point fort 1", "Point fort 2"],
  "points_ameliorer": ["Axe d'amélioration 1", "Axe d'amélioration 2"],
  "conseil": "Un conseil pratique pour le concours"
}`

      const raw = await callClaude(systemInstruction, userPrompt, { temperature: 0.7, maxTokens: 8000 })
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        return NextResponse.json({ error: 'Erreur de format. Réessayez.' }, { status: 500 })
      }
      const correction = JSON.parse(jsonMatch[0])
      correction.appreciation = correction.appreciation || ''
      correction.points_forts = Array.isArray(correction.points_forts) ? correction.points_forts : []
      correction.points_ameliorer = Array.isArray(correction.points_ameliorer) ? correction.points_ameliorer : []
      correction.conseil = correction.conseil || ''

      // Points de chaque question bornés par le barème du sujet (et non par celui que le modèle réécrit)
      const bareme = new Map()
      for (const ex of exercices) for (const q of ex.questions || []) bareme.set(String(q.id), Number(q.points) || 0)
      const vues = new Set()
      correction.corrections = (correction.corrections || []).map(c => {
        const pointsMax = bareme.get(String(c.id)) ?? (typeof c.points_max === 'number' ? c.points_max : 0)
        const obtenus = typeof c.points_obtenus === 'number' ? c.points_obtenus : 0
        return {
          id: c.id || '',
          question: c.question || '',
          reponse_candidat: c.reponse_candidat || '',
          reponse_attendue: c.reponse_attendue || '',
          correct: c.correct === true || c.correct === 'true' ? true : c.correct === 'partiel' ? 'partiel' : false,
          points_obtenus: Math.min(pointsMax, Math.max(0, obtenus)),
          points_max: pointsMax,
          explication: c.explication || ''
        }
      }).filter(c => { const cle = String(c.id); if (vues.has(cle)) return false; vues.add(cle); return true })

      // Note calculée ici, sur 10 : total des points obtenus rapporté au total du barème du sujet
      // (toutes ses questions, même celles que le modèle aurait oublié de corriger). Avant, la note du
      // modèle était reprise telle quelle et dépassait régulièrement 10/10.
      const totalSujet = [...bareme.values()].reduce((s, p) => s + p, 0)
      const totalMax = totalSujet > 0 ? totalSujet : correction.corrections.reduce((s, c) => s + c.points_max, 0)
      const totalObtenu = correction.corrections.reduce((s, c) => s + c.points_obtenus, 0)
      const noteModele = typeof correction.note === 'number' ? correction.note : 0
      const note = totalMax > 0 ? totalObtenu / totalMax * 10 : noteModele
      correction.note = Math.min(10, Math.max(0, Math.round(note * 10) / 10))
      correction.noteMax = 10
      return NextResponse.json({ correction })
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
