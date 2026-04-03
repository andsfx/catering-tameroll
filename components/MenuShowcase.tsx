'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import MenuCalendar from '@/components/menu/MenuCalendar'
import MenuDetailModal from '@/components/menu/MenuDetailModal'
import MenuEmptyState from '@/components/menu/MenuEmptyState'
import MenuErrorState from '@/components/menu/MenuErrorState'
import MenuSkeleton from '@/components/menu/MenuSkeleton'
import WeeklyMenuList from '@/components/menu/WeeklyMenuList'
import {
  buildBatchActionWhatsAppUrl,
  buildWhatsAppFallbackUrl,
  formatOptionalLongDate,
  type BatchMeta,
  formatBatchRange,
  getBatchStatusCopy,
  getBatchStatusLabel,
  getBatchSummary,
  hasMenuDetails,
  isBatchJoinOpen,
  normalizeMenuResponse,
  type MenuItem,
} from '@/lib/menu'

const MENU_API_URL =
  process.env.NEXT_PUBLIC_MENU_API_URL ||
  'https://script.google.com/macros/s/AKfycbxWUPRUQcCVJekUy5vd03ksKM_Cw0KQKslUyLiXklQRzaSn2Z-GmKqCKc7QuYKjTHwR/exec'

export default function MenuSection() {
  const { ref, inView } = useInView(0.1)
  const [items, setItems] = useState<MenuItem[]>([])
  const [batchMeta, setBatchMeta] = useState<BatchMeta>({
    batchStatus: 'open',
    currentBatchLabel: 'Batch Aktif',
    deadlineJoin: null,
    remainingQuota: null,
    nextBatchOpen: null,
    nextBatchLabel: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const fetchMenu = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${MENU_API_URL}?count=20`, { cache: 'no-store' })

      if (!response.ok) {
        throw new Error('Failed to fetch menu data')
      }

      const payload = await response.json()
      const normalized = normalizeMenuResponse(payload)
      setItems(normalized.items)
      setBatchMeta(normalized.batchMeta)
    } catch {
      setError('Gagal memuat menu terbaru. Silakan hubungi admin via WhatsApp.')
      setItems([])
      setBatchMeta({
        batchStatus: 'open',
        currentBatchLabel: 'Batch Aktif',
        deadlineJoin: null,
        remainingQuota: null,
        nextBatchOpen: null,
        nextBatchLabel: null,
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMenu()
  }, [fetchMenu])

  const fallbackWhatsappUrl = buildWhatsAppFallbackUrl()
  const batchSummary = getBatchSummary(items)
  const deadlineLabel = formatOptionalLongDate(batchMeta.deadlineJoin)
  const nextBatchLabel = formatOptionalLongDate(batchMeta.nextBatchOpen)
  const statusLabel = getBatchStatusLabel(batchMeta.batchStatus)
  const statusCopy = getBatchStatusCopy(batchMeta.batchStatus)
  const batchJoinUrl = buildBatchActionWhatsAppUrl(batchMeta, batchSummary)
  const waitingListUrl = buildWhatsAppFallbackUrl(
    'Halo Tameroll, saya ingin masuk waiting list untuk batch catering berikutnya. Mohon info jadwal pembukaan batch selanjutnya.'
  )
  const batchOpen = isBatchJoinOpen(batchMeta.batchStatus)

  return (
    <section id="menu" className="bg-[#FDFBF7] py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-4xl text-center sm:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D35400]/20 bg-[#D35400]/5 px-4 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-[#D35400]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Batch Pre-Order
            </span>
          </div>
          <h2 className="mb-4 font-serif text-3xl leading-[1.08] tracking-[-0.02em] text-[#2C3E50] sm:text-4xl lg:text-5xl">
            Batch Catering <span className="text-[#D35400]">4 Minggu Kerja</span>
          </h2>
          <p className="mx-auto max-w-3xl text-[15px] leading-8 text-charcoal-600 sm:text-lg">
            Menu 4 minggu ini adalah referensi slot dalam sistem batch. Calon customer wajib konfirmasi via WhatsApp sebelum bergabung ke batch yang sedang dibuka.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="space-y-8"
        >
          {loading ? <MenuSkeleton /> : null}

          {!loading && error ? (
            <MenuErrorState onRetry={fetchMenu} whatsappUrl={fallbackWhatsappUrl} />
          ) : null}

          {!loading && !error && items.length === 0 ? (
            <MenuEmptyState whatsappUrl={fallbackWhatsappUrl} />
          ) : null}

          {!loading && !error && items.length > 0 ? (
            <>
              {batchSummary ? (
                <div className="rounded-[12px] border border-[#D35400]/15 bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_60%)] p-5 shadow-[0_10px_30px_rgba(211,84,0,0.08)] sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
                        Batch Aktif Saat Ini
                      </p>
                      <h3 className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.15rem]">
                        {batchMeta.currentBatchLabel || formatBatchRange(batchSummary)}
                      </h3>
                      <div className="mt-3 inline-flex rounded-full border border-[#D35400]/15 bg-[#D35400]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D35400]">
                        {statusLabel}
                      </div>
                      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-charcoal-600 sm:text-base">
                        {statusCopy}
                      </p>
                      <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                            Deadline Join
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-[#2C3E50] sm:text-base">
                            {deadlineLabel || 'Segera dikonfirmasi admin'}
                          </p>
                        </div>
                        <div className="rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                            Kuota Tersisa
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-[#2C3E50] sm:text-base">
                            {batchMeta.remainingQuota !== null ? `${batchMeta.remainingQuota} slot` : 'Cek via admin'}
                          </p>
                        </div>
                        <div className="rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 shadow-sm">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal-400">
                            Batch Berikutnya
                          </p>
                          <p className="mt-2 text-sm font-semibold leading-6 text-[#2C3E50] sm:text-base">
                            {nextBatchLabel || 'Akan diumumkan'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-end">
                      <div className="flex flex-wrap gap-3 text-sm text-charcoal-600 lg:justify-end">
                        <span className="rounded-full border border-[#ece7de] bg-white px-4 py-2 shadow-sm">
                          4 minggu kerja
                        </span>
                        <span className="rounded-full bg-[#faf9f6] px-4 py-2">
                        {batchSummary.totalSlots} slot kerja
                        </span>
                        <span className="rounded-full bg-[#D35400]/10 px-4 py-2 font-semibold text-[#D35400]">
                        {batchSummary.activeSlots} slot siap dipilih
                        </span>
                      </div>
                      {batchOpen ? (
                        <a
                          href={batchJoinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]"
                        >
                          Konfirmasi Join Batch
                        </a>
                      ) : (
                        <>
                          <div className="inline-flex items-center justify-center rounded-[12px] border border-charcoal-200 bg-white px-5 py-3 text-sm font-bold text-charcoal-500">
                            {statusLabel}
                          </div>
                          <a
                            href={waitingListUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-[12px] bg-[#2C3E50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#223240]"
                          >
                            Masuk Waiting List Batch Berikutnya
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {(batchMeta.nextBatchOpen || batchMeta.nextBatchLabel) && (
                <div className="rounded-[12px] border border-charcoal-200 bg-white px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-500">
                        Informasi Batch Berikutnya
                      </p>
                      <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#2C3E50] sm:text-base">
                        {batchMeta.nextBatchLabel
                          ? batchMeta.nextBatchLabel
                          : `Batch berikutnya diperkirakan dibuka pada ${nextBatchLabel}.`}
                      </p>
                    </div>
                    <a
                      href={waitingListUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                    >
                      Masuk Waiting List
                    </a>
                  </div>
                </div>
              )}

              <WeeklyMenuList items={items} onSelect={setSelectedItem} />
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-[1.85rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.1rem]">
                      Timeline Batch 4 Minggu
                    </h3>
                    <p className="mt-1 text-[15px] leading-7 text-charcoal-600 sm:text-base">
                      Tiap panel merangkum satu minggu kerja dalam batch aktif. Pilih slot yang terbuka untuk melihat referensi menu dan lanjut gabung ke batch pre-order.
                    </p>
                  </div>
                </div>
                <MenuCalendar items={items} onSelect={setSelectedItem} />
              </div>
            </>
          ) : null}
        </motion.div>
      </div>

      <MenuDetailModal
        item={selectedItem && hasMenuDetails(selectedItem) ? selectedItem : null}
        batchSummary={batchSummary}
        batchMeta={batchMeta}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  )
}
