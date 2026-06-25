import type { Metadata, Viewport } from 'next'
import './globals.css'
import BottomNav from '@/components/BottomNav'
import MetaPixel from '@/components/MetaPixel'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'DogFlow',
  description: 'Desafio 7 Dias — Cão Mais Educado',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'DogFlow' },
}

export const viewport: Viewport = {
  themeColor: '#F26B0F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-surface min-h-screen">
        <ServiceWorkerRegister />
        <MetaPixel />
        {children}
        <BottomNav />
      </body>
    </html>
  )
}
