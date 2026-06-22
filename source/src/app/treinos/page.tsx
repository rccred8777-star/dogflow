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

  const db = createServiceSupabase()
  const [{ data: purchases }, { data: modules }, { data: progress }, { data: pet }] =
    await Promise.all([
      db.from('purchases').select('*').eq('user_id', user.id).eq('status', 'active')
        .order('purchased_at', { ascending: false }),
      db.from('training_modules').select('*, training_steps(count)')
        .in('product', ['dogflow_7dias', 'dogflow_basico', 'dogflow_premium', 'dogflow_pro', 'dogflow_caocalmo'])
        .order('order_index'),
      db.from('training_progress').select('*').eq('user_id', user.id),
      db.from('pets').select('*').eq('user_id', user.id).limit(1).maybeSingle(),
    ])

  // Compra principal (plano do desafio/assinatura)
  const mainPurchase = purchases?.find(p =>
    ['desafio', 'basico', 'premium', 'pro', 'free'].includes(p.plan ?? '')
  ) ?? purchases?.[0] ?? null

  if (!mainPurchase) redirect('/acesso-negado')

  // Verificar se tem o Cão Calmo (add-on avulso)
  const hasCalmo = purchases?.some(p => p.plan === 'caocalmo') ?? false

  const userPlanLevel = PLAN_HIERARCHY[mainPurchase.plan ?? 'desafio'] ?? 1

  const modulesWithStatus = (modules || []).map(m => {
    const isCalmo = m.product === 'dogflow_caocalmo'
    const requiredLevel = PLAN_HIERARCHY[m.required_plan ?? 'desafio'] ?? 1
    const hasPlan = isCalmo ? hasCalmo : userPlanLevel >= requiredLevel
    const timeUnlocked = isModuleUnlocked(m.unlock_hours, mainPurchase.purchased_at)

    return {
      ...m,
      unlocked: hasPlan && timeUnlocked,
      hoursLeft: hoursUntilUnlock(m.unlock_hours, mainPurchase.purchased_at),
      lockedByPlan: !hasPlan,
      progress: progress?.find(p => p.module_id === m.id) ?? null,
      stepCount: m.training_steps?.[0]?.count ?? 0,
    }
  })

  return <ModuleList modules={modulesWithStatus} pet={pet} userPlan={mainPurchase.plan ?? 'desafio'} hasCalmo={hasCalmo} />
}
