import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tameroll - Premium Catering & Frozen Food',
  description: 'Catering premium dan frozen food berkualitas tinggi untuk berbagai acara. Nikmati hidangan lezat dengan bahan-bahan segar dan pelayanan terbaik.',
  keywords: 'catering, frozen food, catering bekasi, catering jakarta, makanan premium, nasi box, prasmanan',
  openGraph: {
    title: 'Tameroll - Premium Catering & Frozen Food',
    description: 'Catering premium dan frozen food berkualitas tinggi untuk berbagai acara.',
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