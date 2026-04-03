import 'dotenv/config'
import { loadMigrationEnv } from './lib/env'
import { createGoogleSheetsClient, loadBatchConfig, loadHolidays, loadMonthSheets } from './lib/google-sheets'
import { buildBatchName, deriveDateRange, deriveIndonesianDayName, extractMonthName, normalizeAndSortMenuRows } from './lib/normalize'
import { clearActiveBatchFlags, createSupabaseAdminClient, replaceBatchSlots, setActiveBatch, upsertBatch, upsertHolidays, verifyImport } from './lib/supabase-admin'
import type { BatchConfig, BatchInsert, MonthSheet, SlotInsert } from './lib/types'

function resolveActiveSheetName(batchConfig: BatchConfig, sheets: MonthSheet[]): string {
  const explicitMonth = extractMonthName(batchConfig.currentBatchLabel)

  if (explicitMonth && sheets.some((sheet) => sheet.sheetName === explicitMonth)) {
    return explicitMonth
  }

  const sorted = [...sheets].sort((a, b) => {
    const aDate = a.rows[0]?.date || ''
    const bDate = b.rows[0]?.date || ''
    return aDate.localeCompare(bDate)
  })

  const fallback = sorted[sorted.length - 1]?.sheetName

  if (!fallback) {
    throw new Error('Unable to resolve active sheet name')
  }

  console.warn(`Active sheet inferred as ${fallback}`)
  return fallback
}

function buildBatchInsert(sheet: MonthSheet, batchConfig: BatchConfig, activeSheetName: string): BatchInsert {
  const rows = normalizeAndSortMenuRows(sheet.rows)
  const { startDate, endDate } = deriveDateRange(rows)
  const year = startDate.slice(0, 4)
  const isActive = sheet.sheetName === activeSheetName

  return {
    name: buildBatchName(sheet.sheetName, year, batchConfig.currentBatchLabel, isActive),
    status: isActive ? batchConfig.batchStatus : 'closed',
    deadline_join: isActive ? batchConfig.deadlineJoin : null,
    remaining_quota: isActive ? batchConfig.remainingQuota : null,
    next_batch_open: isActive ? batchConfig.nextBatchOpen : null,
    next_batch_label: isActive ? batchConfig.nextBatchLabel : null,
    start_date: startDate,
    end_date: endDate,
    source_month: sheet.sheetName,
    notes: null,
    is_active: isActive,
  }
}

function buildSlotInserts(batchId: string, sheet: MonthSheet): SlotInsert[] {
  return normalizeAndSortMenuRows(sheet.rows).map((row, index) => ({
    batch_id: batchId,
    date: row.date,
    day_name: row.dayName || deriveIndonesianDayName(row.date),
    main_course: row.mainCourse || null,
    side_dish: row.sideDish || null,
    extra: row.extra || null,
    image_url: row.imageUrl || null,
    is_available: row.isAvailable,
    label: row.label || null,
    sort_order: index,
  }))
}

async function main() {
  const env = loadMigrationEnv()
  const supabase = createSupabaseAdminClient(env)
  const sheets = createGoogleSheetsClient(env)

  console.log('Loading source data...')
  const [batchConfig, holidays, monthSheets] = await Promise.all([
    loadBatchConfig(sheets, env.googleSpreadsheetId),
    loadHolidays(sheets, env.googleSpreadsheetId),
    loadMonthSheets(sheets, env.googleSpreadsheetId),
  ])

  if (monthSheets.length === 0) {
    throw new Error('No month sheets found')
  }

  const activeSheetName = resolveActiveSheetName(batchConfig, monthSheets)
  console.log(`Active sheet resolved: ${activeSheetName}`)

  console.log('Importing holidays...')
  await upsertHolidays(supabase, holidays)

  console.log('Resetting active flags...')
  await clearActiveBatchFlags(supabase)

  const batchIdByMonth = new Map<string, string>()

  console.log('Importing batches...')
  for (const sheet of monthSheets) {
    const batchInsert = buildBatchInsert(sheet, batchConfig, activeSheetName)
    const batchId = await upsertBatch(supabase, batchInsert)
    batchIdByMonth.set(sheet.sheetName, batchId)
  }

  console.log('Importing slots...')
  for (const sheet of monthSheets) {
    const batchId = batchIdByMonth.get(sheet.sheetName)

    if (!batchId) {
      throw new Error(`Missing batch id for ${sheet.sheetName}`)
    }

    const slots = buildSlotInserts(batchId, sheet)
    await replaceBatchSlots(supabase, batchId, slots)
  }

  const activeBatchId = batchIdByMonth.get(activeSheetName)

  if (!activeBatchId) {
    throw new Error('Missing active batch id after import')
  }

  console.log('Setting active batch...')
  await setActiveBatch(supabase, activeBatchId)

  console.log('Verifying import...')
  const summary = await verifyImport(supabase)

  console.table({
    activeSheetName,
    importedBatches: summary.batchCount,
    importedSlots: summary.slotCount,
    importedHolidays: summary.holidayCount,
    activeBatchDbName: summary.activeBatchName,
  })
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
