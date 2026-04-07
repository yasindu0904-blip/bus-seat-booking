'use client'

import { useEffect, useState } from 'react'

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
  const [firstName, setFirstName] = useState<string>('Admin')
  const [loading, setLoading] = useState(true)

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

  return (
    <header className="mb-6 rounded-2xl bg-[#161d18] px-4 py-4 text-white shadow-sm">
      <p className="text-sm text-gray-300">
        {loading ? 'Loading...' : 'Admin Panel'}
      </p>
      <h1 className="mt-1 text-2xl font-semibold">
        Welcome, {loading ? '...' : firstName}
      </h1>
    </header>
  )
}