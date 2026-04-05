'use client'

import { FormEvent, useEffect, useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (countdown > 0) {
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Something went wrong.')
        return
      }

      setMessage(data.message || 'Check your email for the magic link.')
      setCountdown(60)
    } catch {
      setError('Unable to send magic link right now.')
    } finally {
      setLoading(false)
    }
  }

  const buttonDisabled = loading || countdown > 0

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Login</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we will send you a verification link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-lg border px-3 py-2 outline-none"
              required
              disabled={loading || countdown > 0}
            />
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-lg border px-4 py-2 font-medium disabled:opacity-50"
          >
            {loading
              ? 'Sending...'
              : countdown > 0
              ? `Resend in ${countdown}s`
              : 'Verify'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-green-600">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </main>
  )
}