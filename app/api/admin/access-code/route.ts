import { NextResponse } from 'next/server'
import {
  createAdminAccessToken,
  getAdminAccessCookieName,
  isAdminAccessCodeValid,
} from '@/lib/admin-access'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!isAdminAccessCodeValid(code)) {
      return NextResponse.json({ error: 'Invalid admin access code' }, { status: 401 })
    }

    const token = createAdminAccessToken()

    if (!token) {
      return NextResponse.json(
        { error: 'Admin access is not configured on server' },
        { status: 500 },
      )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set(getAdminAccessCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })

  response.cookies.set(getAdminAccessCookieName(), '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
