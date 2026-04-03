import MenuShowcase from '@/components/MenuShowcase'
import HowToOrder from '@/components/HowToOrder'
import Testimonials from '@/components/Testimonials'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function MenuLandingPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C3E50]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2C3E50_0%,#1F2D3A_60%,#15202A_100%)] px-4 pb-20 pt-8 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '36px 36px',
            }}
          />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between py-4">
            <a href="#top" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D35400] text-xl font-bold text-white">
                T
              </div>
              <span className="font-serif text-2xl tracking-wide">Tameroll</span>
            </a>
            <a
              href="#batch-aktif"
              className="rounded-[12px] border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
            >
              Lihat Batch
            </a>
          </div>

          <div id="top" className="grid gap-12 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
                Landing Page Batch Menu
              </div>
              <h1 className="mt-6 font-serif text-4xl leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
                Referensi Menu Catering Batch untuk <span className="text-[#F5C39C]">4 Minggu Kerja</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-8 text-white/78 sm:text-lg">
                Lihat menu batch yang sedang aktif, pahami cara join, lalu konfirmasi langsung ke WhatsApp admin. Jika batch sudah berjalan, Anda akan diarahkan ke waiting list batch berikutnya.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#batch-aktif"
                  className="inline-flex items-center justify-center rounded-[12px] bg-[#D35400] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#B94600]"
                >
                  Cek Batch Aktif
                </a>
                <a
                  href="#cara-join"
                  className="inline-flex items-center justify-center rounded-[12px] border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
                >
                  Cara Join Batch
                </a>
              </div>
            </div>

            <div className="rounded-[18px] border border-white/10 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
                Alur Singkat
              </p>
              <div className="mt-5 space-y-4">
                {[
                  'Lihat status batch dan timeline menu 4 minggu.',
                  'Konfirmasi ke admin via WhatsApp sebelum deadline join.',
                  'Jika batch berjalan atau ditutup, masuk waiting list batch berikutnya.',
                ].map((line, index) => (
                  <div key={line} className="flex gap-4 rounded-[14px] border border-white/10 bg-black/10 p-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#D35400] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-white/80">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="batch-aktif">
        <MenuShowcase />
      </div>

      <div id="cara-join">
        <HowToOrder />
      </div>

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Kenapa Sistem Batch
            </p>
            <h2 className="mt-3 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.4rem]">
              Lebih Tertata untuk Produksi dan Pengiriman
            </h2>
            <p className="mt-4 text-[15px] leading-8 text-charcoal-600 sm:text-base">
              Sistem batch membantu tim produksi menjaga kualitas, mengatur kapasitas, dan memastikan customer mendapat jadwal pengiriman yang lebih terukur.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['Konfirmasi Lebih Jelas', 'Admin akan mengarahkan Anda ke batch yang masih dibuka atau ke waiting list jika batch sudah berjalan.'],
              ['Kapasitas Terkontrol', 'Kuota dan deadline bisa dipantau sehingga proses produksi tidak overbooked.'],
              ['Menu Tetap Transparan', 'Customer tetap bisa melihat referensi menu 4 minggu penuh sebelum memutuskan join batch.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[14px] border border-[#ece7de] bg-[#fcfaf6] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-semibold text-[#2C3E50]">{title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-charcoal-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />

      <section className="bg-[#2C3E50] py-20 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F5C39C]">
            Penutup
          </p>
          <h2 className="mt-3 font-serif text-[2rem] leading-tight tracking-[-0.02em] sm:text-[2.5rem]">
            Siap Cek Batch dan Konfirmasi ke Admin?
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-8 text-white/75 sm:text-base">
            Gunakan timeline menu sebagai referensi, lalu pastikan status batchnya sebelum konfirmasi. Jika batch aktif sudah berjalan, admin akan bantu arahkan Anda ke batch berikutnya.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#batch-aktif"
              className="inline-flex items-center justify-center rounded-[12px] bg-[#D35400] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#B94600]"
            >
              Lihat Batch Aktif
            </a>
            <a
              href="https://wa.me/6285183248797?text=Halo%20Tameroll%2C%20saya%20ingin%20bertanya%20tentang%20batch%20pre-order%20catering."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[12px] border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Chat Admin Sekarang
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  )
}
