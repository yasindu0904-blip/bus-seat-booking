'use client'

import { useEffect, useState } from 'react'

type RouteItem = {
  route_name: string
  start_location: string
  end_location: string
}

export default function AddBusForm() {
  const [busNumber, setBusNumber] = useState('')
  const [seatCount, setSeatCount] = useState('')
  const [startingLocation, setStartingLocation] = useState('')
  const [routeName, setRouteName] = useState('')

  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [routesLoading, setRoutesLoading] = useState(true)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/api/admin/show-routes')
        const result = await response.json()

        if (!response.ok) {
          setErrorMessage(result.message || 'Failed to load routes')
          return
        }

        setRoutes(result.data || [])
      } catch {
        setErrorMessage('Something went wrong while loading routes')
      } finally {
        setRoutesLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busNumber,
          seatCount,
          startingLocation,
          routeName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrorMessage(result.message || 'Failed to add bus')
        return
      }

      setSuccessMessage(result.message || 'Bus added successfully')
      setBusNumber('')
      setSeatCount('')
      setStartingLocation('')
      setRouteName('')
    } catch {
      setErrorMessage('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Bus Number</label>
          <input
            type="text"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            placeholder="NB-1234"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Seat Count</label>
          <input
            type="number"
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            placeholder="54"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Starting Location</label>
          <input
            type="text"
            value={startingLocation}
            onChange={(e) => setStartingLocation(e.target.value)}
            placeholder="Colombo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Route Name</label>
          <select
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            disabled={routesLoading}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          >
            <option value="">Select a route</option>
            {routes.map((route) => (
              <option key={route.route_name} value={route.route_name}>
                {route.route_name}
              </option>
            ))}
          </select>
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
          {loading ? 'Adding Bus...' : 'Add Bus'}
        </button>
      </form>
    </div>
  )
}