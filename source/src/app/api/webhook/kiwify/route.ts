import { NextRequest, NextResponse } from 'next/server'
import { createServiceSupabase } from '@/lib/supabase-server'

// Mapeamento checkout_id → plano no app
const PRODUCT_MAP: Record<string, string> = {
  a6a8NmF: 'desafio',       // DogFlow 7 Dias R$27
  VhbF8rS: 'desafio',       // DogFlow (upsell checkout alternativo)
  TDTPcu6: 'desafio',       // DogFlow 7 Dias (Xixi) — checkout do DESAFIO, não do Cão Calmo
  gmD7yDF: 'caocalmo',      // Protocolo Cão Calmo (Ansiedade de Separação) R$47
  Z4f6t5U: 'silencioso',    // Módulo Cão Silencioso R$17
  sOitKRK: 'basico',        // Plano Básico R$29,90
  YvUvutB: 'premium',       // Plano Premium R$59,90
  lAxkqcH: 'pro',           // Plano Pro R$99,90
}

// Planos que dão acesso principal ao app (criam purchase principal)
const MAIN_PLANS = new Set(['desafio', 'basico', 'premium', 'pro'])

// Add-ons (criam purchase adicional, não substituem a principal)
const ADDON_PLANS = new Set(['caocalmo', 'silencioso'])

function extractCheckoutId(url: string): string | null {
  // Extrai o ID do checkout da URL Kiwify
  // Ex: https://pay.kiwify.com.br/TDTPcu6 → TDTPcu6
  const match = url?.match(/pay\.kiwify\.com\.br\/([A-Za-z0-9]+)/)
  return match ? match[1] : null
}

function getPlanFromPayload(payload: any): string | null {
  // Tenta encontrar o produto pelo checkout_url ou product_id
  const checkoutUrl = payload?.checkout_url || payload?.product?.checkout_url || ''
  const checkoutId = extractCheckoutId(checkoutUrl)

  if (checkoutId && PRODUCT_MAP[checkoutId]) {
    return PRODUCT_MAP[checkoutId]
  }

  // Fallback: buscar pelo nome do produto
  const productName = (payload?.product?.name || '').toLowerCase()
  if (productName.includes('calmo')) return 'caocalmo'
  if (productName.includes('silencioso')) return 'silencioso'
  if (productName.includes('pro')) return 'pro'
  if (productName.includes('premium')) return 'premium'
  if (productName.includes('basico') || productName.includes('básico')) return 'basico'
  if (productName.includes('dogflow') || productName.includes('xixi')) return 'desafio'

  return null
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Kiwify envia order_status = 'paid' para compras confirmadas
    const status = payload?.order_status || payload?.status
    if (!['paid', 'active', 'complete'].includes(status)) {
      // Reembolso ou chargeback — desativar purchase
      if (['refunded', 'chargedback', 'cancelled'].includes(status)) {
        await handleRefund(payload)
      }
      return NextResponse.json({ ok: true, action: 'ignored', status })
    }

    const email = payload?.Customer?.email || payload?.customer?.email
    if (!email) {
      return NextResponse.json({ ok: false, error: 'no email in payload' }, { status: 400 })
    }

    const plan = getPlanFromPayload(payload)
    if (!plan) {
      return NextResponse.json({ ok: false, error: 'unknown product' }, { status: 400 })
    }

    const db = createServiceSupabase()

    // Buscar user_id pelo email
    const { data: { users } } = await db.auth.admin.listUsers()
    const user = users.find((u: any) => u.email === email)

    if (!user) {
      // Usuário ainda não existe — registrar pending para criar na primeira autenticação
      console.log(`[webhook] user not found for email ${email}, plan ${plan}`)
      return NextResponse.json({ ok: true, action: 'user_not_found', email, plan })
    }

    const isAddon = ADDON_PLANS.has(plan)

    if (isAddon) {
      // Add-on: inserir purchase adicional (não substitui a principal)
      const { error } = await db.from('purchases').insert({
        user_id: user.id,
        plan,
        status: 'active',
        purchased_at: new Date().toISOString(),
      })
      if (error) throw error
      console.log(`[webhook] addon purchase criado: ${email} → ${plan}`)
    } else {
      // Plano principal: upsert (atualiza se já tem, cria se não tem)
      const { data: existing } = await db.from('purchases')
        .select('id').eq('user_id', user.id).in('plan', [...MAIN_PLANS]).maybeSingle()

      if (existing) {
        await db.from('purchases').update({
          plan,
          status: 'active',
          purchased_at: new Date().toISOString(),
        }).eq('id', existing.id)
        console.log(`[webhook] purchase atualizada: ${email} → ${plan}`)
      } else {
        await db.from('purchases').insert({
          user_id: user.id,
          plan,
          status: 'active',
          purchased_at: new Date().toISOString(),
        })
        console.log(`[webhook] purchase criada: ${email} → ${plan}`)
      }
    }

    return NextResponse.json({ ok: true, action: 'purchase_registered', email, plan })

  } catch (err: any) {
    console.error('[webhook] erro:', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}

async function handleRefund(payload: any) {
  const email = payload?.Customer?.email || payload?.customer?.email
  if (!email) return

  const plan = getPlanFromPayload(payload)
  if (!plan) return

  const db = createServiceSupabase()
  const { data: { users } } = await db.auth.admin.listUsers()
  const user = users.find((u: any) => u.email === email)
  if (!user) return

  await db.from('purchases').update({ status: 'cancelled' })
    .eq('user_id', user.id).eq('plan', plan)

  console.log(`[webhook] purchase cancelada: ${email} → ${plan}`)
}
