'use client'

import { useEffect, useState } from 'react'
import { PawPrint, Crown, Star, Lock, ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { fbqTrack, parsePrice } from '@/lib/fbpixel'

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0, desafio: 1, basico: 2, premium: 3, pro: 4,
}

const PLANS = [
  {
    id: 'basico',
    name: 'Básico',
    price: 'R$29,90',
    period: '/mês',
    icon: PawPrint,
    gradient: 'from-slate-600 to-slate-800',
    description: 'Continue evoluindo após o desafio',
    tag: '🐾 Mais que o desafio',
    features: [
      '📚 Biblioteca completa de obediência (30+ lições)',
      '🐕 1 pet com perfil e progresso individual',
      '✅ Checklist diário gamificado com streak',
      '📊 Histórico de evolução semana a semana',
      '🔓 Novos módulos liberados todo mês',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$59,90',
    period: '/mês',
    icon: Star,
    gradient: 'from-brand-500 to-brand-700',
    description: 'Para famílias com mais de um cão',
    popular: true,
    tag: '⭐ Mais escolhido',
    features: [
      '📚 Tudo do Básico incluso',
      '🐕🐕🐕 Até 3 pets com perfis independentes',
      '🤝 Módulos de socialização com cães e pessoas',
      '🎪 20+ truques — do simples ao impressionante',
      '💬 Suporte via WhatsApp em até 24h',
      '📈 Relatório semanal de progresso detalhado',
      '🏆 Desafios mensais exclusivos com recompensas',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$99,90',
    period: '/mês',
    icon: Crown,
    gradient: 'from-amber-500 to-amber-700',
    description: 'Experiência completa e personalizada',
    tag: '👑 Máxima evolução',
    features: [
      '🌟 Tudo do Premium incluso',
      '∞ Pets ilimitados — toda a matilha',
      '🤖 Plano gerado por IA baseado no perfil do seu cão',
      '⚡ Módulos avançados: agilidade e recuperação',
      '🎥 Consultoria mensal de 30 min com especialista',
      '🔴 Suporte VIP — resposta em até 2 horas',
      '🚀 Acesso antecipado a novos módulos',
      '👥 Comunidade exclusiva de tutores Pro',
    ],
  },
]

const PLAN_LABELS: Record<string, string> = {
  free: 'Sem plano',
  desafio: 'Desafio 7 Dias',
  basico: 'Básico',
  premium: 'Premium',
  pro: 'Pro',
}

export default function PlanosPage() {
  const supabase = createClient()
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<string>('free')
  const [links, setLinks] = useState<Record<string, string | null>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: { user } }, linksRes] = await Promise.all([
        supabase.auth.getUser(),
        fetch('/api/checkout-links').then(r => r.json()),
      ])
      setLinks(linksRes)
      if (user) {
        const { data } = await supabase
          .from('purchases')
          .select('plan, subscription_status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
        if (data) setCurrentPlan(data.plan || 'desafio')
      }
      setLoading(false)
    }
    load()
  }, [])

  const userLevel = PLAN_HIERARCHY[currentPlan] ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', padding: '8px 20px 120px' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, paddingTop: 8 }}>
        <button onClick={() => router.push('/treinos')} style={{ width: 40, height: 40, borderRadius: 13, border: '1px solid #ECE7DE', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1814', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft style={{ width: 20, height: 20 }} strokeWidth={2.2} />
        </button>
        <div>
          <h1 style={{ fontSize: 23, fontWeight: 800, color: '#1A1814', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.05 }}>Continue evoluindo</h1>
          <p style={{ fontSize: 13, color: '#8A8579', margin: '2px 0 0', fontWeight: 500 }}>Escolha o plano ideal</p>
        </div>
      </div>

      {/* plano atual */}
      {!loading && (
        <div style={{ background: '#fff', border: '1px solid #F0EDE6', borderRadius: 18, padding: '15px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, boxShadow: '0 2px 8px -4px rgba(40,30,15,0.08)' }}>
          <div>
            <p style={{ fontSize: 12, color: '#A8A296', fontWeight: 600, margin: 0 }}>Seu plano atual</p>
            <p style={{ fontSize: 17, fontWeight: 800, color: '#1A1814', margin: '2px 0 0' }}>{PLAN_LABELS[currentPlan] ?? currentPlan}</p>
          </div>
          <span style={{ background: '#E9F8EF', color: '#1B9E5A', fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 999 }}>Ativo</span>
        </div>
      )}

      {/* cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PLANS.map((plan) => {
          const planLevel = PLAN_HIERARCHY[plan.id] ?? 0
          const isCurrentPlan = currentPlan === plan.id
          const isDowngrade = planLevel < userLevel
          const checkoutLink = links[plan.id]

          return (
            <div key={plan.id} style={{ background: '#fff', border: plan.popular ? '2px solid #F26B0F' : '1px solid #F0EDE6', borderRadius: 22, overflow: 'hidden', boxShadow: plan.popular ? '0 14px 34px -12px rgba(242,107,15,0.4)' : '0 2px 10px -4px rgba(40,30,15,0.08)' }}>
              {plan.popular && !isCurrentPlan && (
                <div style={{ background: '#F26B0F', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textAlign: 'center', padding: 7, textTransform: 'uppercase' }}>Mais escolhido</div>
              )}
              {isCurrentPlan && (
                <div style={{ background: '#1B9E5A', color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textAlign: 'center', padding: 7, textTransform: 'uppercase' }}>✓ Seu plano atual</div>
              )}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 19, fontWeight: 800, color: '#1A1814', margin: 0, letterSpacing: '-0.3px' }}>{plan.name}</p>
                    <p style={{ fontSize: 12.5, color: '#8A8579', margin: '3px 0 0', fontWeight: 500 }}>{plan.description}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontSize: 22, fontWeight: 800, color: '#1A1814', margin: 0, letterSpacing: '-0.5px' }}>{plan.price}</p>
                    <p style={{ fontSize: 11.5, color: '#A8A296', margin: '1px 0 0', fontWeight: 600 }}>por mês</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                      <span style={{ color: '#1B9E5A', display: 'flex', flexShrink: 0, marginTop: 1 }}><Check style={{ width: 16, height: 16 }} strokeWidth={3} /></span>
                      <span style={{ fontSize: 13, color: '#4A453C', fontWeight: 500, lineHeight: 1.35 }}>{f}</span>
                    </div>
                  ))}
                </div>

                {isCurrentPlan ? (
                  <div style={{ width: '100%', padding: 15, borderRadius: 15, fontWeight: 800, fontSize: 14.5, textAlign: 'center', background: '#E9F8EF', color: '#1B9E5A' }}>✓ Plano ativo</div>
                ) : checkoutLink ? (
                  <a
                    href={checkoutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => fbqTrack('InitiateCheckout', { content_name: plan.name, content_category: 'dogflow_assinatura', value: parsePrice(plan.price), currency: 'BRL' })}
                    style={{ display: 'block', width: '100%', padding: 15, borderRadius: 15, fontWeight: 800, fontSize: 14.5, textAlign: 'center', textDecoration: 'none', color: '#fff', background: plan.popular ? '#F26B0F' : '#1A1814' }}
                  >
                    {isDowngrade ? `Mudar para ${plan.name}` : `Assinar ${plan.name}`}
                  </a>
                ) : (
                  <div style={{ width: '100%', padding: 15, borderRadius: 15, fontWeight: 800, fontSize: 14.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#F4F1EA', color: '#B7B1A4' }}>
                    <Lock style={{ width: 16, height: 16 }} /> Em breve
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#A8A296', fontWeight: 500, margin: '18px 0 0' }}>Cancele quando quiser. Sem fidelidade.</p>
    </div>
  )
}
