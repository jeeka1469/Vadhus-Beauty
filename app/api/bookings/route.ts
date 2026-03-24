import { createClient } from '@/lib/supabase/server'
import { getAdminAccessCookieName, isAdminAccessTokenValid } from '@/lib/admin-access'
import { isAdminRequestAuthorized, unauthorizedAdminResponse } from '@/lib/admin-api-guard'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const ALLOWED_BOOKING_SOURCES = ['online', 'walkin', 'phone'] as const
const ALLOWED_BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      service_id,
      booking_date,
      booking_time,
      client_name,
      client_phone,
      client_email,
      notes,
      source,
      status,
    } = body

    // Validate required fields
    if (!service_id || !booking_date || !booking_time || !client_name || !client_phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const requestedSource = typeof source === 'string' ? source : 'online'
    const requestedStatus = typeof status === 'string' ? status : 'pending'
    const isValidSource = ALLOWED_BOOKING_SOURCES.includes(requestedSource as (typeof ALLOWED_BOOKING_SOURCES)[number])
    const isValidStatus = ALLOWED_BOOKING_STATUSES.includes(requestedStatus as (typeof ALLOWED_BOOKING_STATUSES)[number])

    if (!isValidSource || !isValidStatus) {
      return NextResponse.json(
        { error: 'Invalid booking source or status' },
        { status: 400 }
      )
    }

    const hasAdminOverride = requestedSource !== 'online' || requestedStatus !== 'pending'
    if (hasAdminOverride) {
      const cookieStore = await cookies()
      const accessToken = cookieStore.get(getAdminAccessCookieName())?.value
      const hasValidAdminAccess = isAdminAccessTokenValid(accessToken)

      if (!hasValidAdminAccess) {
        return NextResponse.json(
          { error: 'Unauthorized to set manual booking source/status' },
          { status: 403 }
        )
      }
    }

    const supabase = await createClient()

    // Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        service_id,
        booking_date,
        booking_time,
        client_name,
        client_phone,
        client_email,
        notes,
        status: requestedStatus,
        source: requestedSource,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, booking: data })
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
      .from('bookings')
      .select(`
        *,
        service:services(*)
      `)
      .order('booking_date', { ascending: true })
      .order('booking_time', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
