import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAdminAccessCookieName, isAdminAccessTokenValid } from '@/lib/admin-access'

export async function isAdminRequestAuthorized() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(getAdminAccessCookieName())?.value
  return isAdminAccessTokenValid(accessToken)
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
