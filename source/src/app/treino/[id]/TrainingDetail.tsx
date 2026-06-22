'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, Circle, ChevronRight, ChevronLeft, Target, Lightbulb, Clock, AlertTriangle, ClipboardList } from 'lucide-react'
import { createClient } from '@/lib/supabase'

type Step = {
  id: string; order_index: number; title: string; objective: string
  explanation: string; training: string; common_error: string
  practical_task: string; checklist: string[]
}

export default function TrainingDetail({ module, steps, progress, pet, userId }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [currentStep, setCurrentStep] = useState(progress?.completed_steps || 0)
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const step: Step | undefined = steps[currentStep]
  const isLast = currentStep === steps.length - 1
  const allChecked = step ? checkedItems.size >= step.checklist.length : false

  function toggleCheck(i: number) {
    setCheckedItems(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  async function handleNext() {
    if (!allChecked) return
    setSaving(true)
    const nextStep = currentStep + 1
    const isComplete = nextStep >= steps.length

    const existing = progress?.id
    if (existing) {
      await supabase.from('training_progress').update({
        completed_steps: nextStep,
        status: isComplete ? 'completed' : 'in_progress',
        last_activity: new Date().toISOString(),
      }).eq('id', existing)
    } else {
      await supabase.from('training_progress').insert({
        user_id: userId, module_id: module.id,
        completed_steps: nextStep,
        status: isComplete ? 'completed' : 'in_progress',
      })
    }

    setSaving(false)
    if (isComplete) { setDone(true); return }
    setCurrentStep(nextStep)
    setCheckedItems(new Set())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (done) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-green-500 to-green-700 flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
        <CheckCircle className="w-24 h-24 text-white mx-auto mb-6" />
      </motion.div>
      <h1 className="text-3xl font-extrabold text-white mb-2">Dia concluído!</h1>
      <p className="text-green-100 text-lg mb-8">
        {pet?.name ? `${pet.name} está orgulhoso de você 🐾` : 'Seu cão está orgulhoso 🐾'}
      </p>
      <button
        onClick={() => router.push('/treinos')}
        className="bg-white text-green-700 font-bold px-8 py-4 rounded-2xl text-base"
      >
        Ver todos os dias
      </button>
    </motion.div>
  )

  if (!step) return null

  return (
    <div className="min-h-screen bg-surface pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-500 to-brand-600 px-5 pt-12 pb-6 safe-top">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => router.back()} className="text-white/80 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <p className="text-brand-100 text-xs font-medium">
              {module.order_index === 0 ? 'Introdução' : `Dia ${module.order_index}`}
            </p>
            <h1 className="text-white font-bold text-lg leading-tight">{module.title}</h1>
          </div>
        </div>

        {/* Step progress dots */}
        <div className="flex gap-1.5">
          {steps.map((_: any, i: number) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i < currentStep ? 'bg-white' : i === currentStep ? 'bg-white/70' : 'bg-white/30'
            }`} />
          ))}
        </div>
        <p className="text-brand-100 text-xs mt-2">
          Passo {currentStep + 1} de {steps.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="px-5 pt-5 space-y-4"
        >
          {/* Step title */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-extrabold text-gray-900">{step.title}</h2>
          </div>

          {/* Objetivo */}
          <div className="bg-brand-50 rounded-3xl p-5 border border-brand-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-brand-600" />
              <span className="font-bold text-brand-800 text-sm">Objetivo</span>
            </div>
            <p className="text-brand-900 text-sm leading-relaxed">{step.objective}</p>
          </div>

          {/* Explicação */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-gray-800 text-sm">Por que isso importa</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{step.explanation}</p>
          </div>

          {/* Treino */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-green-500" />
              <span className="font-bold text-gray-800 text-sm">Treino de 10 minutos</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{step.training}</p>
          </div>

          {/* Erro comum */}
          <div className="bg-red-50 rounded-3xl p-5 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span className="font-bold text-red-800 text-sm">Erro comum</span>
            </div>
            <p className="text-red-700 text-sm leading-relaxed">{step.common_error}</p>
          </div>

          {/* Tarefa prática */}
          <div className="bg-emerald-50 rounded-3xl p-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <ChevronRight className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-800 text-sm">Tarefa prática</span>
            </div>
            <p className="text-emerald-700 text-sm leading-relaxed">{step.practical_task}</p>
          </div>

          {/* Checklist */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-gray-800 text-sm">Checklist do dia</span>
              <span className="ml-auto text-xs text-gray-400">{checkedItems.size}/{step.checklist.length}</span>
            </div>
            <div className="space-y-3">
              {step.checklist.map((item: string, i: number) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleCheck(i)}
                  className={`w-full flex items-start gap-3 text-left p-3 rounded-2xl transition-all ${
                    checkedItems.has(i) ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  {checkedItems.has(i)
                    ? <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    : <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />}
                  <span className={`text-sm leading-snug ${checkedItems.has(i) ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                    {item}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 safe-bottom">
        <button
          onClick={handleNext}
          disabled={!allChecked || saving}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            allChecked
              ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? 'Salvando...' : isLast ? 'Concluir dia 🎉' : 'Próximo passo →'}
        </button>
        {!allChecked && (
          <p className="text-center text-gray-400 text-xs mt-2">
            Marque todos os itens do checklist para avançar
          </p>
        )}
      </div>
    </div>
  )
}
