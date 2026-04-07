import { formatMenuDateShort, getWorkdayGrid, type MenuItem } from '@/lib/menu'

export default function HeroScheduleCalendar({ items }: { items: MenuItem[] }) {
  const rows = getWorkdayGrid(items)

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-md shadow-[0_22px_48px_rgba(0,0,0,0.16)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Kalender Batch
          </p>
          <h2 className="mt-2 font-serif text-[1.28rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.45rem]">
            Jadwal 4 Minggu Kerja
          </h2>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
          20 Slot
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:gap-2.5 sm:text-[10px]">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-4 space-y-2.5 sm:space-y-3">
        {rows.map((row, rowIndex) => (
          <section
            key={rowIndex}
            className="rounded-[16px] border border-white/10 bg-black/10 p-2.5 sm:p-3"
          >
            <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/55 sm:text-[10px]">
                Minggu {String(rowIndex + 1).padStart(2, '0')}
              </p>
              <p className="text-[11px] font-medium text-white/70 sm:text-xs">
                {formatMenuDateShort(row[0].date)} - {formatMenuDateShort(row[row.length - 1].date)}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
            {row.map((item) => {
              const disabled = !item.isAvailable

              return (
                <div
                  key={item.date}
                  className={`rounded-[16px] border p-3 text-left ${
                    disabled
                      ? 'border-white/10 bg-white/5 text-white/45'
                      : 'border-[#F5C39C]/20 bg-[#D35400]/90 text-white shadow-[0_10px_24px_rgba(211,84,0,0.18)]'
                  }`}
                >
                  <p className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${disabled ? 'text-white/40' : 'text-white/70'}`}>
                    {item.dayName}
                  </p>
                  <p className={`mt-1 text-[13px] font-bold tracking-[-0.01em] sm:text-sm ${disabled ? 'text-white/75' : 'text-white'}`}>
                    {formatMenuDateShort(item.date)}
                  </p>
                  <p className={`mt-1.5 line-clamp-2 text-[10px] leading-5 sm:text-[11px] ${disabled ? 'text-white/45' : 'text-white/85'}`}>
                    {item.mainCourse || 'Belum tersedia'}
                  </p>
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
