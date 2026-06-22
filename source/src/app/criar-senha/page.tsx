'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2, PawPrint, CheckCircle } from 'lucide-react'

export default function CriarSenhaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Supabase redireciona aqui com tokens na hash — a lib lida automaticamente
    supabase.auth.onAuthStateChange(event => {
      if (event === 'PASSWORD_RECOVERY') return
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    if (password.length < 8) { setError('Mínimo 8 caracteres.'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { setError('Erro ao definir senha. Tente novamente.'); setLoading(false); return }
    setDone(true)
    setTimeout(() => router.push('/meu-pet'), 2000)
  }

  if (done) return (
    <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex items-center justify-center p-6">
      <div className="text-center text-white">
        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Senha criada!</h2>
        <p className="text-brand-100 mt-2">Preparando seu desafio...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-4">
            <PawPrint className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Criar sua senha</h1>
          <p className="text-brand-100 mt-1 text-sm">Você está a um passo do desafio</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Nova senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Mínimo 8 caracteres"
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="Repita a senha"
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Começar o Desafio 🐾'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
