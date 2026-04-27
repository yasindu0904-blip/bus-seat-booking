'use client'
import AdminHeader from '@/components/admin/AdminHeader'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type RouteItem = {
  id: string
  route_name: string
  start_location: string
  created_at: string
}

export default function AdminRoutesPage() {
  const router = useRouter()

  const [routeName, setRouteName] = useState('')
  const [startLocation, setStartLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [showRoutes, setShowRoutes] = useState(false)
  const [routesLoading, setRoutesLoading] = useState(false)
  const [routesError, setRoutesError] = useState('')
  const [routes, setRoutes] = useState<RouteItem[]>([])

  const fetchRoutes = async () => {
    setRoutesLoading(true)
    setRoutesError('')

    try {
      const response = await fetch('/api/admin/show-routes', {
        method: 'GET',
      })

      const result = await response.json()

      if (!response.ok) {
        setRoutesError(result.message || 'Failed to fetch routes')
        return
      }

      setRoutes(result.data || [])
    } catch {
      setRoutesError('Something went wrong while fetching routes')
    } finally {
      setRoutesLoading(false)
    }
  }

  const handleShowRoutes = async () => {
    if (showRoutes) {
      setShowRoutes(false)
      return
    }

    setShowRoutes(true)
    await fetchRoutes()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routeName,
          startLocation,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.message || 'Failed to add route')
        return
      }

      setSuccessMessage(result.message || 'Route added successfully')
      setRouteName('')
      setStartLocation('')

      if (showRoutes) {
        await fetchRoutes()
      }
    } catch {
      setErrorMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-5xl bg-[#f4fbf3] px-5 pb-10 pt-6">
        <AdminHeader />
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Route</h1>

          <button
            type="button"
            onClick={() => router.push('/admin/admin-dashboard')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5"
            >
              <div>
                <label className="mb-1 block text-sm font-medium">Route Name</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Colombo to Kandy"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Start Location</label>
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="Colombo"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
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
                {loading ? 'Adding Route...' : 'Add Route'}
              </button>

              <button
                type="button"
                onClick={handleShowRoutes}
                className="w-full rounded-xl border border-[#161d18] px-4 py-3 text-[#161d18]"
              >
                {showRoutes ? 'Hide Routes' : 'Show Routes'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold">Routes Table</h2>

            {!showRoutes ? (
              <p className="text-sm text-gray-500">
                Press &quot;Show Routes&quot; to load all routes.
              </p>
            ) : routesLoading ? (
              <p className="text-sm text-gray-500">Loading routes...</p>
            ) : routesError ? (
              <p className="text-sm text-red-600">{routesError}</p>
            ) : routes.length === 0 ? (
              <p className="text-sm text-gray-500">No routes found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Route Name
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Start Location
                      </th>
                      <th className="border border-gray-300 px-4 py-2 text-left">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((route) => (
                      <tr key={route.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {route.route_name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {route.start_location}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(route.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}