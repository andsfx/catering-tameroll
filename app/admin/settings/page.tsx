import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'
import AdminShell from '@/components/admin/AdminShell'
import AdminPasswordForm from '@/components/admin/AdminPasswordForm'

export default async function AdminSettingsPage() {
  const session = await requireAdminSession()

  return (
    <AdminShell
      currentSection="settings"
      eyebrow="Admin Settings"
      title="Keamanan Admin"
      description="Ganti password admin dari halaman ini."
      username={session.username}
      backHref="/admin"
      backLabel="Kembali ke Dashboard"
    >
        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <AdminPasswordForm />
        </div>
    </AdminShell>
  )
}
