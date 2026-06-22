'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flame, Trophy, Star, Award, CheckCircle } from 'lucide-react'

const BADGES = [
  { key: 'first_day', icon: '🐾', label: 'Primeiro Passo',    desc: 'Completou o primeiro dia' },
  { key: 'day3',      icon: '⚡', label: 'Sequência de 3',    desc: 'Completou 3 dias seguidos' },
  { key: 'day7',      icon: '🏆', label: 'Missão Cumprida',   desc: 'Completou o desafio de 7 dias' },
  { key: 'streak7',   icon: '🔥', label: 'Em Chamas',         desc: '7 dias de sequência' },
  { key: 'streak30',  icon: '👑', label: 'Mestre DogFlow',    desc: '30 dias de sequência' },
  { key: 'completed', icon: '🎓', label: 'Graduado',          desc: 'Completou todos os módulos' },
]

export default function ProgressView({ modules, streak, badges, pet }: any) {
  const router = useRouter()
  const completed = modules.filter((m: any) => m.progress?.status === 'completed').length
  const total = modules.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const earnedKeys = new Set((badges || []).map((b: any) => b.badge_key))

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-5 pt-14 pb-8 safe-top">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-xl">Meu Progresso</h1>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {/* Streak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 rounded-2xl p-3">
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Sequência atual</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {streak?.current_streak || 0} <span className="text-lg font-bold text-gray-400">dias</span>
              </p>
              {streak?.longest_streak > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">Recorde: {streak.longest_streak} dias</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Progresso geral */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-gray-800">Desafio 7 Dias</span>
            <span className="ml-auto text-sm font-bold text-brand-500">{completed}/{total} dias</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full"
            />
          </div>
          <p className="text-right text-xs text-brand-500 font-bold mt-1">{pct}%</p>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-gray-800">Conquistas</span>
            <span className="ml-auto text-xs text-gray-400">{earnedKeys.size}/{BADGES.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((b, i) => {
              const earned = earnedKeys.has(b.key)
              return (
                <motion.div
                  key={b.key}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className={`rounded-2xl p-3 text-center border transition-all ${
                    earned
                      ? 'bg-brand-50 border-brand-200'
                      : 'bg-gray-50 border-gray-100 opacity-40'
                  }`}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <p className={`text-[11px] font-bold leading-tight ${earned ? 'text-brand-700' : 'text-gray-400'}`}>
                    {b.label}
                  </p>
                  {earned && <CheckCircle className="w-3 h-3 text-brand-400 mx-auto mt-1" />}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Lista de módulos */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-gray-800">Módulos</span>
          </div>
          <div className="space-y-2">
            {modules.map((m: any) => (
              <div key={m.id} className="flex items-center gap-3 py-2">
                {m.progress?.status === 'completed'
                  ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  : <div className="w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />}
                <p className={`text-sm ${m.progress?.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                  {m.title}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
