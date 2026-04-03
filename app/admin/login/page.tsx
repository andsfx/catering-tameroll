import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - Tameroll',
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
        <div className="mb-8 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
            Admin Area
          </p>
          <h1 className="mt-3 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
            Login Admin Tameroll
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-charcoal-600">
            Masuk untuk mengelola batch, kuota, dan informasi operasional lainnya.
          </p>
        </div>

        <form action={async (formData) => {
          'use server'
          const { loginAdmin } = await import('./actions')
          await loginAdmin(undefined, formData)
        }} className="space-y-5">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
              placeholder="admin"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
              placeholder="Masukkan password admin"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-[12px] bg-[#D35400] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#B94600]"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}
