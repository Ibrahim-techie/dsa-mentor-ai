
import { createClient } from '@/lib/supabase/server'
import { Flame } from 'lucide-react'
import { StatsCards }     from '@/components/dashboard/StatsCards'
import { StreakHeatmap }   from '@/components/dashboard/StreakHeatmap'
import { TopicProgress }   from '@/components/dashboard/TopicProgress'
import { RecentActivity }  from '@/components/dashboard/RecentActivity'

export const metadata = { title: 'Dashboard — DSA Mentor AI' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: stats },
    { data: profile },
    { data: recentSubmissions },
    { data: streakHistory },
    { data: problems },
  ] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user!.id).single(),
    supabase.from('users_profile').select('*').eq('id', user!.id).single(),
    supabase
      .from('submissions')
      .select('*, problems(*)')
      .eq('user_id', user!.id)
      .eq('status', 'solved')
      .order('updated_at', { ascending: false })
      .limit(5),
    supabase
      .from('streak_history')
      .select('date, problems_solved')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })
      .limit(365),
    supabase.from('problems').select('topic_name, difficulty'),
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, {profile?.username ?? 'coder'} 👋
          </h1>
          <p className="text-sm text-slate-400">
            Consistency beats intensity. Keep the streak alive.
          </p>
        </div>
        {stats && stats.current_streak > 0 && (
          <div className="flex items-center gap-2 rounded-xl border
                          border-orange-500/20 bg-orange-500/10 px-4 py-2">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-lg font-bold text-orange-400">
              {stats.current_streak}
            </span>
            <span className="text-sm text-orange-400/70">day streak</span>
          </div>
        )}
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <StreakHeatmap data={(streakHistory ?? []) as { date: string; problems_solved: number }[]} />
        <TopicProgress
          submissions={(recentSubmissions ?? []) as { problems: { topic_name: string } | null }[]}
          problems={(problems ?? []) as { topic_name: string; difficulty: string }[]}
        />
      </div>

      <RecentActivity submissions={(recentSubmissions ?? []) as { id: string; updated_at: string; problems: { id: string; title: string; difficulty: string; topic_name: string } | null }[]} />
    </div>
  )
}
