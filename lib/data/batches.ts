import { createSupabaseAdminClient } from '@/lib/supabase/admin'

export type BatchRecord = {
  id: string
  name: string
  status: 'open' | 'running' | 'closed'
  deadline_join: string | null
  remaining_quota: number | null
  next_batch_open: string | null
  next_batch_label: string | null
  start_date: string
  end_date: string
  source_month: string
  notes: string | null
  is_active: boolean
}

export async function getAllBatches() {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('batches')
    .select('id,name,status,deadline_join,remaining_quota,next_batch_open,next_batch_label,start_date,end_date,source_month,notes,is_active')
    .order('start_date', { ascending: false })
    .returns<BatchRecord[]>()

  if (error) throw error
  return data || []
}

export async function getBatchById(batchId: string) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('batches')
    .select('id,name,status,deadline_join,remaining_quota,next_batch_open,next_batch_label,start_date,end_date,source_month,notes,is_active')
    .eq('id', batchId)
    .single<BatchRecord>()

  if (error) return null
  return data
}

export async function updateBatch(
  batchId: string,
  input: Partial<{
    name: string
    status: 'open' | 'running' | 'closed'
    deadline_join: string | null
    remaining_quota: number | null
    next_batch_open: string | null
    next_batch_label: string | null
    notes: string | null
    is_active: boolean
  }>
) {
  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('batches')
    .update(input)
    .eq('id', batchId)
    .select('id,name,status,deadline_join,remaining_quota,next_batch_open,next_batch_label,start_date,end_date,source_month,notes,is_active')
    .single<BatchRecord>()

  if (error) throw error
  return data
}

export async function setActiveBatch(batchId: string) {
  const supabase = createSupabaseAdminClient()
  const clear = await supabase
    .from('batches')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (clear.error) throw clear.error

  const activate = await supabase.from('batches').update({ is_active: true }).eq('id', batchId)
  if (activate.error) throw activate.error
}
