'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate username
    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters')
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      setLoading(false)
      return
    }

    // Check if username is taken
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single()

    if (existingProfile) {
      setError('Username is already taken')
      setLoading(false)
      return
    }

    // Sign up user with redirect URL for email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Failed to create user account')
      setLoading(false)
      return
    }

    // Check if we have a session (user might need email confirmation)
    if (!authData.session) {
      // If email confirmation is required, inform the user
      setError('Please check your email to confirm your account before continuing.')
      setLoading(false)
      return
    }

    // Create profile directly using RPC function (bypasses RLS)
    // First, let's try using the database function if it exists
    const { data: profileData, error: rpcError } = await supabase.rpc('create_profile_for_user', {
      p_user_id: authData.user.id,
      p_username: username.toLowerCase(),
      p_display_name: username,
    })

    if (rpcError) {
      // If RPC function doesn't exist, try direct insert (should work with session)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          username: username.toLowerCase(),
          display_name: username,
        })

      if (profileError) {
        // If direct insert also fails, try API route as fallback
        try {
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              username: username.toLowerCase(),
              display_name: username,
            }),
          })

          const result = await response.json()

          if (!response.ok) {
            setError(result.error || 'Failed to create profile')
            setLoading(false)
            return
          }
        } catch (err) {
          setError('Failed to create profile. Please try again.')
          setLoading(false)
          return
        }
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="max-w-md w-full border border-gray-800 p-10">
        <h1 className="text-4xl font-serif text-center mb-3">Create Account</h1>
        <p className="text-gray-400 text-center mb-10 text-sm">Begin your presence</p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              className="w-full px-4 py-3 bg-black border border-gray-800 text-white focus:border-white focus:outline-none transition"
              placeholder="yourname"
              required
            />
            <p className="text-xs text-gray-500 mt-2">
              Your profile: /{username || 'username'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-800 text-white focus:border-white focus:outline-none transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-800 text-white focus:border-white focus:outline-none transition"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-2">At least 6 characters</p>
          </div>

          {error && (
            <div className="bg-gray-900 border border-gray-700 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
          >
            {loading ? 'Creating...' : 'Begin'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-8 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-white hover:underline">
            Enter
          </Link>
        </p>
      </div>
    </div>
  )
}
