import { google, type sheets_v4 } from 'googleapis'
import { buildBatchConfig, normalizeBoolean, normalizeDate, normalizeNumber, safeString } from './normalize'
import { isMonthSheetName } from './months'
import type { BatchConfig, HolidayRow, MenuRow, MigrationEnv, MonthSheet } from './types'

type GoogleSheetsClient = sheets_v4.Sheets

export function createGoogleSheetsClient(env: MigrationEnv): GoogleSheetsClient {
  const auth = new google.auth.JWT({
    email: env.googleServiceAccountEmail,
    key: env.googlePrivateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  return google.sheets({ version: 'v4', auth })
}

export async function listSheetTitles(client: GoogleSheetsClient, spreadsheetId: string): Promise<string[]> {
  const response = await client.spreadsheets.get({ spreadsheetId })
  return (
    response.data.sheets
      ?.map((sheet) => sheet.properties?.title)
      .filter((value): value is string => Boolean(value)) || []
  )
}

export async function readSheetRows(
  client: GoogleSheetsClient,
  spreadsheetId: string,
  sheetName: string
): Promise<Record<string, unknown>[]> {
  const response = await client.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}`,
  })

  const rows = response.data.values || []
  if (rows.length < 2) return []

  const headers = rows[0].map((header) => safeString(header))
  const body = rows.slice(1)

  return body.map((row) => {
    const record: Record<string, unknown> = {}
    headers.forEach((header, index) => {
      record[header] = row[index]
    })
    return record
  })
}

export async function loadBatchConfig(client: GoogleSheetsClient, spreadsheetId: string): Promise<BatchConfig> {
  const rows = await readSheetRows(client, spreadsheetId, 'BatchConfig')
  const map: Record<string, unknown> = {}

  rows.forEach((row) => {
    const key = safeString(row.key)
    if (!key) return
    map[key] = row.value
  })

  return buildBatchConfig(map)
}

export async function loadHolidays(client: GoogleSheetsClient, spreadsheetId: string): Promise<HolidayRow[]> {
  const rows = await readSheetRows(client, spreadsheetId, 'Holidays')

  return rows
    .map((row) => ({
      date: normalizeDate(row.date) || '',
      name: safeString(row.name),
      type: safeString(row.type),
    }))
    .filter((row) => row.date && row.name)
}

export async function loadMonthSheets(client: GoogleSheetsClient, spreadsheetId: string): Promise<MonthSheet[]> {
  const titles = await listSheetTitles(client, spreadsheetId)
  const monthTitles = titles.filter(isMonthSheetName)
  const results: MonthSheet[] = []

  for (const sheetName of monthTitles) {
    const rows = await readSheetRows(client, spreadsheetId, sheetName)
    const normalizedRows: MenuRow[] = rows
      .map((row) => ({
        date: normalizeDate(row.date) || '',
        dayName: safeString(row.dayName),
        mainCourse: safeString(row.mainCourse),
        sideDish: safeString(row.sideDish),
        extra: safeString(row.extra),
        imageUrl: safeString(row.imageUrl),
        isAvailable: normalizeBoolean(row.isAvailable),
        label: safeString(row.label),
      }))
      .filter((row) => Boolean(row.date))

    results.push({ sheetName, rows: normalizedRows })
  }

  return results
}
