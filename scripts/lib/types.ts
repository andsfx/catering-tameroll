export type BatchStatus = 'open' | 'running' | 'closed'

export type MigrationEnv = {
  supabaseUrl: string
  supabaseServiceRoleKey: string
  googleSpreadsheetId: string
  googleServiceAccountEmail: string
  googlePrivateKey: string
  adminUsername: string
  adminPassword: string
}

export type SupabaseScriptEnv = {
  supabaseUrl: string
  supabaseServiceRoleKey: string
  adminUsername: string
  adminPassword: string
}

export type BatchConfig = {
  batchStatus: BatchStatus
  currentBatchLabel: string | null
  deadlineJoin: string | null
  remainingQuota: number | null
  nextBatchOpen: string | null
  nextBatchLabel: string | null
}

export type HolidayRow = {
  date: string
  name: string
  type: string
}

export type MenuRow = {
  date: string
  dayName: string
  mainCourse: string
  sideDish: string
  extra: string
  imageUrl: string
  isAvailable: boolean
  label: string
}

export type MonthSheet = {
  sheetName: string
  rows: MenuRow[]
}

export type BatchInsert = {
  name: string
  status: BatchStatus
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

export type SlotInsert = {
  batch_id: string
  date: string
  day_name: string
  main_course: string | null
  side_dish: string | null
  extra: string | null
  image_url: string | null
  is_available: boolean
  label: string | null
  sort_order: number
}

export type ImportSummary = {
  batchCount: number
  holidayCount: number
  slotCount: number
  activeBatchName: string
}
