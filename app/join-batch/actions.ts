'use server'

import { createJoinRequest } from '@/lib/data/join-requests'
import { getActiveBatch } from '@/lib/data/batches'
import { uploadPaymentProof } from '@/lib/storage/payment-proofs'
import { validateJoinRequestInput, validatePaymentProofFile } from '@/lib/validators/join-request'
import type { AdminFormState } from '@/lib/forms/admin-form-state'

export async function submitJoinBatch(_prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  const activeBatch = await getActiveBatch()

  if (!activeBatch) {
    return { error: 'Batch aktif belum tersedia saat ini.', success: '' }
  }

  try {
    const fullName = String(formData.get('fullName') || '')
    const phone = String(formData.get('phone') || '')
    const notes = String(formData.get('notes') || '').trim() || null
    const paymentProof = formData.get('paymentProof')

    const validated = validateJoinRequestInput({ fullName, phone })
    const proofFile = paymentProof instanceof File ? paymentProof : null
    validatePaymentProofFile(proofFile)

    const storagePath = await uploadPaymentProof(proofFile!, activeBatch.id, validated.fullName)

    await createJoinRequest({
      batchId: activeBatch.id,
      fullName: validated.fullName,
      phone: validated.phone,
      paymentProofUrl: storagePath,
      notes,
    })

    return {
      error: '',
      success: 'Pendaftaran berhasil dikirim. Admin akan mengecek batch aktif dan menghubungi Anda via WhatsApp.',
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Gagal mengirim pendaftaran join batch.',
      success: '',
    }
  }
}
