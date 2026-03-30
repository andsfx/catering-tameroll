'use client'

type MenuErrorStateProps = {
  onRetry: () => void
  whatsappUrl: string
}

export default function MenuErrorState({ onRetry, whatsappUrl }: MenuErrorStateProps) {
  return (
    <div className="rounded-[12px] bg-white p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-600">
        <span className="text-2xl">!</span>
      </div>
      <h3 className="mb-3 font-serif text-2xl text-[#2C3E50]">Menu belum bisa dimuat</h3>
      <p className="mx-auto mb-6 max-w-xl text-sm leading-relaxed text-charcoal-600 sm:text-base">
        Gagal memuat menu terbaru. Silakan hubungi admin via WhatsApp.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={onRetry} className="btn-primary bg-[#D35400] hover:bg-[#B94600]">
          Coba Lagi
        </button>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white">
          Hubungi via WhatsApp
        </a>
      </div>
    </div>
  )
}
