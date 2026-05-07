import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Sign In — DSA Mentor AI',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">DSA Mentor AI</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <h1 className="mb-1 text-2xl font-semibold text-white">
            Welcome back
          </h1>
          <p className="mb-6 text-sm text-slate-400">
            Sign in to continue your DSA journey
          </p>

          <LoginForm />

          <div className="mt-4 text-center">
            <Link
              href="/forgot-password"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Sign up free
          </Link>
        </p>

      </div>
    </div>
  )
}
