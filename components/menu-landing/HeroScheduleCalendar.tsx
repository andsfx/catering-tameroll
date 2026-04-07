import { formatMenuDateShort, getWorkdayGrid, type MenuItem } from '@/lib/menu'

export default function HeroScheduleCalendar({ items }: { items: MenuItem[] }) {
  const rows = getWorkdayGrid(items).slice(0, 2)

  return (
    <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 backdrop-blur-md shadow-[0_22px_48px_rgba(0,0,0,0.16)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            Kalender Batch
          </p>
          <h2 className="mt-2 font-serif text-[1.35rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.5rem]">
            Preview Jadwal Minggu Awal
          </h2>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
          4 Minggu Kerja
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:gap-3">
        {['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-2 sm:gap-3">
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
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${disabled ? 'text-white/40' : 'text-white/70'}`}>
                    {item.dayName}
                  </p>
                  <p className={`mt-1 text-sm font-bold tracking-[-0.01em] ${disabled ? 'text-white/75' : 'text-white'}`}>
                    {formatMenuDateShort(item.date)}
                  </p>
                  <p className={`mt-2 line-clamp-2 text-[11px] leading-5 ${disabled ? 'text-white/45' : 'text-white/85'}`}>
                    {item.mainCourse || 'Belum tersedia'}
                  </p>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
