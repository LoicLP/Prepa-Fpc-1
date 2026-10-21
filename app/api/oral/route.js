import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { verifierAccesExercices } from '@/lib/acces'
import { BASE_ORAL, FORMAT_SORTIE_ORAL } from '@/lib/prompts/base-oral'
import { SYSTEM_ORAL, PROMPT_ORAL } from '@/lib/prompts/simulation-oral'
import { callClaudeWithPDF } from '@/lib/anthropic'

const categoryMap = {
  parcours: 'Parcours professionnel',
  metier: 'Connaissance du métier',
  qualites: 'Qualités personnelles',
  mise_en_situation: 'Mise en situation',
  piege: 'Question piège'
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 })
    // Compte connecté avec essai ou abonnement valide, vérifié ici et pas seulement dans la page
    const acces = await verifierAccesExercices(request)
    if (acces.erreur) return acces.erreur
    if (!checkRateLimit('compte:' + acces.user.id)) return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Clé API manquante.' }, { status: 500 })
    }

    const formData = await request.formData()
    const pdfFile = formData.get('pdf')

    if (!pdfFile) {
      return NextResponse.json({ error: 'Veuillez télécharger votre CV au format PDF.' }, { status: 400 })
    }

    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
    const pdfBase64 = pdfBuffer.toString('base64')

    // Assembler les prompts
    const systemInstruction = BASE_ORAL + '\n\n' + SYSTEM_ORAL
    const userPrompt = PROMPT_ORAL + '\n\n' + FORMAT_SORTIE_ORAL

    // Réponse courte (10 questions, 3 champs chacune) : rapide, et loin de la limite de tokens.
    // L'ancienne demande (points clés, erreurs, exemples) dépassait 8 000 tokens : JSON coupé, puis erreur 500.
    const text = await callClaudeWithPDF(systemInstruction, userPrompt, pdfBase64, { temperature: 0.9, maxTokens: 3000 })

    let raw
    try {
      raw = JSON.parse(text)
    } catch {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        raw = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      } catch {
        raw = null
      }
    }
    if (!raw || !Array.isArray(raw.questions) || raw.questions.length === 0) {
      console.error('Oral : réponse illisible', text.slice(0, 300))
      return NextResponse.json({ error: 'La préparation des questions a échoué. Réessayez dans quelques secondes.' }, { status: 502 })
    }

    // Mapper vers le format attendu par le front (numero→id, categorie→category)
    const questions = (raw.questions || []).map((q, i) => ({
      id: q.numero || i + 1,
      question: q.question || '',
      category: categoryMap[q.categorie] || q.categorie || 'Parcours professionnel'
    }))

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'La préparation des questions a échoué. Réessayez dans quelques secondes.' }, { status: 500 })
  }
}
