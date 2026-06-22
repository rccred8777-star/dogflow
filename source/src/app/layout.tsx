import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'DogFlow',
  description: 'Desafio 7 Dias — Cão Mais Educado',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'DogFlow' },
}

export const viewport: Viewport = {
  themeColor: '#ff7a11',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface min-h-screen">
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
