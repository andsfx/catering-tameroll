'use client'

import { useEffect } from 'react'
import { Check, Flame, X } from 'lucide-react'
import type { BatchMeta, BatchSummary, MenuItem } from '@/lib/menu'
import {
  buildBatchActionWhatsAppUrl,
  formatBatchRange,
  formatMenuDateLong,
  formatOptionalLongDate,
  getBatchStatusLabel,
  isBatchJoinOpen,
} from '@/lib/menu'

type MenuDetailModalProps = {
  item: MenuItem | null
  batchSummary: BatchSummary | null
  batchMeta: BatchMeta
  onClose: () => void
}

function DetailLine({ text }: { text: string }) {
  if (!text) return null

  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-charcoal-700 sm:text-base">
      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#D35400]/10 text-[#D35400]">
        <Check size={14} />
      </span>
      <span>{text}</span>
    </li>
  )
}

export default function MenuDetailModal({ item, batchSummary, batchMeta, onClose }: MenuDetailModalProps) {
  useEffect(() => {
    if (!item) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [item, onClose])

  if (!item) return null

  const whatsappUrl = buildBatchActionWhatsAppUrl(batchMeta, batchSummary, item)
  const deadlineLabel = formatOptionalLongDate(batchMeta.deadlineJoin)
  const batchOpen = isBatchJoinOpen(batchMeta.batchStatus)
  const statusLabel = getBatchStatusLabel(batchMeta.batchStatus)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
      <button type="button" aria-label="Tutup detail menu" onClick={onClose} className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[12px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-charcoal-700 shadow-md transition hover:bg-white"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="relative h-56 sm:h-64">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.mainCourse || 'Menu harian'} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#D35400,#F28B56)]">
              <div className="rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold tracking-[0.3em] text-white uppercase">
                Tameroll
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C3E50]/60 via-transparent to-transparent" />
        </div>

        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto px-5 pb-28 pt-5 sm:px-7 sm:pt-6">
          {batchSummary ? (
            <div className="mb-4 rounded-[12px] border border-[#D35400]/15 bg-[#fff8f2] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
                {statusLabel} {batchMeta.currentBatchLabel || formatBatchRange(batchSummary)}
              </p>
              <p className="mt-2 text-[15px] leading-7 text-charcoal-600">
                {batchOpen
                  ? 'Slot ini termasuk dalam batch yang masih dibuka. Konfirmasi akhir tetap mengikuti kuota dan deadline batch aktif.'
                  : 'Slot ini hanya menjadi referensi menu. Batch aktif tidak menerima peserta baru dan Anda akan diarahkan ke waiting list batch berikutnya.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1.5 text-charcoal-600 shadow-sm">
                  {batchMeta.remainingQuota !== null ? `${batchMeta.remainingQuota} slot tersisa` : 'Kuota via admin'}
                </span>
                <span className="rounded-full bg-white px-3 py-1.5 text-charcoal-600 shadow-sm">
                  {deadlineLabel ? `Deadline ${deadlineLabel}` : 'Deadline menyusul'}
                </span>
              </div>
            </div>
          ) : null}
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-charcoal-500">
            {formatMenuDateLong(item.date)}
          </p>
          <h3 className="mb-4 font-serif text-[1.95rem] leading-[1.12] tracking-[-0.02em] text-[#2C3E50] sm:text-[2.25rem]">
            {item.mainCourse || 'Menu belum tersedia'}
          </h3>

          <p className="mb-5 text-[15px] leading-7 text-charcoal-600 sm:text-base">
            Menu ini menjadi referensi untuk slot pre-order dalam batch aktif. Customer bergabung ke batch yang sedang dibuka, bukan melakukan order satuan per tanggal.
          </p>

          {item.label ? (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#D35400]/10 px-3 py-1.5 text-sm font-semibold text-[#D35400]">
              <Flame size={15} />
              {item.label}
            </div>
          ) : null}

          <ul className="space-y-3">
            <DetailLine text={item.sideDish} />
            <DetailLine text={item.extra} />
          </ul>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-[#ece7de] bg-white/95 p-4 backdrop-blur-sm sm:p-5">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-charcoal-500">
            {batchOpen ? 'Konfirmasi slot melalui admin batch' : 'Arahkan ke waiting list batch berikutnya'}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-[12px] bg-[#D35400] px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-[#B94600] sm:text-base"
          >
            {batchOpen ? 'Konfirmasi Join Batch Ini' : 'Masuk Waiting List Batch Berikutnya'}
          </a>
        </div>
      </div>
    </div>
  )
}
