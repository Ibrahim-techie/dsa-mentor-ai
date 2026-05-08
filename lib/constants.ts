export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'] as const
export type Difficulty = typeof DIFFICULTY_LEVELS[number]
export const isDifficulty = (d: string): d is Difficulty => DIFFICULTY_LEVELS.includes(d as Difficulty)

export const PLATFORMS = ['LeetCode', 'HackerRank', 'CodeChef', 'Custom'] as const
export type Platform = typeof PLATFORMS[number]
export const isPlatform = (p: string): p is Platform => PLATFORMS.includes(p as Platform)

export const TOPICS = [
  'Array', 'String', 'Linked List', 'Stack', 'Queue',
  'Tree', 'Binary Search Tree', 'Heap', 'Graph', 'Dynamic Programming',
  'Recursion', 'Backtracking', 'Greedy', 'Sliding Window', 'Two Pointers',
  'Binary Search', 'Sorting', 'Hashing', 'Math', 'Bit Manipulation',
] as const
export type Topic = typeof TOPICS[number]

export const PROBLEM_STATUS = ['todo', 'solved', 'attempted', 'skipped'] as const
export type ProblemStatus = typeof PROBLEM_STATUS[number]
export const toProblemStatus = (s: string): ProblemStatus => PROBLEM_STATUS.includes(s as ProblemStatus) ? s as ProblemStatus : 'todo'

export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  Medium: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
  Hard: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
}
