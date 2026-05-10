'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle } from 'lucide-react'

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [sentTo, setSentTo] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { username: data.username },
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setSentTo(data.email)
      setEmailSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
          <CheckCircle className="h-10 w-10 text-emerald-400" />
        </div>
        <h2 className="mb-2 text-lg font-semibold text-white">
          Check your inbox
        </h2>
        <p className="text-sm text-slate-400">
          We sent a confirmation link to{' '}
          <span className="text-slate-200">{sentTo}</span>.
          <br />
          Click it to activate your account.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username" className="text-slate-300">
          Username
        </Label>
        <Input
          id="username"
          placeholder="coderX99"
          autoComplete="username"
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500
                     focus-visible:ring-indigo-500"
          {...register('username')}
        />
        {errors.username && (
          <p className="text-xs text-rose-400">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-slate-300">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500
                     focus-visible:ring-indigo-500"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password" className="text-slate-300">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500
                     focus-visible:ring-indigo-500"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-rose-400">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword" className="text-slate-300">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500
                     focus-visible:ring-indigo-500"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-rose-400">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Free Account'
        )}
      </Button>

      <p className="text-center text-xs text-slate-500">
        By signing up you agree to our terms and privacy policy.
      </p>
    </form>
  )
}
