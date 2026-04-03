'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/admin-session'
import { setActiveBatch, updateBatch } from '@/lib/data/batches'

export async function updateBatchAction(batchId: string, _prevState: { error?: string; success?: string } | undefined, formData: FormData) {
  await requireAdminSession()

  const name = String(formData.get('name') || '').trim()
  const status = String(formData.get('status') || 'open') as 'open' | 'running' | 'closed'
  const deadlineJoinRaw = String(formData.get('deadlineJoin') || '').trim()
  const remainingQuotaRaw = String(formData.get('remainingQuota') || '').trim()
  const nextBatchOpenRaw = String(formData.get('nextBatchOpen') || '').trim()
  const nextBatchLabel = String(formData.get('nextBatchLabel') || '').trim()
  const notes = String(formData.get('notes') || '').trim()
  const setActive = formData.get('isActive') === 'on'

  if (!name) {
    return { error: 'Nama batch wajib diisi.' }
  }

  try {
    await updateBatch(batchId, {
      name,
      status,
      deadline_join: deadlineJoinRaw || null,
      remaining_quota: remainingQuotaRaw ? Number(remainingQuotaRaw) : null,
      next_batch_open: nextBatchOpenRaw || null,
      next_batch_label: nextBatchLabel || null,
      notes: notes || null,
    })

    if (setActive) {
      await setActiveBatch(batchId)
    }

    revalidatePath('/admin')
    revalidatePath(`/admin/batches/${batchId}`)
    revalidatePath('/api/public-menu')

    return { success: 'Batch berhasil diperbarui.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Gagal memperbarui batch.' }
  }
}
