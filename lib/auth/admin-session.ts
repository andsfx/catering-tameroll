import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'tameroll_admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || 'temporary-admin-session-secret'
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('hex')
}

function encodeSession(username: string, expiresAt: number) {
  const payload = `${username}:${expiresAt}`
  const signature = sign(payload)
  return `${payload}:${signature}`
}

function decodeSession(value: string | undefined | null) {
  if (!value) return null

  const parts = value.split(':')
  if (parts.length !== 3) return null

  const [username, expiresAtRaw, signature] = parts
  const payload = `${username}:${expiresAtRaw}`
  const expected = sign(payload)

  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (actualBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(actualBuffer, expectedBuffer)) return null

  const expiresAt = Number(expiresAtRaw)
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null

  return { username, expiresAt }
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies()
  const expiresAt = Date.now() + SESSION_TTL_MS

  cookieStore.set(COOKIE_NAME, encodeSession(username, expiresAt), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  return decodeSession(cookieStore.get(COOKIE_NAME)?.value)
}

export async function requireAdminSession() {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return session
}

export const adminSessionCookieName = COOKIE_NAME
