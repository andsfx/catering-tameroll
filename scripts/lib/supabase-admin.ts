import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ImportSummary, SupabaseScriptEnv } from './types'

export function createSupabaseAdminClient(env: Pick<SupabaseScriptEnv, 'supabaseUrl' | 'supabaseServiceRoleKey'>): SupabaseClient {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
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
