'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, Syringe, Weight, Stethoscope, Pill, ChevronRight, X, Check, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

type Vaccine = {
  id: string; name: string; date_applied: string; next_dose?: string
  veterinarian?: string; notes?: string
}
type HealthRecord = {
  id: string; type: string; date: string; value?: string; notes?: string
}

const VACCINE_NAMES = [
  'V8 / V10 (Polivalente)', 'Antirrábica', 'Gripe Canina (Tosse dos Canis)',
  'Leishmaniose', 'Giardia', 'Outra'
]

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  weight:     { label: 'Peso',        icon: Weight,       color: 'text-blue-500',   bg: 'bg-blue-50 border-blue-100' },
  vet_visit:  { label: 'Consulta',    icon: Stethoscope,  color: 'text-purple-500', bg: 'bg-purple-50 border-purple-100' },
  deworming:  { label: 'Vermífugo',   icon: Pill,         color: 'text-green-500',  bg: 'bg-green-50 border-green-100' },
  medication: { label: 'Medicamento', icon: Pill,         color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100' },
  other:      { label: 'Outro',       icon: Stethoscope,  color: 'text-gray-500',   bg: 'bg-gray-50 border-gray-100' },
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR')
}

function daysUntil(d: string) {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000)
  return diff
}

export default function SaudeView({ pet, vaccines, healthRecords, userId }: {
  pet: any; vaccines: Vaccine[]; healthRecords: HealthRecord[]; userId: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<'vacinas' | 'saude'>('vacinas')
  const [showVaccineForm, setShowVaccineForm] = useState(false)
  const [showHealthForm, setShowHealthForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [localVaccines, setLocalVaccines] = useState<Vaccine[]>(vaccines)
  const [localHealth, setLocalHealth] = useState<HealthRecord[]>(healthRecords)

  const [vForm, setVForm] = useState({ name: '', date_applied: '', next_dose: '', veterinarian: '', notes: '' })
  const [hForm, setHForm] = useState({ type: 'weight', date: '', value: '', notes: '' })

  async function saveVaccine() {
    if (!vForm.name || !vForm.date_applied || !pet?.id) return
    setSaving(true)
    const { data, error } = await supabase.from('vaccines').insert({
      pet_id: pet.id, user_id: userId,
      name: vForm.name, date_applied: vForm.date_applied,
      next_dose: vForm.next_dose || null,
      veterinarian: vForm.veterinarian || null,
      notes: vForm.notes || null,
    }).select().single()
    if (!error && data) setLocalVaccines(prev => [data, ...prev])
    setSaving(false)
    setShowVaccineForm(false)
    setVForm({ name: '', date_applied: '', next_dose: '', veterinarian: '', notes: '' })
  }

  async function saveHealth() {
    if (!hForm.type || !hForm.date || !pet?.id) return
    setSaving(true)
    const { data, error } = await supabase.from('health_records').insert({
      pet_id: pet.id, user_id: userId,
      type: hForm.type, date: hForm.date,
      value: hForm.value || null, notes: hForm.notes || null,
    }).select().single()
    if (!error && data) setLocalHealth(prev => [data, ...prev])
    setSaving(false)
    setShowHealthForm(false)
    setHForm({ type: 'weight', date: '', value: '', notes: '' })
  }

  const upcomingVaccines = localVaccines.filter(v => v.next_dose && daysUntil(v.next_dose) <= 30 && daysUntil(v.next_dose) >= 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-5 pt-14 pb-8 safe-top">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.back()} className="text-white/80">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <p className="text-brand-100 text-xs font-medium">
              {pet?.name ? `🐾 ${pet.name}` : '🐾 Meu Pet'}
            </p>
            <h1 className="text-white font-bold text-xl">Caderneta de Saúde</h1>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Alertas de vacina próxima */}
        {upcomingVaccines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-800 text-sm">Vacina próxima</p>
              {upcomingVaccines.map(v => (
                <p key={v.id} className="text-amber-700 text-xs mt-0.5">
                  {v.name} — {formatDate(v.next_dose!)} ({daysUntil(v.next_dose!)} dias)
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-1 flex mb-4 border border-gray-100 shadow-sm">
          {(['vacinas', 'saude'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? 'bg-brand-500 text-white shadow-sm' : 'text-gray-500'
              }`}
            >
              {t === 'vacinas' ? '💉 Vacinas' : '📋 Saúde'}
            </button>
          ))}
        </div>

        {/* VACINAS */}
        {tab === 'vacinas' && (
          <AnimatePresence mode="wait">
            <motion.div key="vacinas" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setShowVaccineForm(true)}
                className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-4 shadow-sm"
              >
                <Plus className="w-5 h-5" /> Registrar Vacina
              </button>

              {localVaccines.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Syringe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhuma vacina registrada ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localVaccines.map((v, i) => (
                    <motion.div
                      key={v.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-brand-50 p-2 rounded-xl">
                            <Syringe className="w-4 h-4 text-brand-500" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">{v.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Aplicada em {formatDate(v.date_applied)}</p>
                          </div>
                        </div>
                        {v.next_dose && (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            daysUntil(v.next_dose) < 0 ? 'bg-red-100 text-red-600' :
                            daysUntil(v.next_dose) <= 30 ? 'bg-amber-100 text-amber-600' :
                            'bg-green-100 text-green-600'
                          }`}>
                            {daysUntil(v.next_dose) < 0 ? 'Vencida' :
                             daysUntil(v.next_dose) === 0 ? 'Hoje' :
                             `Reforço em ${daysUntil(v.next_dose)}d`}
                          </span>
                        )}
                      </div>
                      {v.next_dose && (
                        <p className="text-xs text-gray-400 mt-2 ml-11">
                          Próxima dose: {formatDate(v.next_dose)}
                        </p>
                      )}
                      {v.veterinarian && (
                        <p className="text-xs text-gray-400 mt-0.5 ml-11">Vet: {v.veterinarian}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* SAÚDE */}
        {tab === 'saude' && (
          <AnimatePresence mode="wait">
            <motion.div key="saude" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <button
                onClick={() => setShowHealthForm(true)}
                className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 mb-4 shadow-sm"
              >
                <Plus className="w-5 h-5" /> Adicionar Registro
              </button>

              {localHealth.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Nenhum registro ainda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {localHealth.map((h, i) => {
                    const cfg = TYPE_CONFIG[h.type] || TYPE_CONFIG.other
                    const Icon = cfg.icon
                    return (
                      <motion.div
                        key={h.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`bg-white rounded-2xl p-4 border shadow-sm ${cfg.bg}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-gray-800 text-sm">{cfg.label}</p>
                              <p className="text-xs text-gray-400">{formatDate(h.date)}</p>
                            </div>
                            {h.value && <p className="text-sm text-gray-600 mt-0.5">{h.value}</p>}
                            {h.notes && <p className="text-xs text-gray-400 mt-0.5">{h.notes}</p>}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* MODAL VACINA */}
      <AnimatePresence>
        {showVaccineForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowVaccineForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full rounded-t-3xl p-6 safe-bottom max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800 text-lg">Registrar Vacina</h2>
                <button onClick={() => setShowVaccineForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Vacina *</label>
                  <select
                    value={vForm.name}
                    onChange={e => setVForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  >
                    <option value="">Selecione...</option>
                    {VACCINE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Data de aplicação *</label>
                  <input type="date" value={vForm.date_applied}
                    onChange={e => setVForm(p => ({ ...p, date_applied: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Próxima dose (opcional)</label>
                  <input type="date" value={vForm.next_dose}
                    onChange={e => setVForm(p => ({ ...p, next_dose: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Veterinário (opcional)</label>
                  <input type="text" placeholder="Dr. João Silva" value={vForm.veterinarian}
                    onChange={e => setVForm(p => ({ ...p, veterinarian: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Observações (opcional)</label>
                  <textarea rows={2} placeholder="Reação, lote..." value={vForm.notes}
                    onChange={e => setVForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 resize-none"
                  />
                </div>

                <button
                  onClick={saveVaccine}
                  disabled={!vForm.name || !vForm.date_applied || saving}
                  className="w-full bg-brand-500 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  {saving ? 'Salvando...' : <><Check className="w-5 h-5" /> Salvar Vacina</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL SAÚDE */}
      <AnimatePresence>
        {showHealthForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowHealthForm(false)}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-white w-full rounded-t-3xl p-6 safe-bottom"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-800 text-lg">Adicionar Registro</h2>
                <button onClick={() => setShowHealthForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Tipo *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(TYPE_CONFIG).map(([k, v]) => (
                      <button key={k}
                        onClick={() => setHForm(p => ({ ...p, type: k }))}
                        className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                          hForm.type === k ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Data *</label>
                  <input type="date" value={hForm.date}
                    onChange={e => setHForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                    {hForm.type === 'weight' ? 'Peso (kg)' : 'Valor / Nome'}
                  </label>
                  <input type="text"
                    placeholder={hForm.type === 'weight' ? 'Ex: 8.5' : 'Ex: Vermox, Dr. Ana...'}
                    value={hForm.value}
                    onChange={e => setHForm(p => ({ ...p, value: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Observações (opcional)</label>
                  <textarea rows={2} value={hForm.notes}
                    onChange={e => setHForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 resize-none"
                  />
                </div>

                <button
                  onClick={saveHealth}
                  disabled={!hForm.date || saving}
                  className="w-full bg-brand-500 disabled:bg-gray-200 text-white disabled:text-gray-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  {saving ? 'Salvando...' : <><Check className="w-5 h-5" /> Salvar Registro</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
