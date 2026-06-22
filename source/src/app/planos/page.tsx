'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, PawPrint, Zap, Crown, Star, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase'

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
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-5 pt-14 pb-20 safe-top relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="flex items-center gap-2 mb-1 relative">
          <PawPrint className="w-5 h-5 text-white/80" />
          <span className="text-white/80 text-sm font-semibold">DogFlow</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white relative mt-2">Continue evoluindo</h1>
        <p className="text-white/70 text-sm mt-1 relative">Escolha o plano ideal para você e seu cão</p>
      </div>

      <div className="px-4 -mt-12">
        {/* Plano atual */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 mb-5 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-400 font-medium">Seu plano atual</p>
              <p className="text-lg font-extrabold text-gray-900">{PLAN_LABELS[currentPlan] ?? currentPlan}</p>
            </div>
            {userLevel >= 2 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Ativo</span>
            )}
          </motion.div>
        )}

        {/* Cards de plano */}
        <div className="space-y-4">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon
            const planLevel = PLAN_HIERARCHY[plan.id] ?? 0
            const isCurrentPlan = currentPlan === plan.id
            const isDowngrade = planLevel < userLevel
            const checkoutLink = links[plan.id]

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-3xl overflow-hidden border shadow-sm ${
                  plan.popular ? 'border-brand-300 shadow-brand-100 shadow-md' : 'border-gray-100'
                } ${isCurrentPlan ? 'ring-2 ring-green-400' : ''}`}
              >
                {!isCurrentPlan && (
                  <div className={`text-white text-xs font-bold text-center py-1.5 tracking-wide bg-gradient-to-r ${plan.gradient}`}>
                    {plan.tag}
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="bg-green-500 text-white text-xs font-bold text-center py-1.5 tracking-wide">
                    ✓ SEU PLANO ATUAL
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.gradient} px-5 py-5`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 rounded-2xl p-2">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-extrabold text-lg">{plan.name}</h3>
                        <p className="text-white/70 text-xs">{plan.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-extrabold text-2xl">{plan.price}</p>
                      <p className="text-white/60 text-xs">por mês</p>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="space-y-2 mb-5">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{f}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <div className="w-full py-3.5 rounded-2xl font-bold text-sm text-center bg-green-50 text-green-700 border border-green-200">
                      ✓ Plano ativo
                    </div>
                  ) : checkoutLink ? (
                    <a
                      href={checkoutLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all ${
                        plan.popular
                          ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-md'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      {isDowngrade ? `Mudar para ${plan.name}` : `Assinar ${plan.name}`}
                    </a>
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-1.5 bg-gray-100 text-gray-400 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Em breve
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <p className="text-center text-gray-400 text-xs px-4 mt-4">
          Cancele quando quiser. Sem fidelidade.
        </p>
      </div>
    </div>
  )
}
