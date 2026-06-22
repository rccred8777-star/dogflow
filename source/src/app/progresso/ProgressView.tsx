'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CheckCircle, Circle, Trophy, Flame, PawPrint, Star } from 'lucide-react'

export default function ProgressView({ modules, progress, pet, purchasedAt }: any) {
  const router = useRouter()
  const completed = modules.filter((m: any) =>
    progress.find((p: any) => p.module_id === m.id && p.status === 'completed')
  ).length
  const total = modules.length
  const pct = Math.round((completed / total) * 100)

  const daysSince = Math.floor((Date.now() - new Date(purchasedAt).getTime()) / 86400000)

  return (
    <div className="min-h-screen bg-surface pb-10">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-500 to-brand-600 px-5 pt-12 pb-8 safe-top">
        <div className="flex items-center gap-2 mb-1">
          <PawPrint className="w-6 h-6 text-white" />
          <span className="text-white font-bold text-lg">DogFlow</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white mt-2">Seu Progresso</h1>
        {pet && <p className="text-brand-100 text-sm">{pet.name} • {pet.breed || 'Cão'}</p>}
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Big progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 text-sm">Desafio 7 Dias</p>
              <p className="text-3xl font-extrabold text-gray-900">{pct}%</p>
            </div>
            <Trophy className={`w-12 h-12 ${pct === 100 ? 'text-yellow-400' : 'text-gray-200'}`} />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-4 rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">{completed} de {total} dias concluídos</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm text-center"
          >
            <Flame className="w-8 h-8 text-brand-500 mx-auto mb-1" />
            <p className="text-2xl font-extrabold text-gray-900">{completed}</p>
            <p className="text-gray-500 text-xs">Dias concluídos</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm text-center"
          >
            <Star className="w-8 h-8 text-amber-400 mx-auto mb-1" />
            <p className="text-2xl font-extrabold text-gray-900">{daysSince}</p>
            <p className="text-gray-500 text-xs">Dias no desafio</p>
          </motion.div>
        </div>

        {/* Day list */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Dias do desafio</h3>
          <div className="space-y-3">
            {modules.map((m: any, i: number) => {
              const p = progress.find((pr: any) => pr.module_id === m.id)
              const isCompleted = p?.status === 'completed'
              const inProgress = p && !isCompleted
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => router.push(`/treino/${m.id}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  {isCompleted
                    ? <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    : inProgress
                    ? <div className="w-6 h-6 rounded-full border-2 border-brand-400 flex-shrink-0 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-400" />
                      </div>
                    : <Circle className="w-6 h-6 text-gray-200 flex-shrink-0" />}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                      {m.order_index === 0 ? 'Introdução' : `Dia ${m.order_index}`} — {m.title}
                    </p>
                    {inProgress && (
                      <p className="text-xs text-brand-500 mt-0.5">Em andamento</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {pct === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-yellow-400 to-brand-500 rounded-3xl p-6 text-center text-white shadow-lg"
          >
            <Trophy className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-xl font-extrabold mb-1">Desafio Concluído! 🎉</h3>
            <p className="text-white/90 text-sm">
              {pet?.name || 'Seu cão'} e você completaram os 7 dias. Incrível!
            </p>
            <button
              onClick={() => router.push('/planos')}
              className="mt-4 bg-white text-brand-600 font-bold px-6 py-3 rounded-2xl text-sm"
            >
              Ver próximos planos →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
