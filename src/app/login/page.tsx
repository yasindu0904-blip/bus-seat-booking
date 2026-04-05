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

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.message || 'Something went wrong.')
        return
      }

      setMessage(data?.message || 'Check your email for the magic link.')
      setCountdown(60)
      setEmail('')
    } catch {
      setError('Unable to send magic link right now.')
    } finally {
      setLoading(false)
    }
  }

  const buttonDisabled = loading || countdown > 0

  return (
    <main className="min-h-screen bg-[#f4fbf3] text-[#161d18]">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-6 pt-4">
        <header className="flex items-center justify-between pb-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dff5e8] text-xl">
              🚌
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-[#006d43]">
                Fluid Transit
              </p>
              <p className="text-xs text-[#3d4a41]">Travel made simple</p>
            </div>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center">
          <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpjUhN9pn-obsya2rbuDjPmX_Vse4LLmDw12DPCGY9Pf3hr51yqZTt4RTnE-LnfAy9tbA2rxDFJpX_LdB8eZA1DHRxKZ4mkoV0zTYTCUaa12OEsK4L2tm-5hvMiYH4BhdzBnZuVHbFGm3LeKiu_O1DI7yCPjKFyH46ZvS8mMhHZSpO7IMyqygTLYxI-oJhNZGgut2S3VSKTaF9tGlAJNI9NH5b0G26uO2v9AJ5liYZxov1tsSb_Jk39R_OEVE8nBN3r2e9WJqM-YBJ"
              alt="Bus travel"
              className="h-52 w-full object-cover"
            />
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold leading-tight">
              Welcome to Fluid Transit
            </h1>
            <p className="mt-2 text-base text-[#3d4a41]">
              Your journey begins with a single tap.
            </p>
          </div>

          <div className="rounded-3xl bg-[#eef6ed] p-5 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#3d4a41]"
                >
                  Email address
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#6d7a70]">
                    ✉️
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={buttonDisabled}
                    className="w-full rounded-2xl bg-white py-4 pl-12 pr-4 text-base outline-none ring-1 ring-transparent transition focus:ring-2 focus:ring-[#0d50d5]/20 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={buttonDisabled}
                className="w-full rounded-2xl px-4 py-4 text-base font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(45deg, #006d43, #00a86b)',
                }}
              >
                {loading
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : 'Send verification link'}
              </button>
            </form>

            {message && (
              <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-sm text-[#3d4a41]">
            By continuing, you agree to our{' '}
            <a href="#" className="font-semibold text-[#0d50d5]">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-semibold text-[#0d50d5]">
              Privacy Policy
            </a>
            .
          </div>
        </section>

        <div className="pt-5">
          <button
            type="button"
            className="mx-auto flex items-center gap-2 rounded-full bg-[#0d50d5] px-4 py-3 text-sm font-bold text-white shadow-lg"
          >
            <span>?</span>
            Support
          </button>
        </div>
      </div>
    </main>
  )
}