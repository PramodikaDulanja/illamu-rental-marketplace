'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signupAction } from './actions'

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
        alert('Account created successfully! Please sign in.')
        router.push('/signin')
        router.refresh()
      } else {
        alert('Error: ' + result.error)
      }
    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Create an Account</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Doe"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="john@example.com"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            required
            placeholder="0771234567"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Address</label>
          <input
            type="text"
            name="address"
            required
            placeholder="Colombo, Sri Lanka"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-900 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  )
}