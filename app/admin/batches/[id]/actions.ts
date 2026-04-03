'use server'

import { revalidatePath } from 'next/cache'
import { requireAdminSession } from '@/lib/auth/admin-session'
import { setActiveBatch, updateBatch } from '@/lib/data/batches'
import { deleteBatchSlot, upsertBatchSlot } from '@/lib/data/batch-slots'

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

export async function upsertBatchSlotAction(
  batchId: string,
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdminSession()

  const slotId = String(formData.get('slotId') || '').trim()
  const date = String(formData.get('date') || '').trim()
  const dayName = String(formData.get('dayName') || '').trim()
  const sortOrderRaw = String(formData.get('sortOrder') || '0').trim()

  if (!date || !dayName) {
    return { error: 'Tanggal dan nama hari wajib diisi.' }
  }

  try {
    await upsertBatchSlot({
      id: slotId || undefined,
      batch_id: batchId,
      date,
      day_name: dayName,
      main_course: String(formData.get('mainCourse') || '').trim() || null,
      side_dish: String(formData.get('sideDish') || '').trim() || null,
      extra: String(formData.get('extra') || '').trim() || null,
      image_url: String(formData.get('imageUrl') || '').trim() || null,
      label: String(formData.get('label') || '').trim() || null,
      is_available: formData.get('isAvailable') === 'on',
      sort_order: Number(sortOrderRaw || '0'),
    })

    revalidatePath(`/admin/batches/${batchId}`)
    revalidatePath('/api/public-menu')
    return { success: 'Slot batch berhasil disimpan.' }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Gagal menyimpan slot batch.' }
  }
}

export async function deleteBatchSlotAction(batchId: string, slotId: string) {
  await requireAdminSession()
  await deleteBatchSlot(slotId)
  revalidatePath(`/admin/batches/${batchId}`)
  revalidatePath('/api/public-menu')
}
