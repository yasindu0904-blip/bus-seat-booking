'use client'

import { useEffect, useState } from 'react'
import SelectBusForShifts from './SelectBusForShifts'

type RouteItem = {
  id: string
  route_name: string
  start_location: string
  created_at: string
}

type ShowRoutesResponse = {
  success: boolean
  message: string
  data: RouteItem[]
}

export default function AddBusesByTimePeriodForm() {
  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [routesLoading, setRoutesLoading] = useState(true)
  const [routesError, setRoutesError] = useState('')

  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const [submittedData, setSubmittedData] = useState<{
    routes_id: string
    route_name: string
    start_location: string
    trip_date: string
  } | null>(null)

  useEffect(() => {
    async function fetchRoutes() {
      try {
        setRoutesLoading(true)
        setRoutesError('')

        const response = await fetch('/api/admin/show-routes', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        const result: ShowRoutesResponse = await response.json()

        if (!response.ok || !result.success) {
          setRoutesError(result.message || 'Failed to load routes')
          setRoutes([])
          return
        }

        setRoutes(result.data || [])
      } catch (error) {
        console.error('Failed to fetch routes:', error)
        setRoutesError('Something went wrong while loading routes')
        setRoutes([])
      } finally {
        setRoutesLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  function handleFill(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedRouteId || !selectedDate) {
      return
    }

    const selectedRoute = routes.find((route) => route.id === selectedRouteId)

    if (!selectedRoute) {
      setRoutesError('Selected route was not found')
      return
    }

    setSubmittedData({
      routes_id: selectedRoute.id,
      route_name: selectedRoute.route_name,
      start_location: selectedRoute.start_location,
      trip_date: selectedDate,
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Step 1 - Route and Date
        </h2>

        <form onSubmit={handleFill} className="space-y-4">
          <div>
            <label
              htmlFor="routes_id"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Route
            </label>

            <select
              id="routes_id"
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              disabled={routesLoading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              required
            >
              <option value="">
                {routesLoading ? 'Loading routes...' : 'Select a route'}
              </option>

              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.route_name} - {route.start_location}
                </option>
              ))}
            </select>

            {routesError ? (
              <p className="mt-2 text-sm text-red-600">{routesError}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="trip_date"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Date
            </label>

            <input
              id="trip_date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Fill
          </button>
        </form>
      </section>

      {submittedData ? (
        <SelectBusForShifts
          routesId={submittedData.routes_id}
          routeName={submittedData.route_name}
          startLocation={submittedData.start_location}
          tripDate={submittedData.trip_date}
        />
      ) : null}
    </div>
  )
}