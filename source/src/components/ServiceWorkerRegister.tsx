'use client'

import { useEffect } from 'react'

// next-pwa@5 gera o /sw.js mas NÃO injeta o registro no App Router (era via _document,
// que o App Router não usa). Registramos manualmente aqui para o PWA funcionar de fato.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
