import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { Providers } from '@/components/shared/Providers'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DSA Mentor AI — Master Data Structures & Algorithms',
  description: 'AI-powered DSA learning platform with progress tracking, smart recommendations, and code feedback.',
  keywords: ['DSA', 'LeetCode', 'algorithms', 'data structures', 'interview prep'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster
        richColors
        position='bottom-right' />
        </body>
    </html>
  )
}
