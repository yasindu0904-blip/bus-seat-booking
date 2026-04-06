'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CompleteProfilePage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/customer-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber,
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to save profile')
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f4fbf3] px-5 pb-10 pt-4">
        <header className="flex items-center justify-between pb-6 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent text-[#006d43] active:scale-95"
            >
              ←
            </button>

            <div>
              <p className="text-2xl font-extrabold tracking-tight text-[#006d43]">
                Fluid Transit
              </p>
            </div>
          </div>
        </header>

        <section className="pb-8 pt-2">
          <h1 className="mb-2 text-[2.25rem] font-extrabold leading-tight tracking-tight">
            Complete Profile
          </h1>
          <p className="text-lg font-medium text-[#3d4a41] opacity-80">
            Help us get to know you better.
          </p>
        </section>

        <div className="rounded-3xl bg-[#eef6ed] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-2 flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#f4fbf3] bg-[#dde4dd]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2micZmTsiL9-4pbi-1dR8-5ECKFw9jYYQKgeWV4hKX6FAGo1EtYoJgckfsRIfDExOb8v_dRRuo3WgyEuLfIiJfk6h5t9D5c2whi3BbYXwtOJ0o78Pnz72RnsdeNqkRNefWOesFj7xoK_39OYEVrzlVvL4OfWBSNbor6ekIeHMXbeV2kj1IQ4cuYmjaS0aEsqDIsi2gCzK9Zerxn_HZ0lhHuLLG5z6xGQHAZE26__CXTcheANrLkvNfK3n3JTltNc7GlwzzwBHJpsG"
                    alt="Profile placeholder"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#006d43] text-sm text-white shadow-lg">
                  📷
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block px-1 text-sm font-bold text-[#3d4a41]"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  className="h-14 w-full rounded-2xl border-none bg-[#dde4dd] px-5 font-medium text-[#161d18] outline-none placeholder:text-[#3d4a41]/40 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block px-1 text-sm font-bold text-[#3d4a41]"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  className="h-14 w-full rounded-2xl border-none bg-[#dde4dd] px-5 font-medium text-[#161d18] outline-none placeholder:text-[#3d4a41]/40 focus:bg-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block px-1 text-sm font-bold text-[#3d4a41]"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="h-14 w-full rounded-2xl border-none bg-[#dde4dd] px-5 pr-14 font-medium text-[#161d18] outline-none placeholder:text-[#3d4a41]/40 focus:bg-white"
                    required
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[#00a86b]">
                    📱
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#e3eae2] p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006d43]/10 text-[#006d43]">
                🔔
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-[#161d18]">Journey Updates</p>
                <p className="text-xs text-[#3d4a41]">
                  Receive SMS for platform changes
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 rounded border-none accent-[#006d43]"
              />
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl text-lg font-bold text-white shadow-lg transition active:scale-[0.98] disabled:opacity-60"
                style={{
                  background: 'linear-gradient(to bottom right, #006d43, #00a86b)',
                }}
              >
                {loading ? 'Saving...' : 'Save Profile'}
                <span>{loading ? '' : '→'}</span>
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 px-4 text-center text-sm text-[#3d4a41] opacity-70">
          Your personal data is encrypted and used only for booking confirmation
          and identification during your travels.
        </p>
      </div>
    </main>
  )
}