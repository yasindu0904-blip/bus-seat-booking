'use client'

import { useEffect, useState } from 'react'

type MeResponse = {
  uid: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  profileCompleted: boolean
}

export default function DashboardPage() {
  const [me, setMe] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMe() {
      try {
        const response = await fetch('/api/me')
        const result = await response.json()

        if (result.success) {
          setMe(result.data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadMe()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main>
      <div>Welcome, {me?.firstName || 'Customer'}</div>
    </main>
  )
}