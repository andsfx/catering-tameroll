import Link from 'next/link'

type AdminSection = 'dashboard' | 'join-requests' | 'settings'

type AdminShellProps = {
  currentSection: AdminSection
  eyebrow: string
  title: string
  description: string
  username?: string
  backHref?: string
  backLabel?: string
  children: React.ReactNode
}

const navItems: Array<{ href: string; label: string; section: AdminSection }> = [
  { href: '/admin', label: 'Dashboard', section: 'dashboard' },
  { href: '/admin/join-requests', label: 'Join Requests', section: 'join-requests' },
  { href: '/admin/settings', label: 'Settings', section: 'settings' },
]

export default function AdminShell({
  currentSection,
  eyebrow,
  title,
  description,
  username,
  backHref,
  backLabel,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[18px] border border-[#ece7de] bg-white p-5 shadow-[0_18px_48px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
                {eyebrow}
              </p>
              <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50] sm:text-[2.2rem]">
                {title}
              </h1>
              <p className="mt-2 text-[15px] leading-7 text-charcoal-600">
                {description}
                {username ? (
                  <>
                    {' '}
                    Login sebagai <span className="font-semibold text-[#2C3E50]">{username}</span>.
                  </>
                ) : null}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {backHref && backLabel ? (
                <Link
                  href={backHref}
                  className="rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                >
                  {backLabel}
                </Link>
              ) : null}
              <form
                action={async () => {
                  'use server'
                  const { logoutAdmin } = await import('@/app/admin/actions')
                  await logoutAdmin()
                }}
              >
                <button
                  type="submit"
                  className="rounded-[12px] bg-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#223240]"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 border-t border-[#ece7de] pt-5">
            {navItems.map((item) => {
              const active = item.section === currentSection

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-[12px] px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-[#D35400] text-white shadow-[0_8px_24px_rgba(211,84,0,0.18)]'
                      : 'border border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {children}
      </div>
    </main>
  )
}
