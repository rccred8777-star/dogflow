import { PawPrint, Lock } from 'lucide-react'
import Link from 'next/link'

export default function AcessoNegadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mb-4">
          <Lock className="w-10 h-10 text-white/60" />
        </div>
        <PawPrint className="w-8 h-8 text-brand-400 mx-auto" />
      </div>
      <h1 className="text-2xl font-extrabold text-white mb-2">Acesso não encontrado</h1>
      <p className="text-gray-400 text-sm max-w-xs mb-8">
        Este conteúdo é exclusivo para compradores do DogFlow. Se você já comprou, verifique seu e-mail para o link de acesso.
      </p>
      <Link
        href="/login"
        className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
      >
        Entrar na minha conta
      </Link>
      <p className="text-gray-500 text-xs mt-6">
        Ainda não tem o DogFlow?{' '}
        <a href={process.env.NEXT_PUBLIC_SITE_URL || '/'} className="text-brand-400 underline">
          Adquirir agora
        </a>
      </p>
    </div>
  )
}
