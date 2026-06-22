import { createServerSupabase, createServiceSupabase } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isModuleUnlocked, hoursUntilUnlock } from '@/lib/access'
import ModuleList from './ModuleList'

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0, desafio: 1, basico: 2, premium: 3, pro: 4,
}

export default async function TreinosPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Leitura de dados via admin (service role) filtrando pelo user.id autenticado —
  // evita depender da sessão se propagar pro RLS na renderização (bug que dava "acesso negado").
  const db = createServiceSupabase()
  const [{ data: purchase }, { data: modules }, { data: progress }, { data: pet }] =
    await Promise.all([
      db.from('purchases').select('*').eq('user_id', user.id).eq('status', 'active')
        .order('purchased_at', { ascending: false }).limit(1).maybeSingle(),
      db.from('training_modules').select('*, training_steps(count)')
        .in('product', ['dogflow_7dias', 'dogflow_basico', 'dogflow_premium', 'dogflow_pro'])
        .order('order_index'),
      db.from('training_progress').select('*').eq('user_id', user.id),
      db.from('pets').select('*').eq('user_id', user.id).limit(1).maybeSingle(),
    ])

  if (!purchase) redirect('/acesso-negado')

  const userPlanLevel = PLAN_HIERARCHY[purchase.plan ?? 'desafio'] ?? 1

  const modulesWithStatus = (modules || []).map(m => {
    const requiredLevel = PLAN_HIERARCHY[m.required_plan ?? 'desafio'] ?? 1
    const hasPlan = userPlanLevel >= requiredLevel
    const timeUnlocked = isModuleUnlocked(m.unlock_hours, purchase.purchased_at)

    return {
      ...m,
      unlocked: hasPlan && timeUnlocked,
      hoursLeft: hoursUntilUnlock(m.unlock_hours, purchase.purchased_at),
      lockedByPlan: !hasPlan,
      progress: progress?.find(p => p.module_id === m.id) ?? null,
      stepCount: m.training_steps?.[0]?.count ?? 0,
    }
  })

  return <ModuleList modules={modulesWithStatus} pet={pet} userPlan={purchase.plan ?? 'desafio'} />
}
