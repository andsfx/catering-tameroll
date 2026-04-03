import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'
import AdminPasswordForm from '@/components/admin/AdminPasswordForm'

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
          <div className="flex flex-wrap gap-3">
            <form action={async () => {
              'use server'
              const { logoutAdmin } = await import('../actions')
              await logoutAdmin()
            }}>
              <button type="submit" className="rounded-[12px] bg-[#2C3E50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#223240]">
                Logout
              </button>
            </form>
            <Link href="/admin" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
              Kembali ke Dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <AdminPasswordForm />
        </div>
      </div>
    </main>
  )
}
