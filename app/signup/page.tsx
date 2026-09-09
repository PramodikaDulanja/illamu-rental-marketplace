'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signupAction } from './actions'
import { toast } from 'sonner'
import { User, Mail, Phone, MapPin, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await signupAction(formData)

      if (result.success) {
        toast.success('🎉 Account created successfully! Please sign in.', { duration: 2000 })
        router.push('/signin')
        router.refresh()
      } else {
        toast.error('Error: ' + result.error, { duration: 2000 })
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong', { duration: 2000 })
    } finally {
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
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Join Illamu.lk
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Start renting or listing items securely across Sri Lanka.</p>
        </div>

        {/* Form Box */}
        <form onSubmit={handleSubmit} className="bg-white/85 backdrop-blur-xl p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-100 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="John Doe"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-600" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="john@example.com"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" /> Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              required
              placeholder="0771234567"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Address
            </label>
            <input
              type="text"
              name="address"
              required
              placeholder="Colombo, Sri Lanka"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" /> Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/50 transition-all text-slate-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-slate-500">
              Already have an account?{' '}
              <Link href="/signin" className="text-indigo-600 font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  )
}