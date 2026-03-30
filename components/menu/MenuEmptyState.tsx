'use client'

type MenuEmptyStateProps = {
  whatsappUrl: string
}

export default function MenuEmptyState({ whatsappUrl }: MenuEmptyStateProps) {
  return (
    <div className="rounded-[12px] bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-cream-200 text-charcoal-700">
        <span className="text-2xl">%</span>
      </div>
      <h3 className="mb-3 font-serif text-2xl text-[#2C3E50]">Menu belum tersedia</h3>
      <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-charcoal-600 sm:text-base">
        Menu untuk 4 minggu ke depan belum tersedia. Silakan hubungi admin via WhatsApp.
      </p>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary bg-[#D35400] hover:bg-[#B94600]">
        Tanya Menu Terbaru
      </a>
    </div>
  )
}
