import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(25),
  message: z.string().trim().min(10).max(2000),
  website: z.string().optional(),
})

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 5

type RateBucket = {
  count: number
  resetAt: number
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __contactRateLimit?: Map<string, RateBucket>
}

const rateLimitStore = globalForRateLimit.__contactRateLimit ?? new Map<string, RateBucket>()
globalForRateLimit.__contactRateLimit = rateLimitStore

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(key: string) {
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (current.count >= MAX_REQUESTS) {
    return true
  }

  current.count += 1
  rateLimitStore.set(key, current)
  return false
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const parsed = contactSchema.safeParse(payload)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Please enter valid contact details.' }, { status: 400 })
    }

    const { name, email, phone, message, website } = parsed.data

    // Hidden honeypot field should always be empty for real users.
    if (website && website.trim().length > 0) {
      return NextResponse.json({ success: true })
    }

    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 },
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    const contactTo = process.env.CONTACT_RECIPIENT_EMAIL
    const contactFrom = process.env.CONTACT_FROM_EMAIL || 'Vadhus Beauty <onboarding@resend.dev>'

    if (!resendApiKey || !contactTo) {
      return NextResponse.json(
        { error: 'Contact service is not configured yet. Please call us directly.' },
        { status: 500 },
      )
    }

    const subject = `New contact enquiry from ${name}`
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      '',
      'Message:',
      message,
    ].join('\n')

    const html = `
      <h2>New Contact Enquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
    `

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: contactFrom,
        to: [contactTo],
        subject,
        reply_to: email,
        text,
        html,
      }),
    })

    if (!resendResponse.ok) {
      const errText = await resendResponse.text()
      console.error('Resend contact email error:', errText)

      return NextResponse.json(
        { error: 'Could not send your message right now. Please try again shortly.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
