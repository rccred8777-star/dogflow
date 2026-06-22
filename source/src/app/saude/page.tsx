import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase-server'
import SaudeView from './SaudeView'

export default async function SaudePage() {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: pet } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: vaccines } = await supabase
    .from('vaccines')
    .select('*')
    .eq('user_id', user.id)
    .order('date_applied', { ascending: false })

  const { data: healthRecords } = await supabase
    .from('health_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  return (
    <SaudeView
      pet={pet}
      vaccines={vaccines || []}
      healthRecords={healthRecords || []}
      userId={user.id}
    />
  )
}
