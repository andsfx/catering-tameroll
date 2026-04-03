'use server'

import { redirect } from 'next/navigation'
import { createAdminSession } from '@/lib/auth/admin-session'
import { verifyAdminLogin } from '@/lib/data/admin-auth'
import type { AdminFormState } from '@/lib/forms/admin-form-state'

export async function loginAdmin(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const username = String(formData.get('username') || '').trim()
  const password = String(formData.get('password') || '')

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.', success: '' }
  }

  const valid = await verifyAdminLogin({ username, password })

  if (!valid) {
    return { error: 'Username atau password tidak valid.', success: '' }
  }

  await createAdminSession(username)
  redirect('/admin')
}
