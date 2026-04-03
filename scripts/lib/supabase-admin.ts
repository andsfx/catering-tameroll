import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { BatchInsert, HolidayRow, ImportSummary, MigrationEnv, SlotInsert } from './types'

export function createSupabaseAdminClient(env: MigrationEnv): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function upsertHolidays(supabase: SupabaseClient, holidays: HolidayRow[]) {
  if (holidays.length === 0) return

  const { error } = await supabase.from('holidays').upsert(holidays, { onConflict: 'date' })
  if (error) throw error
}

export async function upsertBatch(supabase: SupabaseClient, batch: BatchInsert): Promise<string> {
  const { data, error } = await supabase
    .from('batches')
    .upsert(batch, { onConflict: 'source_month' })
    .select('id')
    .single()

  if (error || !data) throw error || new Error('Failed to upsert batch')

  return data.id as string
}

export async function replaceBatchSlots(supabase: SupabaseClient, batchId: string, slots: SlotInsert[]) {
  const remove = await supabase.from('batch_slots').delete().eq('batch_id', batchId)
  if (remove.error) throw remove.error

  if (slots.length === 0) return

  const insert = await supabase.from('batch_slots').insert(slots)
  if (insert.error) throw insert.error
}

export async function clearActiveBatchFlags(supabase: SupabaseClient) {
  const { error } = await supabase
    .from('batches')
    .update({ is_active: false })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) throw error
}

export async function setActiveBatch(supabase: SupabaseClient, batchId: string) {
  const { error } = await supabase.from('batches').update({ is_active: true }).eq('id', batchId)
  if (error) throw error
}

export async function verifyImport(supabase: SupabaseClient): Promise<ImportSummary> {
  const [batchesResult, holidaysResult, slotsResult] = await Promise.all([
    supabase.from('batches').select('id,name,is_active'),
    supabase.from('holidays').select('id', { count: 'exact', head: true }),
    supabase.from('batch_slots').select('id', { count: 'exact', head: true }),
  ])

  if (batchesResult.error) throw batchesResult.error
  if (holidaysResult.error) throw holidaysResult.error
  if (slotsResult.error) throw slotsResult.error

  const activeBatch = batchesResult.data?.find((batch) => batch.is_active)

  if (!activeBatch) {
    throw new Error('No active batch found after migration')
  }

  return {
    batchCount: batchesResult.data?.length || 0,
    holidayCount: holidaysResult.count || 0,
    slotCount: slotsResult.count || 0,
    activeBatchName: activeBatch.name as string,
  }
}
