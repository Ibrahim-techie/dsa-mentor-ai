import { Badge } from '@/components/ui/badge'
import type { Difficulty } from '@/lib/constants'

const styles: Record<Difficulty, string> = {
  Easy: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
  Medium: 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
  Hard: 'border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <Badge variant="outline" className={styles[difficulty]}>
      {difficulty}
    </Badge>
  )
}
