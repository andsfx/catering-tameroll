import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createPaymentProofSignedUrl } from '@/lib/storage/payment-proofs'

export type JoinRequestRecord = {
  id: string
  batch_id: string
  full_name: string
  phone: string
  payment_proof_url: string
  status: 'new' | 'verified' | 'rejected' | 'waitlisted'
  notes: string | null
  created_at: string
  batches: { name: string } | null
}

export async function getJoinRequests() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,created_at,batches(name)')
    .order('created_at', { ascending: false })
    .returns<JoinRequestRecord[]>()

  if (error) throw error
  return data || []
}

export async function createJoinRequest(input: {
  batchId: string
  fullName: string
  phone: string
  paymentProofUrl: string
  notes?: string | null
}) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .insert({
      batch_id: input.batchId,
      full_name: input.fullName,
      phone: input.phone,
      payment_proof_url: input.paymentProofUrl,
      notes: input.notes ?? null,
    })
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,created_at')
    .single()

  if (error) throw error
  return data
}

export async function updateJoinRequestStatus(
  requestId: string,
  status: 'new' | 'verified' | 'rejected' | 'waitlisted'
) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .update({ status })
    .eq('id', requestId)
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,created_at,batches(name)')
    .single<JoinRequestRecord>()

  if (error) throw error
  return data
}

export async function getJoinRequestById(requestId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,created_at,batches(name)')
    .eq('id', requestId)
    .single<JoinRequestRecord>()

  if (error) return null
  return data
}

export async function getPaymentProofSignedUrl(storagePath: string) {
  return createPaymentProofSignedUrl(storagePath, 60)
}
