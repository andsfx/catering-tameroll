'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/admin-session'
import { updateJoinRequestStatus } from '@/lib/data/join-requests'

export async function updateJoinRequestStatusAction(
  requestId: string,
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdminSession()

  const status = String(formData.get('status') || 'new') as 'new' | 'verified' | 'rejected' | 'waitlisted'

  try {
    await updateJoinRequestStatus(requestId, status)
    revalidatePath('/admin/join-requests')
    return { success: 'Status request berhasil diperbarui.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Gagal memperbarui status request.' }
  }
}
