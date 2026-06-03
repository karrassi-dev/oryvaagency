import { NextRequest, NextResponse } from 'next/server'
import { saveSubmission } from '@/lib/submissions'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(30).optional().default(''),
  company: z.string().max(100).optional().default(''),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      const message = parsed.error.message ?? 'Invalid input'
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const submission = await saveSubmission(parsed.data)

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (err) {
    console.error('[contact] submission error:', err)
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
  }
}
