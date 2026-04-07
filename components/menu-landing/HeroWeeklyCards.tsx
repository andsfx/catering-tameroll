'use client'

import { useMemo, useState } from 'react'
import MenuDetailModal from '@/components/menu/MenuDetailModal'
import { formatMenuDateShort, getBatchSummary, getWorkdayGrid, hasMenuDetails, type BatchMeta, type MenuItem } from '@/lib/menu'

type HeroWeeklyCardsProps = {
  items: MenuItem[]
  batchMeta: BatchMeta
}

export default function HeroWeeklyCards({ items, batchMeta }: HeroWeeklyCardsProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const rows = useMemo(() => getWorkdayGrid(items), [items])
  const batchSummary = useMemo(() => getBatchSummary(items), [items])

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {rows.map((row, rowIndex) => (
          <section
            key={rowIndex}
            className="rounded-[18px] border border-white/10 bg-white/10 p-4 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)] sm:p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                  Minggu {String(rowIndex + 1).padStart(2, '0')}
                </p>
                <h2 className="mt-2 font-serif text-[1.25rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.4rem]">
                  {formatMenuDateShort(row[0].date)} - {formatMenuDateShort(row[row.length - 1].date)}
                </h2>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                5 hari kerja
              </span>
            </div>

            <div className="space-y-2.5">
              {row.map((item) => {
                const disabled = !item.isAvailable

                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => item.isAvailable && hasMenuDetails(item) && setSelectedItem(item)}
                    className={`flex w-full items-start justify-between gap-3 rounded-[14px] border px-4 py-3 text-left transition ${
                      disabled
                        ? 'cursor-default border-white/8 bg-white/5 text-white/45'
                        : 'border-[#F5C39C]/20 bg-[#D35400]/90 text-white hover:bg-[#C14D08]'
                    }`}
                  >
                    <div>
                      <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${disabled ? 'text-white/40' : 'text-white/70'}`}>
                        {item.dayName}
                      </p>
                      <p className={`mt-1 text-[13px] font-bold tracking-[-0.01em] ${disabled ? 'text-white/75' : 'text-white'}`}>
                        {item.mainCourse || 'Belum tersedia'}
                      </p>
                    </div>
                    <p className={`whitespace-nowrap text-[11px] font-medium ${disabled ? 'text-white/40' : 'text-white/80'}`}>
                      {formatMenuDateShort(item.date)}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <MenuDetailModal
        item={selectedItem && hasMenuDetails(selectedItem) ? selectedItem : null}
        batchSummary={batchSummary}
        batchMeta={batchMeta}
        onClose={() => setSelectedItem(null)}
      />
    </>
  )
}
