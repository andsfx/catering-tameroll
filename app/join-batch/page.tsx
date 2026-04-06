import Link from 'next/link'
import type { Metadata } from 'next'
import JoinBatchForm from '@/components/join-batch/JoinBatchForm'
import { getActiveBatch } from '@/lib/data/batches'
import { getBatchStatusLabel } from '@/lib/menu'

export const metadata: Metadata = {
  title: 'Join Batch Catering - Tameroll',
  description: 'Konfirmasi join batch catering Tameroll dan upload bukti pembayaran Anda.',
}

export default async function JoinBatchPage() {
  const activeBatch = await getActiveBatch()

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
            Join Batch
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-tight tracking-[-0.03em] text-[#2C3E50] sm:text-[3rem]">
            Konfirmasi Join Batch Catering
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-8 text-charcoal-600 sm:text-base">
            Isi form berikut, upload bukti pembayaran, lalu admin akan mengecek status batch aktif dan menghubungi Anda via WhatsApp.
          </p>
        </div>

        {activeBatch ? (
          <JoinBatchForm
            batchName={activeBatch.name}
            batchStatusLabel={getBatchStatusLabel(activeBatch.status)}
          />
        ) : (
          <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 text-center shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
            <h2 className="font-serif text-[1.8rem] text-[#2C3E50]">Batch Aktif Belum Tersedia</h2>
            <p className="mt-3 text-[15px] leading-7 text-charcoal-600">
              Saat ini belum ada batch aktif yang bisa diproses. Silakan hubungi admin untuk informasi batch berikutnya.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://wa.me/6285183248797?text=Halo%20Tameroll%2C%20saya%20ingin%20mendapatkan%20info%20batch%20catering%20berikutnya."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-[12px] bg-[#2C3E50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#223240]"
              >
                Chat Admin
              </a>
              <Link href="/" className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-5 py-3 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
                Kembali ke Halaman Utama
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
