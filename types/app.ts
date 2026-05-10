import type { Topic } from '@/lib/constants'

export interface Problem {
  id: string
  title: string
  platform: string
  difficulty: string
  topic_id: number
  topic_name: string
  link: string | null
  description: string | null
  is_must_do: boolean
  created_at: string
}

export interface UserProfile {
  id: string
  email: string
  username: string
  avatar_url: string | null
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  created_at: string
}

export interface Submission {
  id: string
  user_id: string
  problem_id: string
  status: string
  is_favourite: boolean
  time_taken_minutes: number | null
  notes: string | null
  created_at: string
  code?: string | null
  language?: string | null
}

export interface UserStats {
  user_id: string
  total_solved: number
  easy_solved: number
  medium_solved: number
  hard_solved: number
  current_streak: number
  longest_streak: number
  weak_topics: string[]
  accuracy_percent: number
  last_active: string | null
}

export interface StreakDay {
  date: string
  problems_solved: number
}

export interface TopicProgress {
  topic: Topic
  total: number
  solved: number
  percentage: number
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// ─── Code Execution ───────────────────────────────────────────

export interface ExecutionResult {
  statusId:   number
  statusDesc: string
  stdout:     string | null
  stderr:     string | null
  compileOut: string | null
  timeMs:     number | null
  memoryKb:   number | null
}

export interface ExecutionRun {
  id:         string
  user_id:    string
  problem_id: string
  code:       string
  language:   string
  stdin:      string | null
  stdout:     string | null
  stderr:     string | null
  compile_out:string | null
  status_id:  number
  status_desc:string
  time_ms:    number | null
  memory_kb:  number | null
  created_at: string
}
