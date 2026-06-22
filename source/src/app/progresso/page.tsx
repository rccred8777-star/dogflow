import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import ProgressView from './ProgressView'

export default async function ProgressoPage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [modulesRes, streakRes, badgesRes] = await Promise.all([
    supabase.from('training_modules').select('*, progress:training_progress(status, completed_steps)').order('order_index'),
    supabase.from('user_streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('user_badges').select('*').eq('user_id', user.id),
  ])

  const modules = (modulesRes.data || []).map((m: any) => ({
    ...m,
    progress: Array.isArray(m.progress) ? m.progress[0] : m.progress,
  }))

  return (
    <ProgressView
      modules={modules}
      streak={streakRes.data}
      badges={badgesRes.data || []}
      pet={null}
    />
  )
}
