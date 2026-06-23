'use client'

import { Flame, Trophy, Check } from 'lucide-react'

const BADGES = [
  { key: 'first_day', icon: '🐾', label: 'Primeiro Passo' },
  { key: 'day3',      icon: '⚡', label: 'Sequência de 3' },
  { key: 'day7',      icon: '🏆', label: 'Missão Cumprida' },
  { key: 'streak7',   icon: '🔥', label: 'Em Chamas' },
  { key: 'streak30',  icon: '👑', label: 'Mestre DogFlow' },
  { key: 'completed', icon: '🎓', label: 'Graduado' },
]

const card = { background: '#fff', border: '1px solid #F0EDE6', borderRadius: 20, boxShadow: '0 2px 8px -4px rgba(40,30,15,0.08)' } as const

export default function ProgressView({ modules, streak, badges }: any) {
  const completed = modules.filter((m: any) => m.progress?.status === 'completed').length
  const total = modules.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const earnedKeys = new Set((badges || []).map((b: any) => b.badge_key))

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', padding: '8px 20px 120px' }}>
      <h1 style={{ fontSize: 25, fontWeight: 800, color: '#1A1814', letterSpacing: '-0.6px', margin: '0 0 22px' }}>Meu Progresso</h1>

      {/* stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        <div style={{ ...card, flex: 1, padding: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FFEFE0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F26B0F', marginBottom: 12 }}>
            <Flame style={{ width: 22, height: 22 }} fill="currentColor" stroke="none" />
          </div>
          <p style={{ fontSize: 30, fontWeight: 800, color: '#1A1814', margin: 0, lineHeight: 1 }}>{streak?.current_streak || 0}<span style={{ fontSize: 14, color: '#A8A296', fontWeight: 700, marginLeft: 3 }}>dias</span></p>
          <p style={{ fontSize: 12, color: '#A8A296', margin: '6px 0 0', fontWeight: 600 }}>Sequência atual</p>
        </div>
        <div style={{ ...card, flex: 1, padding: 18 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EDEBF7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6F5FE0', marginBottom: 12 }}>
            <Trophy style={{ width: 22, height: 22 }} strokeWidth={2} />
          </div>
          <p style={{ fontSize: 30, fontWeight: 800, color: '#1A1814', margin: 0, lineHeight: 1 }}>{streak?.longest_streak || 0}<span style={{ fontSize: 14, color: '#A8A296', fontWeight: 700, marginLeft: 3 }}>dias</span></p>
          <p style={{ fontSize: 12, color: '#A8A296', margin: '6px 0 0', fontWeight: 600 }}>Recorde</p>
        </div>
      </div>

      {/* progresso geral */}
      <div style={{ ...card, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1814' }}>Desafio 7 Dias</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#F26B0F' }}>{completed}/{total}</span>
        </div>
        <div style={{ height: 9, background: '#F1EEE7', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#F26B0F', borderRadius: 999, transition: 'width .8s ease' }} />
        </div>
      </div>

      {/* conquistas */}
      <div style={{ ...card, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1814' }}>Conquistas</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#A8A296' }}>{earnedKeys.size} de {BADGES.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {BADGES.map((b) => {
            const earned = earnedKeys.has(b.key)
            return (
              <div key={b.key} style={{ borderRadius: 16, padding: '13px 8px', textAlign: 'center', background: earned ? '#FFF6EF' : '#F7F5F0', border: `1px solid ${earned ? '#FFE0C7' : '#F0EDE6'}`, opacity: earned ? 1 : 0.55 }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: earned ? '#F26B0F' : '#E5E1D8', fontSize: 18 }}>{b.icon}</div>
                <p style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.2, margin: 0, color: earned ? '#A35408' : '#A8A296' }}>{b.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* módulos */}
      <div style={{ ...card, padding: 20 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', display: 'block', marginBottom: 6 }}>Módulos</span>
        <div>
          {modules.map((m: any) => {
            const done = m.progress?.status === 'completed'
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #F4F1EA' }}>
                {done
                  ? <span style={{ color: '#1B9E5A', display: 'flex', flexShrink: 0 }}><Check style={{ width: 20, height: 20 }} strokeWidth={2.6} /></span>
                  : <span style={{ width: 20, height: 20, borderRadius: 999, border: '2px solid #E2DCD0', flexShrink: 0, display: 'block' }} />}
                <p style={{ fontSize: 13.5, margin: 0, fontWeight: done ? 500 : 600, color: done ? '#B7B1A4' : '#3A352D', textDecoration: done ? 'line-through' : 'none' }}>{m.title}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
