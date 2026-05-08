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
