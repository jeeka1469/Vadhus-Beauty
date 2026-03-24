import { createClient } from '@/lib/supabase/server'
import {
  normalizeWhatsappPhone,
  sendWhatsappPaymentReminder,
} from '@/lib/whatsapp'
import { NextResponse } from 'next/server'

interface InvoiceRow {
  id: string
  invoice_number: string
  total: number
  status: 'unpaid' | 'paid' | 'refunded'
  reminder_count: number | null
  last_reminder_sent_at: string | null
  next_reminder_at: string | null
  created_at: string
  booking: {
    client_name: string | null
    client_phone: string | null
    booking_date: string | null
  } | null
}

function isAuthorized(request: Request) {
  const secret = process.env.REMINDER_CRON_SECRET || process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization') || ''
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  const headerSecret = request.headers.get('x-reminder-secret') || ''

  if (!secret) {
    return false
  }

  return bearer === secret || headerSecret === secret
}

function getNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name])
  return Number.isFinite(value) ? value : fallback
}

function shouldSendReminder(
  invoice: InvoiceRow,
  now: Date,
  minimumDaysFromInvoice: number,
  cooldownHours: number,
  maxAttempts: number,
) {
  const reminderCount = invoice.reminder_count || 0
  if (invoice.status !== 'unpaid' || reminderCount >= maxAttempts) {
    return false
  }

  const createdAt = new Date(invoice.created_at)
  const ageHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
  if (ageHours < minimumDaysFromInvoice * 24) {
    return false
  }

  if (invoice.next_reminder_at) {
    const nextReminderAt = new Date(invoice.next_reminder_at)
    if (now < nextReminderAt) {
      return false
    }
  }

  if (invoice.last_reminder_sent_at) {
    const lastSentAt = new Date(invoice.last_reminder_sent_at)
    const sinceLastReminderHours = (now.getTime() - lastSentAt.getTime()) / (1000 * 60 * 60)
    if (sinceLastReminderHours < cooldownHours) {
      return false
    }
  }

  return true
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || 'payment_reminder'
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANG || 'en'
  const defaultCountryCode = process.env.WHATSAPP_DEFAULT_COUNTRY_CODE || '91'

  if (!accessToken || !phoneNumberId) {
    return NextResponse.json(
      { error: 'Missing WhatsApp credentials in environment variables' },
      { status: 500 },
    )
  }

  const minimumDaysFromInvoice = getNumberEnv('REMINDER_MIN_DAYS_OVERDUE', 1)
  const cooldownHours = getNumberEnv('REMINDER_COOLDOWN_HOURS', 24)
  const maxAttempts = getNumberEnv('REMINDER_MAX_ATTEMPTS', 3)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('invoices')
    .select(
      `
      id,
      invoice_number,
      total,
      status,
      reminder_count,
      last_reminder_sent_at,
      next_reminder_at,
      created_at,
      booking:bookings(client_name, client_phone, booking_date)
    `,
    )
    .eq('status', 'unpaid')

  if (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch invoices. Did you run scripts/003_add_whatsapp_reminders.sql?',
        details: error.message,
      },
      { status: 500 },
    )
  }

  const invoices = (data || []) as unknown as InvoiceRow[]
  const now = new Date()

  let attempted = 0
  let sent = 0
  let failed = 0
  let skipped = 0

  for (const invoice of invoices) {
    if (!shouldSendReminder(invoice, now, minimumDaysFromInvoice, cooldownHours, maxAttempts)) {
      skipped += 1
      continue
    }

    const rawPhone = invoice.booking?.client_phone || ''
    const normalizedPhone = normalizeWhatsappPhone(rawPhone, defaultCountryCode)

    if (!normalizedPhone) {
      failed += 1
      await supabase.from('invoice_reminders_log').insert({
        invoice_id: invoice.id,
        sent_to: rawPhone,
        message_template: templateName,
        status: 'failed',
        error_message: 'Missing or invalid client phone number',
      })
      continue
    }

    attempted += 1

    const result = await sendWhatsappPaymentReminder({
      accessToken,
      phoneNumberId,
      templateName,
      languageCode,
      to: normalizedPhone,
      customerName: invoice.booking?.client_name || 'Customer',
      invoiceNumber: invoice.invoice_number,
      totalAmount: `INR ${Number(invoice.total).toLocaleString('en-IN')}`,
      bookingDate: invoice.booking?.booking_date || '-',
    })

    if (!result.ok) {
      failed += 1
      await supabase.from('invoice_reminders_log').insert({
        invoice_id: invoice.id,
        sent_to: normalizedPhone,
        message_template: templateName,
        status: 'failed',
        provider_message_id: result.messageId || null,
        error_message: result.error || 'Unknown WhatsApp API error',
      })
      continue
    }

    sent += 1

    await supabase
      .from('invoices')
      .update({
        reminder_count: (invoice.reminder_count || 0) + 1,
        last_reminder_sent_at: now.toISOString(),
        next_reminder_at: new Date(now.getTime() + cooldownHours * 60 * 60 * 1000).toISOString(),
        updated_at: now.toISOString(),
      })
      .eq('id', invoice.id)

    await supabase.from('invoice_reminders_log').insert({
      invoice_id: invoice.id,
      sent_to: normalizedPhone,
      message_template: templateName,
      status: 'sent',
      provider_message_id: result.messageId || null,
    })
  }

  return NextResponse.json({
    success: true,
    totalUnpaidInvoices: invoices.length,
    attempted,
    sent,
    failed,
    skipped,
  })
}
