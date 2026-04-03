import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'

export default async function AdminSettingsPage() {
  const session = await requireAdminSession()

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Admin Settings
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              Keamanan Admin
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-charcoal-600">
              Login aktif sebagai <span className="font-semibold text-[#2C3E50]">{session.username}</span>. Ganti password admin dari halaman ini.
            </p>
          </div>
          <Link href="/admin" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <form action={async (formData) => {
            'use server'
            const { changeAdminPassword } = await import('./actions')
            await changeAdminPassword(undefined, formData)
          }} className="space-y-5">
            <div>
              <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
                Password Saat Ini
              </label>
              <input id="currentPassword" name="currentPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>
            <div>
              <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
                Password Baru
              </label>
              <input id="newPassword" name="newPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              <p className="mt-2 text-xs text-charcoal-500">Minimal 8 karakter.</p>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
                Konfirmasi Password Baru
              </label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>
            <button type="submit" className="rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]">
              Simpan Password Baru
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
