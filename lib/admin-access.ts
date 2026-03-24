import crypto from 'node:crypto'

const COOKIE_NAME = 'vb_admin_access'
const SIGNING_PAYLOAD = 'vadhus-admin-access'

function getSigningSecret() {
  return process.env.ADMIN_COOKIE_SECRET || process.env.ADMIN_ACCESS_CODE || ''
}

function signPayload(payload: string) {
  const secret = getSigningSecret()
  if (!secret) return ''

  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

export function getAdminAccessCookieName() {
  return COOKIE_NAME
}

export function createAdminAccessToken() {
  return signPayload(SIGNING_PAYLOAD)
}

export function isAdminAccessTokenValid(token?: string) {
  if (!token) return false

  const expected = createAdminAccessToken()
  if (!expected) return false

  if (token.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function isAdminAccessCodeValid(code: string) {
  const expectedCode = process.env.ADMIN_ACCESS_CODE || ''
  if (!expectedCode || !code) return false

  return code.trim() === expectedCode.trim()
}
