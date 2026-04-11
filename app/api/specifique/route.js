import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { checkRateLimit } from '@/lib/rate-limit'
import { BASE_SYSTEM, FORMAT_SORTIE } from '@/lib/prompts/base-maths'
import { SYSTEM_POURCENTAGES, PROMPT_POURCENTAGES } from '@/lib/prompts/famille-pourcentages'
import { SYSTEM_PROPORTIONNALITE, PROMPT_PROPORTIONNALITE } from '@/lib/prompts/famille-proportionnalite'
import { SYSTEM_CONVERSIONS, PROMPT_CONVERSIONS } from '@/lib/prompts/famille-conversions'
import { SYSTEM_EQUATIONS, PROMPT_EQUATIONS } from '@/lib/prompts/famille-equations'
import { callClaude, callClaudeWithPDF } from '@/lib/anthropic'

let annalesBase64 = null
try {
  const pdfPath = join(process.cwd(), 'data', 'annales-maths.pdf')
  const pdfBuffer = readFileSync(pdfPath)
  annalesBase64 = pdfBuffer.toString('base64')
} catch (e) {
  console.error('Impossible de charger le PDF des annales maths:', e.message)
}

const FAMILLES = {
  operations: { system: SYSTEM_PROPORTIONNALITE, prompt: PROMPT_PROPORTIONNALITE },
  pourcentages: { system: SYSTEM_POURCENTAGES, prompt: PROMPT_POURCENTAGES },
  conversions: { system: SYSTEM_CONVERSIONS, prompt: PROMPT_CONVERSIONS },
  equations: { system: SYSTEM_EQUATIONS, prompt: PROMPT_EQUATIONS }
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Trop de requêtes. Réessayez dans quelques secondes.' }, { status: 429 })

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Clé API manquante.' }, { status: 500 })
    }

    const body = await request.json()
    const { action, famille } = body

    if (action === 'generer') {
      if (!famille || !FAMILLES[famille]) {
        return NextResponse.json({ error: 'Famille non reconnue.' }, { status: 400 })
      }

      const config = FAMILLES[famille]
      const systemInstruction = BASE_SYSTEM + '\n\n' + config.system
      const userPrompt = config.prompt + '\n\n' + FORMAT_SORTIE

      let text
      if (annalesBase64) {
        text = await callClaudeWithPDF(systemInstruction, userPrompt, annalesBase64, { temperature: 0.85, maxTokens: 12000 })
      } else {
        text = await callClaude(systemInstruction, userPrompt, { temperature: 0.85, maxTokens: 12000 })
      }

      let sujetData
      try {
        sujetData = JSON.parse(text)
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) return NextResponse.json({ error: 'Erreur de format.' }, { status: 500 })
        sujetData = JSON.parse(jsonMatch[0])
      }

      // Mapper les champs pour compatibilité avec le front (numero→id, enonce→question)
      if (sujetData.questions) {
        sujetData.questions = sujetData.questions.map(q => ({
          id: q.numero || q.id,
          question: q.enonce || q.question,
          reponse: q.reponse,
          explication: q.explication || ''
        }))
      }

      return NextResponse.json({ sujet: sujetData })
    }

    return NextResponse.json({ error: 'Action non reconnue.' }, { status: 400 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Erreur serveur : ' + error.message }, { status: 500 })
  }
}
