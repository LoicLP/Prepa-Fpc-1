import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY missing', keys: Object.keys(process.env).filter(k => k.includes('RESEND')) })

  const resend = new Resend(apiKey)
  const { data, error } = await resend.emails.send({
    from: 'Prépa FPC <noreply@prepa-fpc.fr>',
    to: 'support@prepa-fpc.fr',
    subject: 'Test email Prépa FPC',
    html: '<p>Test envoi email depuis Resend</p>'
  })

  return NextResponse.json({ data, error, keyPresent: true, keyLength: apiKey.length })
}
