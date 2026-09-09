'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react'

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('userId', data.data.id)
        localStorage.setItem('userName', data.data.name)
        localStorage.setItem('isAdmin', data.data.isAdmin)

        toast.success(`🎉 Welcome back, ${data.data.name}! Login successful.`, { duration: 2000 })

        setTimeout(() => {
          window.location.href = '/'
        }, 2000)

      } else {
        toast.error('Error: ' + (data.error || 'Invalid credentials'), { duration: 2000 })
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.', { duration: 2000 })
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/50 flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Header / Title Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-700 text-xs font-extrabold tracking-wide shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Welcome Back
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Sign In to Illamu.lk</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Access your rentals, manage your listings, and connect easily.</p>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSignin} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 space-y-5">
          
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}