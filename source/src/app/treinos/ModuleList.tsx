'use client'

import { useRouter } from 'next/navigation'
import { Lock, Check, ChevronRight, PawPrint } from 'lucide-react'
import { fbqTrack } from '@/lib/fbpixel'

const PLAN_LOCK_LABELS: Record<string, string> = {
  basico:   'Disponível no Básico',
  premium:  'Disponível no Premium',
  pro:      'Disponível no Pro',
  caocalmo: 'Módulo Cão Calmo — R$47',
}

const PLAN_EMOJI: Record<string, string> = {
  basico: '📚', premium: '⭐', pro: '👑', caocalmo: '😌',
}

function formatHoursLeft(h: number) {
  if (h <= 0) return ''
  if (h < 1) return `${Math.ceil(h * 60)}min`
  if (h < 24) return `${Math.ceil(h)}h`
  return `${Math.ceil(h / 24)}d`
}

export default function ModuleList({ modules, pet, userPlan, hasCalmo }: any) {
  const router = useRouter()

  const desafioModules = modules.filter((m: any) => m.product === 'dogflow_7dias')
  const subscriptionModules = modules.filter((m: any) => m.product !== 'dogflow_7dias')

  const completed = desafioModules.filter((m: any) => m.progress?.status === 'completed').length
  const total = desafioModules.length || 1
  const pct = Math.round((completed / total) * 100)
  const faltam = Math.max(0, total - completed)

  function openModule(module: any) {
    if (module.lockedByPlan) {
      if (module.required_plan === 'caocalmo') {
        fbqTrack('InitiateCheckout', { content_name: 'Cão Calmo', content_category: 'dogflow', value: 47, currency: 'BRL' })
        router.push('https://pay.kiwify.com.br/gmD7yDF')
      } else {
        router.push('/planos')
      }
      return
    }
    if (module.unlocked) router.push(`/treino/${module.id}`)
  }

  function DayCard({ module }: any) {
    const isCompleted = module.progress?.status === 'completed'
    const isLocked = !module.unlocked
    const lockedByPlan = module.lockedByPlan
    const stepsTotal = module.stepCount || 1
    const stepsDone = module.progress?.completed_steps || 0
    const inProgress = stepsDone > 0 && !isCompleted
    const stepPct = Math.round((stepsDone / stepsTotal) * 100)
    const num = module.order_index

    return (
      <div
        onClick={() => openModule(module)}
        style={{
          background: '#fff', border: '1px solid #F0EDE6', borderRadius: 20, padding: 13,
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 2px 8px -4px rgba(40,30,15,0.08)',
          cursor: lockedByPlan || !isLocked ? 'pointer' : 'default',
          opacity: isLocked && !lockedByPlan ? 0.7 : 1,
        }}
      >
        {/* badge */}
        {isCompleted ? (
          <div style={{ width: 50, height: 50, borderRadius: 15, background: '#E9F8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1B9E5A' }}>
            <Check style={{ width: 24, height: 24 }} strokeWidth={2.6} />
          </div>
        ) : !isLocked ? (
          <div style={{ width: 50, height: 50, borderRadius: 15, background: '#F26B0F', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 14px -4px rgba(242,107,15,0.5)' }}>
            <span style={{ color: '#FFD9BC', fontSize: 8, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1 }}>DIA</span>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{num}</span>
          </div>
        ) : (
          <div style={{ width: 50, height: 50, borderRadius: 15, background: '#F4F1EA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#B7B1A4' }}>
            <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1 }}>DIA</span>
            <span style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{num}</span>
          </div>
        )}

        {/* middle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', margin: 0, letterSpacing: '-0.2px' }}>{module.title}</p>
          {isCompleted ? (
            <p style={{ fontSize: 12.5, fontWeight: 700, color: '#1B9E5A', margin: '4px 0 0' }}>Concluído</p>
          ) : lockedByPlan ? (
            <p style={{ fontSize: 12.5, fontWeight: 700, color: '#F26B0F', margin: '4px 0 0' }}>{PLAN_LOCK_LABELS[module.required_plan] || 'Plano necessário'}</p>
          ) : isLocked ? (
            <p style={{ fontSize: 12.5, fontWeight: 600, color: '#B7B1A4', margin: '4px 0 0' }}>Libera em {formatHoursLeft(module.hoursLeft)}</p>
          ) : inProgress ? (
            <div style={{ marginTop: 7 }}>
              <div style={{ height: 5, background: '#F1EEE7', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stepPct}%`, background: '#F26B0F', borderRadius: 999 }} />
              </div>
              <p style={{ fontSize: 11.5, fontWeight: 600, color: '#A8A296', margin: '5px 0 0' }}>{stepsDone} de {stepsTotal} passos · em andamento</p>
            </div>
          ) : (
            <p style={{ fontSize: 12.5, fontWeight: 700, color: '#F26B0F', margin: '4px 0 0' }}>Pronto para começar</p>
          )}
        </div>

        {/* right icon */}
        {isLocked && !lockedByPlan ? (
          <span style={{ color: '#C9C3B6', display: 'flex', flexShrink: 0 }}><Lock style={{ width: 18, height: 18 }} strokeWidth={2} /></span>
        ) : (
          <span style={{ color: lockedByPlan ? '#FFC79B' : '#D6D0C3', display: 'flex', flexShrink: 0 }}><ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.2} /></span>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', padding: '8px 20px 120px' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: '#F26B0F', display: 'flex' }}><PawPrint style={{ width: 22, height: 22 }} /></span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#1A1814', letterSpacing: '-0.3px' }}>DogFlow</span>
        </div>
        <button onClick={() => router.push('/planos')} style={{ border: '1px solid #ECE7DE', background: '#fff', color: '#6B6760', fontSize: 12, fontWeight: 700, padding: '6px 13px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
          {userPlan === 'desafio' ? 'Desafio 7 Dias' : userPlan}
          <ChevronRight style={{ width: 13, height: 13 }} strokeWidth={2.4} />
        </button>
      </div>

      {/* greeting */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <button onClick={() => router.push('/meu-pet')} style={{ width: 58, height: 58, borderRadius: 18, background: '#FFF0E4', border: '1px solid #FFE0C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#F26B0F', cursor: 'pointer', overflow: 'hidden', padding: 0 }}>
          {pet?.photo_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={pet.photo_url} alt={pet?.name || 'pet'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <PawPrint style={{ width: 28, height: 28 }} />}
        </button>
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: '#1A1814', letterSpacing: '-0.6px', margin: 0, lineHeight: 1.1 }}>
            {pet?.name ? `Olá, ${pet.name}` : 'Seu Desafio'}
          </h1>
          <p style={{ fontSize: 14, color: '#8A8579', margin: '3px 0 0', fontWeight: 500 }}>Continue de onde parou</p>
        </div>
      </div>

      {/* hero progress */}
      <div style={{ background: '#F26B0F', borderRadius: 24, padding: 22, marginBottom: 26, boxShadow: '0 14px 30px -10px rgba(242,107,15,0.55)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <p style={{ color: '#FFD9BC', fontSize: 12, fontWeight: 700, letterSpacing: 0.3, margin: 0, textTransform: 'uppercase' }}>Desafio 7 Dias</p>
            <p style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-0.4px' }}>{completed} <span style={{ opacity: 0.7, fontWeight: 600 }}>de {total} dias</span></p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.18)', padding: '7px 12px', borderRadius: 999 }}>
            <span style={{ fontSize: 15 }}>🔥</span>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{completed}</span>
          </div>
        </div>
        <div style={{ height: 9, background: 'rgba(255,255,255,0.25)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#fff', borderRadius: 999, transition: 'width .8s ease' }} />
        </div>
        <p style={{ color: '#FFE6D2', fontSize: 12, fontWeight: 600, margin: '9px 0 0' }}>{pct}% concluído · {faltam === 0 ? 'desafio completo!' : `faltam ${faltam} dia${faltam > 1 ? 's' : ''}`}</p>
      </div>

      {/* dias */}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#A8A296', letterSpacing: 0.8, textTransform: 'uppercase', margin: '0 0 14px 2px' }}>Seu plano de 7 dias</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {desafioModules.map((m: any) => <DayCard key={m.id} module={m} />)}
      </div>

      {/* extras */}
      {subscriptionModules.length > 0 && (
        <>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#A8A296', letterSpacing: 0.8, textTransform: 'uppercase', margin: '26px 0 14px 2px' }}>Conteúdo extra</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {subscriptionModules.map((m: any) => {
              const isCompleted = m.progress?.status === 'completed'
              // NÃO possui (travado por plano) → teaser com cadeado + label de compra
              if (m.lockedByPlan) {
                return (
                  <div key={m.id} onClick={() => openModule(m)} style={{ background: '#fff', border: '1px solid #F0EDE6', borderRadius: 20, padding: 13, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px -4px rgba(40,30,15,0.08)', cursor: 'pointer' }}>
                    <div style={{ width: 50, height: 50, borderRadius: 15, background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#B7B1A4' }}>
                      <Lock style={{ width: 22, height: 22 }} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', margin: 0, letterSpacing: '-0.2px' }}>{m.title}</p>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: '#F26B0F', margin: '4px 0 0' }}>{PLAN_LOCK_LABELS[m.required_plan] || 'Conteúdo extra'}</p>
                    </div>
                    <span style={{ color: '#FFC79B', display: 'flex', flexShrink: 0 }}><ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.2} /></span>
                  </div>
                )
              }
              // POSSUI (ex: Cão Calmo comprado) → card desbloqueado, abre o conteúdo
              return (
                <div key={m.id} onClick={() => openModule(m)} style={{ background: '#fff', border: '1px solid #F0EDE6', borderRadius: 20, padding: 13, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px -4px rgba(40,30,15,0.08)', cursor: 'pointer' }}>
                  {isCompleted ? (
                    <div style={{ width: 50, height: 50, borderRadius: 15, background: '#E9F8EF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1B9E5A' }}><Check style={{ width: 24, height: 24 }} strokeWidth={2.6} /></div>
                  ) : (
                    <div style={{ width: 50, height: 50, borderRadius: 15, background: '#F26B0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24, boxShadow: '0 6px 14px -4px rgba(242,107,15,0.5)' }}>{PLAN_EMOJI[m.required_plan] || '▶'}</div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', margin: 0, letterSpacing: '-0.2px' }}>{m.title}</p>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: isCompleted ? '#1B9E5A' : '#F26B0F', margin: '4px 0 0' }}>{isCompleted ? 'Concluído · rever' : 'Liberado · começar'}</p>
                  </div>
                  <span style={{ color: '#D6D0C3', display: 'flex', flexShrink: 0 }}><ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.2} /></span>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* upgrade */}
      {userPlan === 'desafio' && (
        <button onClick={() => router.push('/planos')} style={{ width: '100%', marginTop: 16, background: '#1A1814', border: 'none', borderRadius: 22, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ color: '#FF9E4D', display: 'flex', flexShrink: 0, fontSize: 22 }}>⭐</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>Desbloqueie tudo</p>
            <p style={{ color: '#9C978D', fontSize: 12.5, margin: '3px 0 0', fontWeight: 500 }}>A partir de R$29,90/mês · cancele quando quiser</p>
          </div>
          <span style={{ color: '#6B6760', display: 'flex' }}><ChevronRight style={{ width: 20, height: 20 }} strokeWidth={2.2} /></span>
        </button>
      )}
    </div>
  )
}
