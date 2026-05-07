import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Code2, Brain, TrendingUp, Zap } from 'lucide-react'

const STATS = [
  { label: 'Problems', value: '800+' },
  { label: 'Topics', value: '20' },
  { label: 'Platforms', value: '3' },
  { label: 'Free Forever', value: '100%' },
]

const FEATURES = [
  {
    icon: TrendingUp,
    title: 'Track Every Solve',
    description: 'Mark problems solved, log time taken, add notes. Progress synced to cloud.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
  {
    icon: Brain,
    title: 'Smart Recommendations',
    description: 'Detects your weak topics and recommends what to practice next.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
  {
    icon: Code2,
    title: 'Code in the Browser',
    description: 'Monaco Editor with Python, Java, C++, JavaScript support.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: Zap,
    title: 'AI-Powered Hints',
    description: 'Stuck? Get step-by-step hints and code reviews via Gemini AI.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Code2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">DSA Mentor AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-indigo-600 hover:bg-indigo-500">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <Badge className="mb-6 border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
          Now in Beta — Phase 1 MVP
        </Badge>
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Master DSA with{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            AI-Powered Guidance
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
          Track progress, get intelligent recommendations, practice in the browser,
          and receive AI hints when you&apos;re stuck. Built for serious interview prep.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              Start For Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/problems">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Browse Problems
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700"
            >
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-12 text-center text-3xl font-semibold">
          Everything you need to crack interviews
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition-colors hover:border-slate-700"
            >
              <div className={`mb-4 inline-flex rounded-lg p-2 ${feature.bg}`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-medium">{feature.title}</h3>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-12">
          <h2 className="mb-4 text-3xl font-semibold">Ready to level up?</h2>
          <p className="mb-8 text-slate-400">
            Start tracking your DSA journey today. Free forever.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500">
              Create Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        <p>DSA Mentor AI — Built with Next.js 16, Supabase &amp; Gemini AI</p>
      </footer>

    </div>
  )
}
