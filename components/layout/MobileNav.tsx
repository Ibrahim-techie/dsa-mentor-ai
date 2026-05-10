'use client'

import { Menu, X } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

export function MobileNav() {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  return (
    <button
      onClick={toggleSidebar}
      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800
                 hover:text-white lg:hidden"
      aria-label="Toggle menu"
    >
      {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  )
}
