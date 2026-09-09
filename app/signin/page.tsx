'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

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

        // වඩාත් පැහැදිලිව සහ ලස්සනට පෙන්වීම සඳහා 
        toast.success(`🎉 Welcome back, ${data.data.name}! Login successful.`)

        // නොටිෆිකේෂන් එක හොඳින් බලාගת පසු හෝම් පේජ් එකට යාමට තත්පර 1.2ක ඉඩක් ලබා දීම
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)

      } else {
        toast.error('Error: ' + (data.error || 'Invalid credentials'))
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Sign In to Your Account</h1>
      <form onSubmit={handleSignin} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@example.com"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-900 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}