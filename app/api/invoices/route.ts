import { createClient } from '@/lib/supabase/server'
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/admin-api-guard'
import { NextResponse } from 'next/server'

function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `VB${year}${month}${random}`
}

export async function POST(request: Request) {
  try {
    const isAuthorized = await isAdminRequestAuthorized()
    if (!isAuthorized) {
      return unauthorizedAdminResponse()
    }

    const body = await request.json()
    const { booking_id, amount, tax, total, payment_method, status } = body

    if (!booking_id || amount === undefined || total === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generate unique invoice number
    const invoice_number = generateInvoiceNumber()

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        booking_id,
        invoice_number,
        amount,
        tax: tax || 0,
        total,
        status: status || 'unpaid',
        payment_method,
        paid_at: status === 'paid' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, invoice: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const isAuthorized = await isAdminRequestAuthorized()
    if (!isAuthorized) {
      return unauthorizedAdminResponse()
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        booking:bookings(
          id,
          client_name,
          client_phone,
          client_email,
          booking_date,
          service:services(name, price)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      )
    }

    return NextResponse.json({ invoices: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
