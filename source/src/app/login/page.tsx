'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Loader2, PawPrint } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(''); setMsg('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('E-mail ou senha incorretos.'); setLoading(false); return }
    router.push('/treinos')
  }

  async function handleReset() {
    setError(''); setMsg('')
    if (!email) { setError('Digite seu e-mail no campo acima primeiro.'); return }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/criar-senha`,
    })
    if (error) { setError('Não foi possível enviar agora. Tente de novo.'); return }
    setMsg('Enviamos um link de recuperação para o seu e-mail. Verifique a caixa de entrada e o spam.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-500 to-brand-700 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-lg mb-4">
            <PawPrint className="w-10 h-10 text-brand-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">DogFlow</h1>
          <p className="text-brand-100 mt-1 text-sm">Desafio 7 Dias — Cão Mais Educado</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Entrar na sua conta</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-900 text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">{error}</p>
            )}
            {msg && (
              <p className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-xl">{msg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-sm text-brand-600 hover:underline mt-1"
            >
              Esqueci minha senha
            </button>
          </form>
        </div>

        <p className="text-center text-brand-100 text-xs mt-6">
          Acesso exclusivo para compradores do DogFlow.
        </p>
      </div>
    </div>
  )
}
