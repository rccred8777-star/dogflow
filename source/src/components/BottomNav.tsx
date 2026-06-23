'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Heart, TrendingUp, User } from 'lucide-react'

const TABS = [
  { href: '/treinos',   icon: Home,       label: 'Início' },
  { href: '/saude',     icon: Heart,      label: 'Saúde' },
  { href: '/progresso', icon: TrendingUp, label: 'Progresso' },
  { href: '/meu-pet',   icon: User,       label: 'Meu Pet' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom bg-white"
      style={{ borderTop: '1px solid #F0EDE6', boxShadow: '0 -4px 20px -8px rgba(40,30,15,0.10)' }}
    >
      <div className="flex px-3 pt-2">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              className="flex-1 flex flex-col items-center gap-1 py-1.5"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: active ? '#F26B0F' : '#B7B1A4' }}
            >
              <Icon style={{ width: 23, height: 23 }} strokeWidth={2} />
              <span style={{ fontSize: '10.5px', fontWeight: 700 }}>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
