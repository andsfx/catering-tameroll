'use server'

import { updateAdminPassword } from '@/lib/data/admin-auth'
import { requireAdminSession } from '@/lib/auth/admin-session'
import type { AdminFormState } from '@/lib/forms/admin-form-state'

export async function changeAdminPassword(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const session = await requireAdminSession()
  const currentPassword = String(formData.get('currentPassword') || '')
  const newPassword = String(formData.get('newPassword') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua field password wajib diisi.', success: '' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password baru tidak cocok.', success: '' }
  }

  try {
    await updateAdminPassword({
      username: session.username,
      currentPassword,
      newPassword,
    })

    return { error: '', success: 'Password admin berhasil diperbarui.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Gagal memperbarui password.',
      success: '',
    }
  }
}
