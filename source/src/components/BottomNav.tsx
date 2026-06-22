'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Heart, TrendingUp, User } from 'lucide-react'

const TABS = [
  { href: '/treinos',  icon: Home,        label: 'Início' },
  { href: '/saude',    icon: Heart,       label: 'Saúde' },
  { href: '/progresso',icon: TrendingUp,  label: 'Progresso' },
  { href: '/meu-pet',  icon: User,        label: 'Meu Pet' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-bottom z-40">
      <div className="flex">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors ${
                active ? 'text-brand-500' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
