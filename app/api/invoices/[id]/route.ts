import { createClient } from '@/lib/supabase/server'
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/admin-api-guard'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuthorized = await isAdminRequestAuthorized()
    if (!isAuthorized) {
      return unauthorizedAdminResponse()
    }

    const { id } = await params
    const body = await request.json()
    const { status, payment_method } = body

    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updateData.status = status
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString()
      }
    }

    if (payment_method) {
      updateData.payment_method = payment_method
    }

    const { data, error } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to update invoice' },
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
