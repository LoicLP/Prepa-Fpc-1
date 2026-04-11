import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { BASE_ORAL, FORMAT_SORTIE_ORAL } from '@/lib/prompts/base-oral'
import { SYSTEM_ORAL, PROMPT_ORAL } from '@/lib/prompts/simulation-oral'
import { callClaude } from '@/lib/anthropic'
import { PDFParse } from 'pdf-parse'

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

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Clé API manquante.' }, { status: 500 })
    }

    const formData = await request.formData()
    const pdfFile = formData.get('pdf')

    if (!pdfFile) {
      return NextResponse.json({ error: 'Veuillez télécharger votre CV au format PDF.' }, { status: 400 })
    }

    // Extraire le texte du PDF
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())
    const parser = new PDFParse()
    const pdfData = await parser.parseBuffer(pdfBuffer)
    const cvText = pdfData.pages.map(p => p.text).join('\n')

    if (!cvText || cvText.trim().length < 20) {
      return NextResponse.json({ error: 'Impossible de lire le contenu du CV. Vérifiez que votre PDF contient du texte.' }, { status: 400 })
    }

    // Assembler les prompts
    const systemInstruction = BASE_ORAL + '\n\n' + SYSTEM_ORAL
    const userPrompt = `VOICI LE CV DU CANDIDAT :\n\n${cvText}\n\n${PROMPT_ORAL}\n\n${FORMAT_SORTIE_ORAL}`

    const text = await callClaude(systemInstruction, userPrompt, { temperature: 0.9, maxTokens: 8000 })

    let raw
    try {
      raw = JSON.parse(text)
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) return NextResponse.json({ error: 'Erreur de format.' }, { status: 500 })
      raw = JSON.parse(jsonMatch[0])
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
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
