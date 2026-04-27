'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type MeResponse = {
  success: boolean
  data?: {
    uid: string
    email: string | null
    role: 'admin' | 'customer' | null
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    profileCompleted: boolean
  }
  message?: string
}

export default function AdminHeader() {
  const router = useRouter()

  const [firstName, setFirstName] = useState<string>('Admin')
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        const result: MeResponse = await response.json()

        if (result.success && result.data?.role === 'admin') {
          setFirstName(result.data.firstName || 'Admin')
        }
      } catch (error) {
        console.error('Failed to load admin details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  const handleLogout = async () => {
    try {
      setLoggingOut(true)

      const response = await fetch('/api/auth/logout-session', {
        method: 'POST',
        credentials: 'include',
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        console.error(result.message || 'Failed to logout')
        return
      }

      router.replace('/login')
      router.refresh()
    } catch (error) {
      console.error('Failed to logout:', error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <header className="mb-6 rounded-2xl bg-[#161d18] px-4 py-4 text-white shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-300">
            {loading ? 'Loading...' : 'Admin Panel'}
          </p>

          <h1 className="mt-1 text-2xl font-semibold">
            Welcome, {loading ? '...' : firstName}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-60"
        >
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </header>
  )
}