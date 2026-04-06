import { normalizeIdPhone } from '@/lib/validators/phone'

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_FILE_SIZE = 5 * 1024 * 1024

export function validateJoinRequestInput(input: { fullName: string; phone: string }) {
  const fullName = input.fullName.trim()

  if (fullName.length < 3) {
    throw new Error('Nama minimal 3 karakter.')
  }

  const phone = normalizeIdPhone(input.phone)

  return { fullName, phone }
}

export function validatePaymentProofFile(file: File | null | undefined) {
  if (!file || file.size === 0) {
    throw new Error('Bukti pembayaran wajib diupload.')
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Format bukti pembayaran harus JPG, PNG, atau PDF.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Ukuran bukti pembayaran maksimal 5MB.')
  }
}
