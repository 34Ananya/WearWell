import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-96 bg-stone-900 p-12 text-white">
        <div>
          <h1 className="font-display text-3xl">WearWell</h1>
          <p className="text-stone-400 mt-2 text-sm leading-relaxed">
            Your digital wardrobe, organized.
          </p>
        </div>
        <div className="space-y-6">
          {['Upload your wardrobe', 'Build outfit combinations', 'Get smart suggestions'].map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {i + 1}
              </div>
              <p className="text-stone-300 text-sm">{t}</p>
            </div>
          ))}
        </div>
        <p className="text-stone-600 text-xs">© {new Date().getFullYear()} WearWell</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="font-display text-3xl text-stone-900">WearWell</h1>
          </div>

          <h2 className="font-display text-3xl text-stone-900 mb-2">Welcome back</h2>
          <p className="text-stone-500 text-sm mb-8">Sign in to your wardrobe</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-stone-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            No account?{' '}
            <Link to="/signup" className="text-sage-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
