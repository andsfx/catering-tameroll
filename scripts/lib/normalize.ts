import { buildDefaultBatchName, indonesianMonthNames } from './months'
import type { BatchConfig, BatchStatus, MenuRow } from './types'

export function safeString(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

export function asNullableString(value: unknown): string | null {
  const normalized = safeString(value)
  return normalized || null
}

export function normalizeDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return toDateKey(value)
  }

  const raw = safeString(value)
  if (!raw) return null

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return toDateKey(parsed)
}

export function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value

  const normalized = safeString(value).toLowerCase()
  return ['true', '1', 'yes', 'ya'].includes(normalized)
}

export function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const raw = safeString(value)
  if (!raw) return null

  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

export function normalizeBatchStatus(value: unknown): BatchStatus {
  const normalized = safeString(value).toLowerCase()
  if (normalized === 'running' || normalized === 'closed') return normalized
  return 'open'
}

export function normalizeAndSortMenuRows(rows: MenuRow[]): MenuRow[] {
  return rows
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function deriveDateRange(rows: MenuRow[]): { startDate: string; endDate: string } {
  if (rows.length === 0) {
    throw new Error('Cannot derive date range from empty rows')
  }

  const sorted = normalizeAndSortMenuRows(rows)

  return {
    startDate: sorted[0].date,
    endDate: sorted[sorted.length - 1].date,
  }
}

export function deriveIndonesianDayName(date: string): string {
  const parsed = new Date(date)
  const names = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return names[parsed.getDay()] || ''
}

export function extractMonthName(label: string | null): string | null {
  if (!label) return null

  const lower = label.toLowerCase()
  const month = indonesianMonthNames.find((name) => lower.includes(name.toLowerCase()))
  return month || null
}

export function buildBatchConfig(raw: Record<string, unknown>): BatchConfig {
  return {
    batchStatus: normalizeBatchStatus(raw.batchStatus),
    currentBatchLabel: asNullableString(raw.currentBatchLabel),
    deadlineJoin: normalizeDate(raw.deadlineJoin),
    remainingQuota: normalizeNumber(raw.remainingQuota),
    nextBatchOpen: normalizeDate(raw.nextBatchOpen),
    nextBatchLabel: asNullableString(raw.nextBatchLabel),
  }
}

export function buildBatchName(sheetName: string, year: string, currentBatchLabel: string | null, isActive: boolean): string {
  if (isActive && currentBatchLabel) return currentBatchLabel
  return buildDefaultBatchName(sheetName, year)
}

function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
