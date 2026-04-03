const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const

export function isMonthSheetName(name: string): boolean {
  return monthNames.includes(name as (typeof monthNames)[number])
}

export function getMonthIndex(name: string): number | null {
  const index = monthNames.indexOf(name as (typeof monthNames)[number])
  return index === -1 ? null : index
}

export function buildDefaultBatchName(sheetName: string, year: string): string {
  return `Batch ${sheetName} ${year}`
}

export const indonesianMonthNames = monthNames
