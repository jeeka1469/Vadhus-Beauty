import { createClient } from '@/lib/supabase/server'
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/admin-api-guard'
import {
  buildPaymentReminderMessage,
  normalizeIndianPhone,
  sendMsg91Sms,
} from '@/lib/msg91'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthorized = await isAdminRequestAuthorized()
    if (!isAuthorized) {
      return unauthorizedAdminResponse()
    }

    const { id } = await params

    const authKey = process.env.MSG91_AUTH_KEY
    const senderId = process.env.MSG91_SENDER_ID
    const route = process.env.MSG91_ROUTE || '4'
    const countryCode = process.env.MSG91_COUNTRY_CODE || '91'
    const templateId = process.env.MSG91_TEMPLATE_ID
    const cooldownHours = Number(process.env.REMINDER_COOLDOWN_HOURS || '24')

    if (!authKey || !senderId) {
      return NextResponse.json(
        { error: 'Missing MSG91 credentials in environment variables' },
        { status: 500 },
      )
    }

    const supabase = await createClient()

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(
        `
        id,
        invoice_number,
        total,
        status,
        reminder_count,
        booking:bookings(client_name, client_phone)
      `,
      )
      .eq('id', id)
      .single()

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    if (invoice.status !== 'unpaid') {
      return NextResponse.json(
        { error: 'Reminder can only be sent for unpaid invoices' },
        { status: 400 },
      )
    }

    const rawPhone = invoice.booking?.client_phone || ''
    const normalizedPhone = normalizeIndianPhone(rawPhone, countryCode)

    if (!normalizedPhone) {
      return NextResponse.json({ error: 'Invalid client phone number' }, { status: 400 })
    }

    const message = buildPaymentReminderMessage({
      customerName: invoice.booking?.client_name || 'Customer',
      invoiceNumber: invoice.invoice_number,
      amount: `INR ${Number(invoice.total).toLocaleString('en-IN')}`,
    })

    const result = await sendMsg91Sms({
      authKey,
      senderId,
      to: normalizedPhone,
      message,
      route,
      country: countryCode,
      templateId,
    })

    if (!result.ok) {
      await supabase.from('invoice_reminders_log').insert({
        invoice_id: invoice.id,
        sent_to: normalizedPhone,
        message_template: 'msg91_payment_reminder',
        status: 'failed',
        error_message: result.error || 'Unknown MSG91 error',
      })

      return NextResponse.json(
        { error: result.error || 'Failed to send reminder' },
        { status: 500 },
      )
    }

    const now = new Date()

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
      message_template: 'msg91_payment_reminder',
      status: 'sent',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Send reminder API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
