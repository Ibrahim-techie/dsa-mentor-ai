import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MobileNav } from './MobileNav'
import type { UserProfile } from '@/types/app'

export function Navbar({ profile }: { profile: UserProfile | null }) {
  const initials = profile?.username?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between
                       border-b border-slate-800 bg-slate-950/80
                       px-4 backdrop-blur-sm lg:px-8">
      <MobileNav />
      {profile && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">@{profile.username}</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile.avatar_url ?? undefined} />
            <AvatarFallback className="bg-indigo-600 text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  )
}
// Trigger HMR
