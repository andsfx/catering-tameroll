import { createSupabaseAdminClient } from '@/lib/supabase/admin'
import { createPaymentProofSignedUrl } from '@/lib/storage/payment-proofs'

type JoinRequestStatus = 'new' | 'verified' | 'rejected' | 'waitlisted'

type JoinRequestQuery = {
  status?: 'all' | JoinRequestStatus
  search?: string
  sort?: 'newest' | 'oldest'
}

export type JoinRequestRecord = {
  id: string
  batch_id: string
  full_name: string
  phone: string
  payment_proof_url: string
  status: 'new' | 'verified' | 'rejected' | 'waitlisted'
  notes: string | null
  internal_notes: string | null
  created_at: string
  batches: { name: string } | null
}

export async function getJoinRequests(options: JoinRequestQuery = {}) {
  const supabase = createSupabaseAdminClient()
  let query = supabase
    .from('join_requests')
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,internal_notes,created_at,batches(name)')

  if (options.status && options.status !== 'all') {
    query = query.eq('status', options.status)
  }

  if (options.search?.trim()) {
    const search = options.search.trim()
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  const ascending = options.sort === 'oldest'

  const { data, error } = await query
    .order('created_at', { ascending })
    .returns<JoinRequestRecord[]>()

  if (error) throw error
  return data || []
}

export async function getJoinRequestStats() {
  const supabase = createSupabaseAdminClient()

  const [newResult, verifiedResult, rejectedResult, waitlistedResult] = await Promise.all([
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('status', 'verified'),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('status', 'waitlisted'),
  ])

  if (newResult.error) throw newResult.error
  if (verifiedResult.error) throw verifiedResult.error
  if (rejectedResult.error) throw rejectedResult.error
  if (waitlistedResult.error) throw waitlistedResult.error

  return {
    newCount: newResult.count || 0,
    verifiedCount: verifiedResult.count || 0,
    rejectedCount: rejectedResult.count || 0,
    waitlistedCount: waitlistedResult.count || 0,
  }
}

export async function getJoinRequestStatsByBatch(batchId: string) {
  const supabase = createSupabaseAdminClient()

  const [totalResult, newResult, verifiedResult, waitlistedResult] = await Promise.all([
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('batch_id', batchId),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('batch_id', batchId).eq('status', 'new'),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('batch_id', batchId).eq('status', 'verified'),
    supabase.from('join_requests').select('id', { count: 'exact', head: true }).eq('batch_id', batchId).eq('status', 'waitlisted'),
  ])

  if (totalResult.error) throw totalResult.error
  if (newResult.error) throw newResult.error
  if (verifiedResult.error) throw verifiedResult.error
  if (waitlistedResult.error) throw waitlistedResult.error

  return {
    total: totalResult.count || 0,
    newCount: newResult.count || 0,
    verifiedCount: verifiedResult.count || 0,
    waitlistedCount: waitlistedResult.count || 0,
  }
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
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,internal_notes,created_at')
    .single()

  if (error) throw error
  return data
}

export async function updateJoinRequestReview(
  requestId: string,
  input: {
    status: 'new' | 'verified' | 'rejected' | 'waitlisted'
    internalNotes: string | null
  }
) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .update({
      status: input.status,
      internal_notes: input.internalNotes,
    })
    .eq('id', requestId)
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,internal_notes,created_at,batches(name)')
    .single<JoinRequestRecord>()

  if (error) throw error
  return data
}

export async function getJoinRequestById(requestId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('join_requests')
    .select('id,batch_id,full_name,phone,payment_proof_url,status,notes,internal_notes,created_at,batches(name)')
    .eq('id', requestId)
    .single<JoinRequestRecord>()

  if (error) return null
  return data
}

export async function getPaymentProofSignedUrl(storagePath: string) {
  return createPaymentProofSignedUrl(storagePath, 60)
}

export function toJoinRequestsCsv(rows: JoinRequestRecord[]) {
  const headers = [
    'created_at',
    'batch_name',
    'full_name',
    'phone',
    'status',
    'notes',
    'internal_notes',
    'payment_proof_url',
  ]

  const escape = (value: string | null | undefined) => `"${(value ?? '').replaceAll('"', '""')}"`

  const lines = rows.map((row) =>
    [
      row.created_at,
      row.batches?.name || '',
      row.full_name,
      row.phone,
      row.status,
      row.notes,
      row.internal_notes,
      row.payment_proof_url,
    ]
      .map((value) => escape(value))
      .join(',')
  )

  return [headers.join(','), ...lines].join('\n')
}
