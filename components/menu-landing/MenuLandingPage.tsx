import MenuShowcase from '@/components/MenuShowcase'
import HowToOrder from '@/components/HowToOrder'
import Testimonials from '@/components/Testimonials'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getActiveBatch } from '@/lib/data/batches'
import { getPublicMenuPayload } from '@/lib/data/public-menu'
import { formatOptionalLongDate, getBatchStatusLabel, isBatchJoinOpen, type BatchMeta } from '@/lib/menu'
import HeroWeeklyCards from '@/components/menu-landing/HeroWeeklyCards'

export default async function MenuLandingPage() {
  const [activeBatch, publicMenuPayload] = await Promise.all([getActiveBatch(), getPublicMenuPayload()])
  const statusLabel = activeBatch ? getBatchStatusLabel(activeBatch.status) : 'Batch Belum Tersedia'
  const deadlineLabel = activeBatch?.deadline_join ? formatOptionalLongDate(activeBatch.deadline_join) : 'Segera diumumkan'
  const nextBatchOpenLabel = activeBatch?.next_batch_open ? formatOptionalLongDate(activeBatch.next_batch_open) : 'Akan diumumkan'
  const scheduleItems = publicMenuPayload.data.slice(0, 20)
  const batchOpen = activeBatch ? isBatchJoinOpen(activeBatch.status) : false

  const batchMeta: BatchMeta = {
    batchStatus: activeBatch?.status || 'open',
    currentBatchLabel: activeBatch?.name || 'Batch Belum Tersedia',
    deadlineJoin: activeBatch?.deadline_join || null,
    remainingQuota: activeBatch?.remaining_quota ?? null,
    nextBatchOpen: activeBatch?.next_batch_open || null,
    nextBatchLabel: activeBatch?.next_batch_label || null,
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] text-[#2C3E50]">
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#2C3E50_0%,#1F2D3A_60%,#15202A_100%)] px-4 pb-14 pt-8 text-white sm:px-6 lg:px-8">
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

          <div id="top" className="space-y-6 py-10 lg:py-14">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
                Jadwal Menu Batch
              </div>
              <h1 className="font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-white sm:text-[2.2rem]">
                Jadwal Batch Catering Tameroll
              </h1>
              <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                <div className="rounded-[18px] border border-[#F5C39C]/20 bg-[#D35400]/20 p-5 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                    Batch Aktif
                  </p>
                  <h2 className="mt-3 font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.9rem]">
                    {activeBatch?.name || 'Belum ada batch aktif'}
                  </h2>
                </div>
                <div className="rounded-[18px] border border-white/10 bg-white/10 p-5 backdrop-blur-md shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
                    Status Batch
                  </p>
                  <h2 className="mt-3 font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-white sm:text-[1.9rem]">
                    {statusLabel}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-white/72">
                    {batchOpen ? 'Konfirmasi sebelum kuota penuh.' : 'Hubungi admin untuk waiting list batch berikutnya.'}
                  </p>
                </div>
                <div className="flex items-stretch">
                {batchOpen ? (
                  <a
                    href="/join-batch"
                      className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-6 py-3 text-sm font-bold text-[#2C3E50] transition hover:bg-[#FDF3EA]"
                  >
                    Isi Form Join
                  </a>
                ) : (
                  <a
                    href="https://wa.me/6285183248797?text=Halo%20Tameroll%2C%20saya%20ingin%20bertanya%20tentang%20batch%20catering%20berikutnya."
                    target="_blank"
                    rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-[18px] bg-white px-6 py-3 text-sm font-bold text-[#2C3E50] transition hover:bg-[#FDF3EA]"
                  >
                    Chat Admin
                  </a>
                )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/72">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Deadline {deadlineLabel || 'menyusul'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Kuota {activeBatch?.remaining_quota !== null && activeBatch?.remaining_quota !== undefined ? `${activeBatch.remaining_quota} slot` : 'cek admin'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                  Batch berikutnya {nextBatchOpenLabel || 'akan diumumkan'}
                </span>
              </div>
            </div>

            <HeroWeeklyCards items={scheduleItems} batchMeta={batchMeta} />
          </div>
        </div>
      </section>

      <div id="batch-aktif">
        <MenuShowcase />
      </div>

      <div id="cara-join">
        <HowToOrder variant="batch" />
      </div>

      <section className="bg-white pb-8 pt-0 sm:pb-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[18px] border border-[#ece7de] bg-[linear-gradient(135deg,#fff8f2_0%,#ffffff_100%)] px-6 py-7 text-center shadow-[0_12px_34px_rgba(0,0,0,0.05)] sm:px-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Setelah Paham Alurnya
            </p>
            <h2 className="mt-3 font-serif text-[1.8rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.15rem]">
              Lanjut ke Batch Aktif atau Hubungi Admin
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-charcoal-600 sm:text-base">
              Jika batch masih dibuka, Anda bisa langsung konfirmasi ke admin. Jika batch sudah berjalan, admin akan bantu masukkan Anda ke waiting list berikutnya.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#batch-aktif"
                className="inline-flex items-center justify-center rounded-[12px] bg-[#D35400] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#B94600]"
              >
                Lihat Batch Aktif
              </a>
              <a
                href="https://wa.me/6285183248797?text=Halo%20Tameroll%2C%20saya%20ingin%20konfirmasi%20atau%20bertanya%20tentang%20batch%20catering."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-6 py-3.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
              >
                Konfirmasi ke Admin
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Kenapa Sistem Batch
            </p>
            <h2 className="mt-3 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.2rem]">
              Lebih Jelas untuk Customer, Lebih Stabil untuk Produksi
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              ['Konfirmasi Lebih Jelas', 'Customer tidak perlu menebak slot mana yang masih bisa diproses. Admin langsung mengarahkan ke batch aktif atau waiting list berikutnya.'],
              ['Kapasitas Lebih Terkontrol', 'Tim produksi bisa menjaga kuota, deadline, dan ritme pengiriman tanpa overbooked, sementara customer tetap mendapat referensi menu yang transparan.'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-[16px] border border-[#ece7de] bg-[#fcfaf6] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="text-lg font-semibold text-[#2C3E50]">{title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-charcoal-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials variant="compact" />

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
