// Meta Pixel — DogFlow (Fase 4 rastreamento)
// Pixel ID correto da conta planopratico (o 1076 era órfão).
export const FB_PIXEL_ID = '1390710396449878'

// Dispara um evento padrão do Pixel se o fbq já estiver carregado.
// Seguro em SSR e antes do snippet inicializar (no-op silencioso).
export function fbqTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (typeof fbq === 'function') fbq('track', event, params)
}

// "R$29,90" -> 29.9 ; usado no value do InitiateCheckout.
export function parsePrice(price: string): number {
  const n = price.replace(/[^\d,]/g, '').replace(',', '.')
  const v = parseFloat(n)
  return Number.isFinite(v) ? v : 0
}
