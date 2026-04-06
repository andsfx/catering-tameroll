export function normalizeIdPhone(input: string): string {
  const cleaned = input.replace(/[^0-9+]/g, '').trim()

  let normalized = cleaned

  if (normalized.startsWith('+62')) {
    normalized = normalized.slice(1)
  }

  if (normalized.startsWith('08')) {
    normalized = `62${normalized.slice(1)}`
  }

  if (!/^628[0-9]{7,13}$/.test(normalized)) {
    throw new Error('Nomor telepon harus menggunakan format WhatsApp Indonesia yang valid.')
  }

  return normalized
}

export function isValidIndonesianWhatsAppPhone(input: string): boolean {
  try {
    normalizeIdPhone(input)
    return true
  } catch {
    return false
  }
}
