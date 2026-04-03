export type MenuItem = {
  date: string
  dayName: string
  mainCourse: string
  sideDish: string
  extra: string
  imageUrl: string
  isAvailable: boolean
  label: string
}

export type MenuApiResponse = {
  success: boolean
  message?: string
  meta?: Record<string, unknown>
  data?: MenuItem[]
}

export type BatchSummary = {
  firstDate: string
  lastDate: string
  totalSlots: number
  activeSlots: number
}

export type BatchMeta = {
  batchStatus: 'open' | 'running' | 'closed'
  currentBatchLabel: string | null
  deadlineJoin: string | null
  remainingQuota: number | null
  nextBatchOpen: string | null
  nextBatchLabel: string | null
}

export type NormalizedMenuPayload = {
  items: MenuItem[]
  batchMeta: BatchMeta
}

const WHATSAPP_NUMBER = '6285183248797'

export function normalizeMenuResponse(payload: unknown): NormalizedMenuPayload {
  if (!payload || typeof payload !== 'object' || !(payload as MenuApiResponse).success) {
    return {
      items: [],
      batchMeta: emptyBatchMeta(),
    }
  }

  const source = payload as MenuApiResponse
  const data = source.data

  if (!Array.isArray(data)) {
    return {
      items: [],
      batchMeta: normalizeBatchMeta(source.meta, []),
    }
  }

  const items = data
    .map(normalizeMenuItem)
    .filter((item) => item.date)
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    items,
    batchMeta: normalizeBatchMeta(source.meta, items),
  }
}

export function normalizeMenuItem(item: unknown): MenuItem {
  const source = item && typeof item === 'object' ? (item as Record<string, unknown>) : {}

  return {
    date: asString(source.date),
    dayName: asString(source.dayName),
    mainCourse: asString(source.mainCourse),
    sideDish: asString(source.sideDish),
    extra: asString(source.extra),
    imageUrl: asString(source.imageUrl),
    isAvailable: Boolean(source.isAvailable),
    label: asString(source.label),
  }
}

export function formatMenuDateLong(date: string): string {
  const parsed = parseMenuDate(date)
  if (!parsed) return date

  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export function formatMenuDateShort(date: string): string {
  const parsed = parseMenuDate(date)
  if (!parsed) return date

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(parsed)
}

export function formatMenuDayAndDate(date: string, dayName: string): string {
  const parsed = parseMenuDate(date)
  if (!parsed) return [dayName, date].filter(Boolean).join(', ')

  const prettyDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
  }).format(parsed)

  return [dayName, prettyDate].filter(Boolean).join(', ')
}

export function buildWhatsAppMenuUrl(item: MenuItem, batch?: BatchSummary | null): string {
  const batchLine = batch
    ? `Saya ingin ikut batch aktif periode ${formatBatchRange(batch)}.`
    : 'Saya ingin ikut batch catering yang sedang aktif.'

  const text = [
    'Halo Tameroll, saya ingin pre-order catering.',
    batchLine,
    `Saya tertarik dengan slot ${formatMenuDayAndDate(item.date, item.dayName)}.`,
    item.mainCourse ? `Referensi menu: ${item.mainCourse}.` : '',
    'Mohon info mekanisme join batch, deadline, dan proses pembayarannya.',
  ]
    .filter(Boolean)
    .join('\n')

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function buildBatchActionWhatsAppUrl(
  batchMeta: BatchMeta,
  batchSummary: BatchSummary | null,
  item?: MenuItem | null
): string {
  const period = batchSummary ? formatBatchRange(batchSummary) : 'batch aktif saat ini'
  const slotReference = item
    ? `Saya melihat referensi menu di slot ${formatMenuDayAndDate(item.date, item.dayName)}${item.mainCourse ? ` dengan menu ${item.mainCourse}` : ''}.`
    : ''

  const textByStatus = {
    open: [
      'Halo Tameroll, saya ingin konfirmasi join batch catering aktif.',
      batchMeta.currentBatchLabel ? `Batch: ${batchMeta.currentBatchLabel}.` : `Periode: ${period}.`,
      slotReference,
      'Mohon info kuota, deadline join, dan proses pembayarannya.',
    ],
    running: [
      'Halo Tameroll, saya melihat batch catering saat ini sudah berjalan.',
      batchMeta.currentBatchLabel ? `Batch saat ini: ${batchMeta.currentBatchLabel}.` : `Batch saat ini: ${period}.`,
      slotReference,
      'Saya ingin masuk waiting list untuk batch berikutnya. Mohon info jadwal pembukaannya.',
    ],
    closed: [
      'Halo Tameroll, saya melihat batch catering saat ini sudah ditutup.',
      batchMeta.currentBatchLabel ? `Batch terakhir: ${batchMeta.currentBatchLabel}.` : `Batch terakhir: ${period}.`,
      slotReference,
      'Mohon bantu masukkan saya ke waiting list dan infokan pembukaan batch berikutnya.',
    ],
  }

  return buildWhatsAppFallbackUrl(textByStatus[batchMeta.batchStatus].filter(Boolean).join('\n'))
}

export function buildWhatsAppFallbackUrl(message?: string): string {
  const text =
    message ||
    'Halo Tameroll, saya ingin bertanya tentang batch pre-order catering yang sedang aktif.'

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

export function getBatchSummary(items: MenuItem[]): BatchSummary | null {
  if (items.length === 0) return null

  const activeSlots = items.filter((item) => item.isAvailable).length

  return {
    firstDate: items[0].date,
    lastDate: items[items.length - 1].date,
    totalSlots: items.length,
    activeSlots,
  }
}

export function formatBatchRange(batch: BatchSummary): string {
  return `${formatMenuDateShort(batch.firstDate)} - ${formatMenuDateLong(batch.lastDate)}`
}

export function formatOptionalLongDate(date: string | null): string | null {
  if (!date) return null
  return formatMenuDateLong(date)
}

export function getBatchStatusLabel(status: BatchMeta['batchStatus']): string {
  if (status === 'running') return 'Batch Sedang Berjalan'
  if (status === 'closed') return 'Batch Ditutup'
  return 'Batch Dibuka'
}

export function getBatchStatusCopy(status: BatchMeta['batchStatus']): string {
  if (status === 'running') {
    return 'Batch ini sudah berjalan. Pendaftaran baru diarahkan ke batch berikutnya melalui waiting list.'
  }

  if (status === 'closed') {
    return 'Batch ini sudah ditutup. Silakan tunggu pembukaan batch berikutnya atau masuk ke waiting list.'
  }

  return 'Batch aktif masih membuka konfirmasi peserta. Pilih slot referensi menu lalu lanjut konfirmasi melalui WhatsApp.'
}

export function isBatchJoinOpen(status: BatchMeta['batchStatus']): boolean {
  return status === 'open'
}

export function getWorkdayGrid(items: MenuItem[]): MenuItem[][] {
  const rows: MenuItem[][] = []

  for (let i = 0; i < items.length; i += 5) {
    rows.push(items.slice(i, i + 5))
  }

  return rows
}

export function hasMenuDetails(item: MenuItem): boolean {
  return Boolean(item.mainCourse || item.sideDish || item.extra)
}

function asString(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function asNullableString(value: unknown): string | null {
  const result = asString(value)
  return result || null
}

function normalizeBatchMeta(rawMeta: Record<string, unknown> | undefined, items: MenuItem[]): BatchMeta {
  const batchStatus = normalizeBatchStatus(rawMeta?.batchStatus)
  const currentBatchLabel = asNullableString(rawMeta?.currentBatchLabel)
  const deadlineJoin = normalizeDateLike(rawMeta?.deadlineJoin) ?? deriveDeadlineJoin(items)
  const remainingQuota = asNullableNumber(rawMeta?.remainingQuota)
  const nextBatchOpen = normalizeDateLike(rawMeta?.nextBatchOpen) ?? deriveNextBatchOpen(items)
  const nextBatchLabel = asNullableString(rawMeta?.nextBatchLabel)

  return {
    batchStatus,
    currentBatchLabel,
    deadlineJoin,
    remainingQuota,
    nextBatchOpen,
    nextBatchLabel,
  }
}

function emptyBatchMeta(): BatchMeta {
  return {
    batchStatus: 'open',
    currentBatchLabel: 'Batch Aktif',
    deadlineJoin: null,
    remainingQuota: null,
    nextBatchOpen: null,
    nextBatchLabel: null,
  }
}

function normalizeBatchStatus(value: unknown): BatchMeta['batchStatus'] {
  const status = asString(value).toLowerCase()
  if (status === 'running' || status === 'closed') return status
  return 'open'
}

function normalizeDateLike(value: unknown): string | null {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return value.trim()
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatDateForApi(value)
  }

  return null
}

function deriveDeadlineJoin(items: MenuItem[]): string | null {
  const firstActive = items.find((item) => item.isAvailable)
  const parsed = firstActive ? parseMenuDate(firstActive.date) : null

  if (!parsed) return null

  parsed.setDate(parsed.getDate() - 1)
  return formatDateForApi(parsed)
}

function deriveNextBatchOpen(items: MenuItem[]): string | null {
  if (items.length === 0) return null

  const parsed = parseMenuDate(items[items.length - 1].date)
  if (!parsed) return null

  parsed.setDate(parsed.getDate() + 1)

  while (parsed.getDay() === 0 || parsed.getDay() === 6) {
    parsed.setDate(parsed.getDate() + 1)
  }

  return formatDateForApi(parsed)
}

function asNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value

  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseMenuDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}
