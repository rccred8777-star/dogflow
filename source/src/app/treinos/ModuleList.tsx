'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle, ChevronRight, PawPrint, Trophy, Flame, Star, Crown } from 'lucide-react'

const DAY_CONFIG = [
  { emoji: '👋', label: 'Intro',  gradient: 'from-violet-500 to-purple-700',  photo: '/dogs/day0.jpg' },
  { emoji: '👁️', label: 'Dia 1', gradient: 'from-blue-500 to-blue-700',      photo: '/dogs/day1.jpg' },
  { emoji: '🐾', label: 'Dia 2', gradient: 'from-emerald-500 to-green-700',  photo: '/dogs/day2.jpg' },
  { emoji: '🧘', label: 'Dia 3', gradient: 'from-amber-500 to-orange-600',   photo: '/dogs/day3.jpg' },
  { emoji: '📣', label: 'Dia 4', gradient: 'from-rose-500 to-red-700',       photo: '/dogs/day4.jpg' },
  { emoji: '🦮', label: 'Dia 5', gradient: 'from-sky-500 to-cyan-700',       photo: '/dogs/day5.jpg' },
  { emoji: '🙅', label: 'Dia 6', gradient: 'from-fuchsia-500 to-pink-700',   photo: '/dogs/day6.jpg' },
  { emoji: '🏆', label: 'Dia 7', gradient: 'from-yellow-500 to-amber-600',   photo: '/dogs/day7.jpg' },
]

const PLAN_CONFIGS: Record<string, { label: string; gradient: string; icon: string; photo: string }> = {
  dogflow_basico:   { label: 'Básico',   gradient: 'from-slate-500 to-slate-700',   icon: '📚', photo: '/dogs/day2.jpg' },
  dogflow_premium:  { label: 'Premium',  gradient: 'from-brand-500 to-brand-700',   icon: '⭐', photo: '/dogs/day5.jpg' },
  dogflow_pro:      { label: 'Pro',      gradient: 'from-amber-500 to-amber-700',   icon: '👑', photo: '/dogs/day7.jpg' },
  dogflow_caocalmo: { label: 'Cão Calmo', gradient: 'from-teal-500 to-teal-700',    icon: '😌', photo: '/dogs/day6.jpg' },
}

const PLAN_LOCK_LABELS: Record<string, string> = {
  basico:   '🔒 Disponível no Básico',
  premium:  '⭐ Disponível no Premium',
  pro:      '👑 Disponível no Pro',
  caocalmo: '🔒 Módulo Cão Calmo — R$47',
}

function formatHoursLeft(h: number) {
  if (h <= 0) return ''
  if (h < 1) return `${Math.ceil(h * 60)}min`
  if (h < 24) return `${Math.ceil(h)}h`
  return `${Math.ceil(h / 24)}d`
}

export default function ModuleList({ modules, pet, userPlan, hasCalmo }: any) {
  const router = useRouter()

  const desafioModules = modules.filter((m: any) => m.product === 'dogflow_7dias')
  const subscriptionModules = modules.filter((m: any) => m.product !== 'dogflow_7dias')

  const completed = desafioModules.filter((m: any) => m.progress?.status === 'completed').length
  const total = desafioModules.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

  function renderCard(module: any, i: number, isDesafio: boolean) {
    const cfg = isDesafio
      ? (DAY_CONFIG[i] || DAY_CONFIG[0])
      : { ...PLAN_CONFIGS[module.product], label: PLAN_CONFIGS[module.product]?.label || 'Extra', emoji: PLAN_CONFIGS[module.product]?.icon || '📚' }

    const photo = (cfg as any).photo || '/dogs/day0.jpg'
    const isCompleted = module.progress?.status === 'completed'
    const isLocked = !module.unlocked
    const lockedByPlan = module.lockedByPlan
    const stepsTotal = module.stepCount || 1
    const stepsDone = module.progress?.completed_steps || 0
    const inProgress = stepsDone > 0 && !isCompleted
    const stepPct = Math.round((stepsDone / stepsTotal) * 100)

    return (
      <motion.div
        key={module.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04 }}
        onClick={() => {
          if (lockedByPlan) { 
            const isCalmoLock = module.required_plan === 'caocalmo'
            router.push(isCalmoLock ? 'https://pay.kiwify.com.br/TDTPcu6' : '/planos')
            return
          }
          if (!isLocked) router.push(`/treino/${module.id}`)
        }}
        className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all ${
          lockedByPlan
            ? 'cursor-pointer hover:shadow-md border-gray-100 opacity-80'
            : isLocked
            ? 'opacity-55 cursor-not-allowed border-gray-100'
            : isCompleted
            ? 'cursor-pointer hover:shadow-md border-green-100'
            : 'cursor-pointer hover:shadow-md active:scale-[0.99] border-gray-100'
        }`}
      >
        <div className="relative h-36 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={module.title} className={`w-full h-full object-cover ${lockedByPlan ? 'grayscale' : ''}`} />
          <div className={`absolute inset-0 bg-gradient-to-t ${cfg.gradient} opacity-60`} />

          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {cfg.label}
            </span>
          </div>

          {/* Status */}
          <div className="absolute top-3 right-3">
            {isCompleted && <div className="bg-green-500 rounded-full p-1"><CheckCircle className="w-4 h-4 text-white" /></div>}
            {lockedByPlan && <div className="bg-black/50 backdrop-blur-sm rounded-full p-1.5"><Lock className="w-3.5 h-3.5 text-white" /></div>}
            {!lockedByPlan && isLocked && <div className="bg-black/40 backdrop-blur-sm rounded-full p-1.5"><Lock className="w-3.5 h-3.5 text-white" /></div>}
          </div>

          {/* Título */}
          <div className="absolute bottom-3 left-3 right-10">
            <h3 className="text-white font-bold text-base leading-tight drop-shadow-md">{module.title}</h3>
          </div>
        </div>

        <div className="px-4 py-3 flex items-center justify-between">
          {lockedByPlan ? (
            <p className="text-xs font-semibold text-brand-500">{PLAN_LOCK_LABELS[module.required_plan] || '🔒 Plano necessário'}</p>
          ) : isLocked ? (
            <p className="text-xs text-gray-400">🔒 Libera em {formatHoursLeft(module.hoursLeft)}</p>
          ) : inProgress ? (
            <div className="flex-1 mr-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Em andamento</span><span className="font-semibold text-brand-500">{stepPct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${stepPct}%` }} />
              </div>
            </div>
          ) : isCompleted ? (
            <span className="text-green-600 text-sm font-semibold">✓ Concluído</span>
          ) : (
            <span className="text-brand-500 text-sm font-semibold">Pronto para começar</span>
          )}
          {!isLocked && <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />}
          {lockedByPlan && <ChevronRight className="w-5 h-5 text-brand-300 flex-shrink-0" />}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-5 pt-14 pb-24 safe-top relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="flex items-center justify-between mb-1 relative">
          <div className="flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-semibold tracking-wide">DogFlow</span>
          </div>
          <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full capitalize">
            {userPlan === 'desafio' ? 'Desafio 7 Dias' : userPlan}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-4 relative">
          <button
            onClick={() => router.push('/meu-pet')}
            className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg flex-shrink-0 active:scale-95 transition-transform"
          >
            {pet?.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex flex-col items-center justify-center gap-0.5">
                <span className="text-2xl">🐾</span>
                <span className="text-white/70 text-[9px] font-bold">FOTO</span>
              </div>
            )}
          </button>
          <div>
            <h1 className="text-white text-2xl font-extrabold leading-tight">
              {pet?.name ? `Olá, ${pet.name}!` : 'Seu Desafio'}
            </h1>
            <p className="text-white/70 text-sm mt-0.5">Continue seu progresso hoje</p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-16">
        {/* Progress card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-brand-50 p-1.5 rounded-xl">
                <Trophy className="w-4 h-4 text-brand-500" />
              </div>
              <span className="font-bold text-gray-800 text-sm">Desafio 7 Dias</span>
            </div>
            <div className="flex items-center gap-1.5">
              {completed > 0 && <Flame className="w-4 h-4 text-orange-400" />}
              <span className="text-sm font-bold text-gray-500">{completed}/{total} dias</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="bg-gradient-to-r from-brand-400 to-brand-600 h-2.5 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span className="font-semibold text-brand-500">{pct}%</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Desafio 7 Dias */}
        <div className="space-y-3 mb-6">
          {desafioModules.map((module: any, i: number) => renderCard(module, i, true))}
        </div>

        {/* Módulos de assinatura */}
        {subscriptionModules.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-bold text-gray-600 uppercase tracking-wide">Conteúdo Extra</h2>
            </div>
            <div className="space-y-3">
              {subscriptionModules.map((module: any, i: number) => renderCard(module, i, false))}
            </div>

            {/* Banner upgrade */}
            {userPlan === 'desafio' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => router.push('/planos')}
                className="mt-4 bg-gradient-to-r from-brand-500 to-brand-700 rounded-3xl p-5 cursor-pointer active:scale-[0.99] shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <Crown className="w-8 h-8 text-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white font-bold text-base">Desbloqueie tudo</p>
                    <p className="text-white/70 text-xs mt-0.5">A partir de R$29,90/mês — cancele quando quiser</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Streak component — exportado para uso independente
export function StreakBadge({ streak }: { streak: number }) {
  if (streak < 1) return null
  return (
    <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
      <span className="text-base">🔥</span>
      <span className="text-orange-600 font-bold text-sm">{streak} dia{streak > 1 ? 's' : ''}</span>
    </div>
  )
}
