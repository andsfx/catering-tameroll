'use client'

import type { MenuItem } from '@/lib/menu'
import { formatMenuDateShort } from '@/lib/menu'

type WeeklyMenuListProps = {
  items: MenuItem[]
  onSelect: (item: MenuItem) => void
}

function StatusBadge({ item }: { item: MenuItem }) {
  if (item.isAvailable) {
    return (
      <span className="inline-flex rounded-full border border-[#D35400]/15 bg-[#D35400]/10 px-3 py-1 text-xs font-semibold text-[#D35400]">
        Slot Batch Aktif
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-full border border-charcoal-200 bg-charcoal-100 px-3 py-1 text-xs font-semibold text-charcoal-500">
      Batch Ditutup
    </span>
  )
}

export default function WeeklyMenuList({ items, onSelect }: WeeklyMenuListProps) {
  return (
    <div className="rounded-[12px] bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mb-4 hidden grid-cols-[140px_1.5fr_1fr_130px] gap-4 border-b border-[#eaeaea] px-4 pb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400 md:grid">
        <span>Hari</span>
        <span>Menu Utama</span>
        <span>Pendamping</span>
        <span>Status</span>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item, index) => (
          <button
            key={item.date}
            type="button"
            onClick={() => item.isAvailable && onSelect(item)}
            className={`w-full rounded-[12px] border border-[#ece7de] p-4 text-left shadow-sm transition ${
              index % 2 === 0 ? 'bg-[#faf9f6]' : 'bg-white'
            } ${item.isAvailable ? 'hover:border-[#D35400]/40 hover:shadow-md' : 'border-dashed bg-charcoal-50/70 opacity-80'}`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold tracking-[-0.01em] text-[#2C3E50]">{item.dayName}</p>
                <p className="text-[12px] text-charcoal-500">{formatMenuDateShort(item.date)}</p>
              </div>
              <StatusBadge item={item} />
            </div>
            <p className="mb-2 text-[1.05rem] font-semibold leading-7 tracking-[-0.01em] text-[#2C3E50]">
              {item.mainCourse || 'Menu belum diatur'}
            </p>
            <p className="text-[15px] leading-7 text-charcoal-600">
              {[item.sideDish, item.extra].filter(Boolean).join(' • ') || 'Detail pendamping akan segera diperbarui.'}
            </p>
            <p className={`mt-3 text-xs font-medium uppercase tracking-[0.18em] ${item.isAvailable ? 'text-[#D35400]' : 'text-charcoal-400'}`}>
              {item.isAvailable ? 'Join pre-order batch aktif' : 'Menunggu batch berikutnya'}
            </p>
          </button>
        ))}
      </div>

      <div className="hidden md:block">
        {items.map((item, index) => (
          <button
            key={item.date}
            type="button"
            onClick={() => item.isAvailable && onSelect(item)}
            className={`grid w-full grid-cols-[140px_1.5fr_1fr_130px] gap-4 border-b border-[#eaeaea] px-4 py-5 text-left transition last:border-b-0 ${
              index % 2 === 0 ? 'bg-[#faf9f6]' : 'bg-white'
            } ${item.isAvailable ? 'hover:bg-[#fff6ee]' : 'opacity-75'}`}
          >
            <div>
              <div className="font-semibold tracking-[-0.01em] text-[#2C3E50]">{item.dayName}</div>
              <div className="mt-1 text-[13px] text-charcoal-500">{formatMenuDateShort(item.date)}</div>
            </div>
            <div>
              <div className="font-semibold leading-7 tracking-[-0.01em] text-[#2C3E50]">{item.mainCourse || 'Menu belum diatur'}</div>
              {item.label ? (
                <div className="mt-2 inline-flex rounded-full bg-[#D35400]/10 px-2.5 py-1 text-[11px] font-semibold text-[#D35400]">
                  {item.label}
                </div>
              ) : null}
            </div>
            <div className="text-[15px] leading-7 text-charcoal-600">
              {[item.sideDish, item.extra].filter(Boolean).join(' • ') || 'Detail pendamping akan segera diperbarui.'}
            </div>
            <div className="flex items-center justify-start lg:justify-end">
              <StatusBadge item={item} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
