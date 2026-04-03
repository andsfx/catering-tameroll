'use server'

import { redirect } from 'next/navigation'
import { createAdminSession } from '@/lib/auth/admin-session'
import { verifyAdminLogin } from '@/lib/data/admin-auth'

export async function loginAdmin(_prevState: { error?: string } | undefined, formData: FormData) {
  const username = String(formData.get('username') || '').trim()
  const password = String(formData.get('password') || '')

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' }
  }

  const valid = await verifyAdminLogin({ username, password })

  if (!valid) {
    return { error: 'Username atau password tidak valid.' }
  }

  await createAdminSession(username)
  redirect('/admin')
}
