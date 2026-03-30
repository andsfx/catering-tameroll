'use client'

import { useState } from 'react'
import type { MenuItem } from '@/lib/menu'
import { formatMenuDateShort, getWorkdayGrid } from '@/lib/menu'

const workdays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

type MenuCalendarProps = {
  items: MenuItem[]
  onSelect: (item: MenuItem) => void
}

export default function MenuCalendar({ items, onSelect }: MenuCalendarProps) {
  const rows = getWorkdayGrid(items)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  return (
    <div className="rounded-[12px] bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex flex-col gap-4 rounded-[12px] border border-[#ece7de] bg-[#fcfaf6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">
            Navigasi Batch
          </p>
          <p className="mt-2 text-[15px] leading-7 text-charcoal-600 sm:text-base">
            Batch aktif dibagi menjadi empat minggu kerja agar lebih mudah dibaca dan dipilih sesuai ritme produksi.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
          <span className="rounded-full bg-[#D35400]/10 px-3 py-2 text-[#D35400]">Slot Aktif</span>
          <span className="rounded-full border border-charcoal-200 bg-white px-3 py-2 text-charcoal-500">Batch Ditutup</span>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {rows.map((row, rowIndex) => (
          <section
            key={rowIndex}
            className="rounded-[14px] border border-[#ece7de] bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-4"
          >
            <div className="mb-4 flex flex-col gap-3 border-b border-[#f1ebe2] px-1 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">
                  Minggu {String(rowIndex + 1).padStart(2, '0')}
                </p>
                <h4 className="mt-2 font-serif text-[1.35rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[1.55rem]">
                  {formatMenuDateShort(row[0].date)} - {formatMenuDateShort(row[row.length - 1].date)}
                </h4>
              </div>
              <div className="hidden grid-cols-5 gap-3 text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal-400 md:grid">
                {workdays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-5">
              {row.map((item) => {
                const disabled = !item.isAvailable
                const showTooltip = hoveredDate === item.date && item.isAvailable && item.mainCourse

                return (
                  <div key={item.date} className="relative">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => item.isAvailable && onSelect(item)}
                      onMouseEnter={() => setHoveredDate(item.date)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={`min-h-[120px] w-full rounded-[14px] border p-3 text-left transition sm:min-h-[138px] sm:p-4 ${
                        disabled
                          ? 'cursor-default border-charcoal-200 border-dashed bg-charcoal-100/75 text-charcoal-400 opacity-80'
                          : 'border-[#D35400]/15 bg-[linear-gradient(180deg,#D35400_0%,#C04B00_100%)] text-white shadow-[0_14px_30px_rgba(211,84,0,0.18)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(211,84,0,0.22)]'
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <div>
                          <div className={`text-[11px] font-semibold uppercase tracking-[0.14em] md:hidden ${disabled ? 'text-charcoal-400' : 'text-white/75'}`}>
                            {item.dayName}
                          </div>
                          <div className={`text-sm font-bold tracking-[-0.01em] sm:text-base ${disabled ? 'text-charcoal-600' : 'text-white'}`}>
                            {formatMenuDateShort(item.date)}
                          </div>
                        </div>
                        {item.label ? (
                          <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${disabled ? 'bg-white/70 text-charcoal-500' : 'bg-white/20 text-white'}`}>
                            {item.label}
                          </span>
                        ) : null}
                      </div>

                      <p className={`line-clamp-3 text-[12px] leading-6 sm:text-[13px] ${disabled ? 'text-charcoal-500' : 'text-white/92'}`}>
                        {item.mainCourse || 'Slot menu belum tersedia'}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${disabled ? 'text-charcoal-400' : 'text-white/72'}`}>
                          {disabled ? 'Batch tidak aktif' : 'Join batch'}
                        </p>
                        {!disabled ? <div className="h-1.5 w-12 rounded-full bg-white/35" /> : null}
                      </div>
                    </button>

                    {showTooltip ? (
                      <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded-xl bg-[#2C3E50] px-3 py-2 text-center text-[12px] font-medium leading-5 text-white shadow-lg md:block">
                        {item.mainCourse}
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
