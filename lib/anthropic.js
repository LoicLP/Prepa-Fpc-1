import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Appel Claude Haiku avec system instruction + user prompt (texte uniquement)
 */
export async function callClaude(systemInstruction, userPrompt, { temperature = 0.7, maxTokens = 8000 } = {}) {
  const response = await client.messages.create({
    model: 'claude-haiku-4-20250414',
    max_tokens: maxTokens,
    temperature,
    system: systemInstruction,
    messages: [{ role: 'user', content: userPrompt }]
  })

  const text = response.content?.[0]?.text || ''
  if (!text) throw new Error('Réponse vide de Claude')
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
}

/**
 * Appel Claude Haiku avec un PDF en pièce jointe (base64)
 */
export async function callClaudeWithPDF(systemInstruction, userPrompt, pdfBase64, { temperature = 0.7, maxTokens = 8000 } = {}) {
  const response = await client.messages.create({
    model: 'claude-haiku-4-20250414',
    max_tokens: maxTokens,
    temperature,
    system: systemInstruction,
    messages: [{
      role: 'user',
      content: [
        {
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: pdfBase64 }
        },
        { type: 'text', text: userPrompt }
      ]
    }]
  })

  const text = response.content?.[0]?.text || ''
  if (!text) throw new Error('Réponse vide de Claude')
  return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
}
