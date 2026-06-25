'use client'

import { useEffect, useState } from 'react'
import { X, Download, Share } from 'lucide-react'

// Guia o cliente a instalar o PWA — 1 toque no Android (beforeinstallprompt),
// instrução visual no iPhone (iOS não permite prompt programático).
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    // já instalado (rodando como app) → não mostra
    const standalone =
      window.matchMedia?.('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    if (standalone) return
    if (localStorage.getItem('pwa-dismiss')) return

    const ua = navigator.userAgent || ''
    const isIOS = /iphone|ipad|ipod/i.test(ua)
    const isSafari = isIOS && /safari/i.test(ua) && !/crios|fxios/i.test(ua)

    if (isIOS) {
      // No iPhone, instalar só funciona pelo Safari (Compartilhar → Adicionar)
      if (isSafari) { setIos(true); setShow(true) }
      return
    }

    const handler = (e: any) => { e.preventDefault(); setDeferred(e); setShow(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  async function install() {
    if (!deferred) return
    deferred.prompt()
    try { await deferred.userChoice } catch {}
    setDeferred(null); setShow(false)
  }
  function dismiss() { setShow(false); try { localStorage.setItem('pwa-dismiss', '1') } catch {} }

  return (
    <div style={{ position: 'fixed', left: 12, right: 12, bottom: 88, zIndex: 60 }}>
      <div style={{ background: '#fff', border: '1px solid #F0EDE6', borderRadius: 18, padding: 14, display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 14px 34px -10px rgba(40,30,15,0.28)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 13, background: '#FFF0E4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#F26B0F' }}>
          <Download style={{ width: 22, height: 22 }} strokeWidth={2.2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: '#1A1814', margin: 0 }}>Instale o DogFlow</p>
          {ios ? (
            <p style={{ fontSize: 12, color: '#8A8579', margin: '3px 0 0', fontWeight: 500, lineHeight: 1.35 }}>
              Toque em <Share style={{ width: 13, height: 13, verticalAlign: '-2px' }} /> Compartilhar e em <b>“Adicionar à Tela de Início”</b>.
            </p>
          ) : (
            <p style={{ fontSize: 12, color: '#8A8579', margin: '3px 0 0', fontWeight: 500 }}>Acesso rápido na tela inicial, como um app.</p>
          )}
        </div>
        {!ios && (
          <button onClick={install} style={{ background: '#F26B0F', color: '#fff', border: 'none', borderRadius: 11, padding: '10px 16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Instalar</button>
        )}
        <button onClick={dismiss} aria-label="fechar" style={{ background: 'none', border: 'none', color: '#B7B1A4', cursor: 'pointer', flexShrink: 0, display: 'flex', padding: 4 }}>
          <X style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  )
}
