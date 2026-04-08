'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddAdminPage() {
  const router = useRouter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/add-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.message || 'Failed to add admin')
        return
      }

      setSuccessMessage(result.message || 'Admin added successfully')
      setFirstName('')
      setLastName('')
      setEmail('')

      // optional: go back after short delay
      // router.push('/admin/admin-dashboard')
    } catch {
      setErrorMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f4fbf3] px-5 pb-10 pt-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Admin</h1>

          <button
            type="button"
            onClick={() => router.push('/admin/admin-dashboard')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              placeholder="Enter last name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
              placeholder="Enter email"
            />
          </div>

          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}

          {successMessage ? (
            <p className="text-sm text-green-600">{successMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#161d18] px-4 py-3 text-white disabled:opacity-60"
          >
            {loading ? 'Adding Admin...' : 'Add Admin'}
          </button>
        </form>
      </div>
    </main>
  )
}