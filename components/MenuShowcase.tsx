'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
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

const MENU_API_URL = '/api/public-menu'

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
      const response = await fetch(MENU_API_URL, { cache: 'no-store' })

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
  const timelineCopy = batchOpen
    ? 'Tiap panel merangkum satu minggu kerja dalam batch aktif. Pilih slot referensi menu yang paling sesuai lalu lanjut konfirmasi ke admin.'
    : 'Tiap panel merangkum referensi menu untuk batch saat ini. Karena batch tidak menerima peserta baru, gunakan informasi ini untuk mempertimbangkan waiting list batch berikutnya.'

  return (
    <section id="menu" className="bg-[#FDFBF7] py-20 sm:py-28" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
                <div className="rounded-[18px] border border-[#D35400]/15 bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_55%,#fff9f4_100%)] p-5 shadow-[0_18px_48px_rgba(211,84,0,0.12)] sm:p-7">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
                        Detail Batch Aktif
                      </p>
                      <h3 className="mt-2 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.15rem]">
                        {batchMeta.currentBatchLabel || formatBatchRange(batchSummary)}
                      </h3>
                      <div className="mt-3 inline-flex rounded-full border border-[#D35400]/15 bg-[#D35400]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D35400] shadow-sm">
                        {statusLabel}
                      </div>
                      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-charcoal-600 sm:text-base">
                        {statusCopy}
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 lg:items-end">
                      <div className="flex max-w-xl flex-wrap gap-3 text-sm text-charcoal-600 lg:justify-end">
                        <span className="rounded-full border border-[#ece7de] bg-white px-4 py-2 shadow-sm">
                          4 minggu kerja
                        </span>
                        <span className="rounded-full bg-[#faf9f6] px-4 py-2">
                        {batchSummary.totalSlots} slot kerja
                        </span>
                        <span className="rounded-full bg-[#D35400]/10 px-4 py-2 font-semibold text-[#D35400]">
                        {batchSummary.activeSlots} slot siap dipilih
                        </span>
                        <span className="rounded-full border border-[#ece7de] bg-white px-4 py-2 shadow-sm">
                          Deadline {deadlineLabel || 'menyusul'}
                        </span>
                      </div>
                      {batchOpen ? (
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                          <Link
                            href="/join-batch"
                            className="inline-flex items-center justify-center rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]"
                          >
                            Isi Form Join Batch
                          </Link>
                          <a
                            href={batchJoinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] bg-white px-5 py-3 text-sm font-bold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                          >
                            Chat Admin via WhatsApp
                          </a>
                        </div>
                      ) : (
                        <>
                          <div className="inline-flex items-center justify-center rounded-[12px] border border-charcoal-200 bg-white px-5 py-3 text-sm font-bold text-charcoal-500 shadow-sm">
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
