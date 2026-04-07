export type BatchStatus = 'open' | 'running' | 'closed'

export type SupabaseScriptEnv = {
  supabaseUrl: string
  supabaseServiceRoleKey: string
  adminUsername: string
  adminPassword: string
}

export type ImportSummary = {
  batchCount: number
  holidayCount: number
  slotCount: number
  activeBatchName: string
}
