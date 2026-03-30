'use client'

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`menu-shimmer rounded-xl ${className}`} />
}

export default function MenuSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-[12px] bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="mb-4 hidden grid-cols-[120px_1.4fr_1fr_120px] gap-4 border-b border-[#eaeaea] px-4 pb-4 text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400 md:grid">
          <span>Hari</span>
          <span>Menu Utama</span>
          <span>Pendamping</span>
          <span>Status</span>
        </div>
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[12px] border border-[#ece7de] bg-[#faf9f6] p-4">
              <SkeletonBlock className="mb-3 h-4 w-24" />
              <SkeletonBlock className="mb-2 h-5 w-3/4" />
              <SkeletonBlock className="mb-2 h-4 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          ))}
        </div>
        <div className="hidden divide-y divide-[#eaeaea] md:block">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[120px_1.4fr_1fr_120px] gap-4 px-4 py-5">
              <SkeletonBlock className="h-5 w-20" />
              <SkeletonBlock className="h-5 w-4/5" />
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-8 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] bg-white p-4 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <div className="mb-5 grid grid-cols-5 gap-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-charcoal-400">
          {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 20 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[12px] border border-[#ece7de] bg-[#faf9f6] p-3 sm:p-4"
            >
              <SkeletonBlock className="mb-3 h-4 w-10" />
              <SkeletonBlock className="mb-2 h-5 w-full" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
