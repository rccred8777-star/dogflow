'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PawPrint, BarChart2, Sparkles } from 'lucide-react'

const LINKS = [
  { href: '/treinos',   label: 'Treinos',   Icon: PawPrint },
  { href: '/progresso', label: 'Progresso', Icon: BarChart2 },
  { href: '/planos',    label: 'Planos',    Icon: Sparkles },
]

const HIDDEN_ON = ['/login', '/criar-senha', '/acesso-negado', '/meu-pet', '/treino/']

export default function BottomNav() {
  const pathname = usePathname()
  if (HIDDEN_ON.some(p => pathname.startsWith(p))) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-50">
      <div className="flex">
        {LINKS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
                active ? 'text-brand-500' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
