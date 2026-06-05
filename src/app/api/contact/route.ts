import { NextRequest, NextResponse } from 'next/server'
import { saveSubmission } from '@/lib/submissions'
import { z } from 'zod'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(''),
  company: z.string().max(100).optional().default(''),
  message: z.string().min(10).max(5000),
})

const resend = new Resend(process.env.RESEND_API_KEY)
const TO = process.env.CONTACT_EMAIL ?? 'karrassi.hamza@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { name, email, phone, company, message } = parsed.data

    // Save to local file only in development (Vercel filesystem is read-only)
    let submissionId = crypto.randomUUID()
    if (process.env.NODE_ENV !== 'production') {
      const submission = await saveSubmission(parsed.data)
      submissionId = submission.id
    }

    // Send email via Resend
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: TO,
      subject: `New contact from ${name} — Oryva`,
      html: `
        <h2>New contact form submission</h2>
        <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
          <tr><td style="padding:8px;font-weight:bold;background:#f4f4f5">Name</td><td style="padding:8px">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;background:#f4f4f5">Email</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px;font-weight:bold;background:#f4f4f5">Phone</td><td style="padding:8px">${phone}</td></tr>` : ''}
          ${company ? `<tr><td style="padding:8px;font-weight:bold;background:#f4f4f5">Company</td><td style="padding:8px">${company}</td></tr>` : ''}
          <tr><td style="padding:8px;font-weight:bold;background:#f4f4f5;vertical-align:top">Message</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
        </table>
      `,
    })

    return NextResponse.json({ success: true, id: submissionId }, { status: 201 })
  } catch (err) {
    console.error('[contact] error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
