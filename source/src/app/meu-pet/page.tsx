'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2, PawPrint, Camera, X } from 'lucide-react'

const PROBLEMS = [
  { value: 'xixi',       emoji: '💧', label: 'Faz xixi fora do lugar' },
  { value: 'guia',       emoji: '🦮', label: 'Puxa demais na guia' },
  { value: 'latido',     emoji: '🔊', label: 'Late sem parar' },
  { value: 'pulo',       emoji: '🦘', label: 'Pula em todo mundo' },
  { value: 'filhote',    emoji: '🐶', label: 'Filhote bagunceiro' },
  { value: 'ansioso',    emoji: '😰', label: 'Ansioso / destrói a casa' },
]

export default function MeuPetPage() {
  const router = useRouter()
  const supabase = createClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [petId, setPetId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [ageMonths, setAgeMonths] = useState('')
  const [problem, setProblem] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('pets').select('*').eq('user_id', user.id).single().then(({ data }) => {
        if (data) {
          setPetId(data.id)
          setName(data.name || '')
          setBreed(data.breed || '')
          setAgeMonths(data.age_months ? String(data.age_months) : '')
          setProblem(data.main_problem || '')
          if (data.photo_url) setPhotoPreview(data.photo_url)
        }
      })
    })
  }, [])

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Foto deve ter menos de 5MB.'); return }
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!problem) { setError('Escolha o principal problema do seu cão.'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    let photo_url: string | null = null

    if (photoFile) {
      const ext = photoFile.name.split('.').pop() || 'jpg'
      const path = `${user.id}/pet.${ext}`
      const { error: upErr } = await supabase.storage
        .from('pets')
        .upload(path, photoFile, { upsert: true, contentType: photoFile.type })

      if (upErr) {
        console.error('upload error', upErr)
      } else {
        const { data } = supabase.storage.from('pets').getPublicUrl(path)
        photo_url = data.publicUrl
      }
    }

    const petData = {
      name,
      breed: breed || null,
      age_months: ageMonths ? parseInt(ageMonths) : null,
      main_problem: problem,
      ...(photo_url ? { photo_url } : {}),
    }

    const { error: dbErr } = petId
      ? await supabase.from('pets').update(petData).eq('id', petId)
      : await supabase.from('pets').insert({ user_id: user.id, ...petData })

    if (dbErr) { setError('Erro ao salvar. Tente novamente.'); setLoading(false); return }
    router.push('/treinos')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-6 pt-14 pb-10 safe-top relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="flex items-center gap-3 relative">
          <PawPrint className="w-7 h-7 text-white" />
          <div>
            <h1 className="text-xl font-bold text-white">Cadastre seu cão</h1>
            <p className="text-white/70 text-sm">Para personalizar seu desafio</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Foto do cão */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-100 border-4 border-brand-100 flex items-center justify-center transition-all hover:border-brand-300 active:scale-95"
              >
                {photoPreview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="foto do cão" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-400">
                    <Camera className="w-8 h-8" />
                    <span className="text-xs font-medium">Adicionar</span>
                  </div>
                )}
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => { setPhotoFile(null); setPhotoPreview(null) }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400"
                >
                  <X className="w-3 h-3" /> Remover foto
                </button>
              )}
              <p className="text-xs text-gray-400">Foto do seu cão (opcional)</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Nome */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Nome do cão *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Ex: Rex, Bolinha, Luna..."
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
              />
            </div>

            {/* Raça */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Raça</label>
              <input
                value={breed}
                onChange={e => setBreed(e.target.value)}
                placeholder="Ex: Labrador, SRD, Poodle..."
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
              />
            </div>

            {/* Idade */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Idade (em meses)</label>
              <input
                type="number"
                value={ageMonths}
                onChange={e => setAgeMonths(e.target.value)}
                placeholder="Ex: 6, 12, 24..."
                min="1"
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
              />
            </div>

            {/* Problema */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Principal problema *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROBLEMS.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setProblem(p.value)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-2xl border text-left text-sm font-medium transition-all ${
                      problem === p.value
                        ? 'bg-brand-500 text-white border-brand-500 shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300'
                    }`}
                  >
                    <span className="text-lg">{p.emoji}</span>
                    <span className="leading-tight">{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

            <button
              type="submit"
              disabled={loading || !name || !problem}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-base"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : petId ? 'Salvar alterações 🐾' : 'Começar o Desafio 🐾'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
