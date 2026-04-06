import { createSupabaseAdminClient } from '@/lib/supabase/admin'

const BUCKET_NAME = 'payment-proofs'

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50)
}

function getFileExtension(fileName: string) {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'bin'
}

export async function uploadPaymentProof(file: File, batchId: string, fullName: string) {
  const supabase = createSupabaseAdminClient()
  const arrayBuffer = await file.arrayBuffer()
  const extension = getFileExtension(file.name)
  const filePath = `join-requests/${batchId}/${Date.now()}-${slugify(fullName)}.${extension}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, arrayBuffer, {
    contentType: file.type,
    upsert: false,
  })

  if (error) throw error

  return filePath
}

export async function createPaymentProofSignedUrl(path: string, expiresInSeconds = 60) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, expiresInSeconds)

  if (error || !data?.signedUrl) {
    throw error || new Error('Gagal membuat signed URL bukti pembayaran.')
  }

  return data.signedUrl
}
