import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// URL INTERNA do Docker (dogflow e n8n na mesma rede planopratico_net).
// A URL pública (https://n8n.planopratico.shop) falha por hairpin NAT de dentro do container.
const N8N_BASE = process.env.N8N_INTERNAL_URL ?? 'http://n8n:5678'
const N8N_BOASVINDAS_URL = `${N8N_BASE}/webhook/kiwify-compra`
const N8N_CARRINHO_URL   = `${N8N_BASE}/webhook/kiwify-carrinho`
const N8N_EMAIL_URL      = `${N8N_BASE}/webhook/enviar-email`

const APP_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.planopratico.shop'

// Mapa produto Kiwify → plan interno
const PRODUCT_PLAN: Record<string, string> = {
  'dogflow_7dias':     'desafio',
  'dogflow_caocalmo':  'caocalmo',
  'dogflow_basico':    'basico',
  'dogflow_premium':   'premium',
  'dogflow_pro':       'pro',
}

// Nome amigável do plano para o email
const PLAN_LABEL: Record<string, string> = {
  desafio:  'Desafio 7 Dias',
  caocalmo: 'Protocolo Cão Calmo',
  basico:   'Plano Básico',
  premium:  'Plano Premium',
  pro:      'Plano Pro',
}

// Email de boas-vindas/acesso — enviado a TODO comprador (novo ou recorrente),
// já que o convite do Supabase só dispara para usuário inédito.
function buildWelcomeEmail(email: string, name: string, plan: string) {
  const label = PLAN_LABEL[plan] ?? 'DogFlow'
  const firstName = name ? name.trim().split(/\s+/)[0] : ''
  const hi = firstName ? `Oi, ${firstName}!` : 'Oi!'
  return {
    to: email,
    subject: `🐶 Seu acesso ao DogFlow — ${label}`,
    text: `${hi}

Sua compra do ${label} foi confirmada. 🎉

👉 Acesse o app: ${APP_URL}

Entre com este mesmo e-mail (${email}).
Se for seu primeiro acesso, toque em "Criar senha" na tela de login para definir sua senha.

Bons treinos! 🐾
Equipe DogFlow`,
  }
}

function detectProduct(body: any): string {
  const productName = (body?.order?.Product?.name || body?.Product?.name || '').toLowerCase()
  // checkout_id é o sinal mais confiável; nome é fallback
  const checkoutId = body?.order?.checkout_id || body?.checkout_id || ''
  if (checkoutId === 'gmD7yDF' || productName.includes('calmo')) return 'dogflow_caocalmo'
  // 'calmo' precisa vir ANTES de 'pro' — "Protocolo Cão Calmo" contém "pro" (em "protocolo")
  if (productName.includes('pro'))     return 'dogflow_pro'
  if (productName.includes('premium')) return 'dogflow_premium'
  if (productName.includes('básico') || productName.includes('basico')) return 'dogflow_basico'
  return 'dogflow_7dias'
}

function verifyToken(req: NextRequest): boolean {
  const token = req.nextUrl.searchParams.get('token')
  return token === process.env.KIWIFY_WEBHOOK_SECRET
}

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function forwardToN8n(url: string, body: unknown) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    })
    // Não falhar calado: status != 2xx precisa aparecer no log.
    if (!res.ok) console.error(`n8n forward HTTP ${res.status} (${url})`)
  } catch (e) {
    console.error(`n8n forward failed (${url})`, e)
  }
}

export async function POST(req: NextRequest) {
  if (!verifyToken(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: any
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const order   = body?.order ?? body
  const event   = order?.webhook_event_type ?? order?.order_status ?? body?.event ?? body?.status
  const orderId = order?.order_id ?? order?.id ?? body?.id ?? body?.order_id
  const email   = order?.Customer?.email  ?? order?.customer?.email  ?? body?.Customer?.email  ?? body?.customer?.email
  const phone   = (order?.Customer?.mobile ?? order?.customer?.mobile ?? order?.customer?.phone ?? body?.Customer?.mobile ?? '').replace(/\D/g, '')
  const name    = order?.Customer?.full_name ?? order?.Customer?.name ?? order?.customer?.name ?? body?.Customer?.name ?? ''

  if (!email || !orderId) {
    return NextResponse.json({ error: 'Missing email or order_id' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const product  = detectProduct(body)
  const plan     = PRODUCT_PLAN[product] ?? 'desafio'

  // ── Compra aprovada ──────────────────────────────────────────────────────
  if (event === 'order_approved' || event === 'paid') {
    await supabase.from('purchases').upsert({
      email,
      customer_name:   name  || null,
      customer_phone:  phone || null,
      kiwify_order_id: orderId,
      product,
      plan,
      status: 'active',
      subscription_status: 'active',
    }, { onConflict: 'kiwify_order_id' })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.planopratico.shop'
    const { error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/criar-senha`,
    })
    if (inviteErr && !inviteErr.message.toLowerCase().includes('already')) {
      console.error('invite error', inviteErr)
    }

    const { data: { users } } = await supabase.auth.admin.listUsers()
    const user = users.find(u => u.email === email)
    if (user) {
      await supabase.from('purchases').update({ user_id: user.id }).eq('kiwify_order_id', orderId)
    }

    await forwardToN8n(N8N_BOASVINDAS_URL, {
      event: 'order_approved', id: orderId,
      Customer: { name, email, mobile: phone },
      plan,
    })

    // Email de acesso para TODO comprador (o convite Supabase só vai p/ usuário inédito).
    await forwardToN8n(N8N_EMAIL_URL, buildWelcomeEmail(email, name, plan))

    return NextResponse.json({ ok: true })
  }

  // ── Assinatura cancelada ─────────────────────────────────────────────────
  if (event === 'subscription_cancelled' || event === 'order_cancelled') {
    await supabase.from('purchases')
      .update({ subscription_status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('kiwify_order_id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── Assinatura inadimplente ──────────────────────────────────────────────
  if (event === 'subscription_overdue' || event === 'charge_failed') {
    await supabase.from('purchases')
      .update({ subscription_status: 'past_due' })
      .eq('kiwify_order_id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── Assinatura reativada / renovada ──────────────────────────────────────
  if (event === 'subscription_renewed' || event === 'subscription_reactivated') {
    await supabase.from('purchases')
      .update({ subscription_status: 'active', cancelled_at: null })
      .eq('kiwify_order_id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── Reembolso / chargeback ───────────────────────────────────────────────
  if (event === 'order_refunded' || event === 'order_chargeback' || event === 'refunded') {
    await supabase.from('purchases')
      .update({ status: event === 'order_chargeback' ? 'chargeback' : 'refunded', subscription_status: 'cancelled' })
      .eq('kiwify_order_id', orderId)
    return NextResponse.json({ ok: true })
  }

  // ── Carrinho abandonado ──────────────────────────────────────────────────
  if (event === 'abandoned_cart' || event === 'order_abandoned') {
    await forwardToN8n(N8N_CARRINHO_URL, body)
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: true, ignored: true })
}
