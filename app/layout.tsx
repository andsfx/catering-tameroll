import type { Metadata } from 'next'
import './globals.css'

const siteVariant = process.env.NEXT_PUBLIC_SITE_VARIANT

export const metadata: Metadata = {
  title:
    siteVariant === 'menu-landing'
      ? 'Menu Catering 4 Minggu Tameroll'
      : 'Tameroll - Premium Catering & Frozen Food',
  description:
    siteVariant === 'menu-landing'
      ? 'Landing page batch pre-order catering Tameroll untuk 4 minggu kerja. Cek status batch, referensi menu, dan konfirmasi join via WhatsApp.'
      : 'Catering premium dan frozen food berkualitas tinggi untuk berbagai acara. Nikmati hidangan lezat dengan bahan-bahan segar dan pelayanan terbaik.',
  keywords:
    siteVariant === 'menu-landing'
      ? 'menu catering mingguan, batch catering, pre-order catering, menu catering 4 minggu, tameroll'
      : 'catering, frozen food, catering bekasi, catering jakarta, makanan premium, nasi box, prasmanan',
  openGraph: {
    title:
      siteVariant === 'menu-landing'
        ? 'Menu Catering 4 Minggu Tameroll'
        : 'Tameroll - Premium Catering & Frozen Food',
    description:
      siteVariant === 'menu-landing'
        ? 'Cek batch pre-order catering Tameroll, lihat referensi menu 4 minggu kerja, dan konfirmasi join via WhatsApp.'
        : 'Catering premium dan frozen food berkualitas tinggi untuk berbagai acara.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
