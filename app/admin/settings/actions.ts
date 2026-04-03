'use server'

import { updateAdminPassword } from '@/lib/data/admin-auth'
import { requireAdminSession } from '@/lib/auth/admin-session'

export async function changeAdminPassword(_prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  const session = await requireAdminSession()
  const currentPassword = String(formData.get('currentPassword') || '')
  const newPassword = String(formData.get('newPassword') || '')
  const confirmPassword = String(formData.get('confirmPassword') || '')

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'Semua field password wajib diisi.' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'Konfirmasi password baru tidak cocok.' }
  }

  try {
    await updateAdminPassword({
      username: session.username,
      currentPassword,
      newPassword,
    })

    return { success: 'Password admin berhasil diperbarui.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Gagal memperbarui password.',
    }
  }
}
