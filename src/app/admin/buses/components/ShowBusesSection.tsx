'use client'

import { useEffect, useMemo, useState } from 'react'

type BusItem = {
  id: string
  bus_number: string
  seat_count: number | null
  starting_location: string | null
  route_name: string
  created_at: string
}

type RouteItem = {
  route_name: string
  start_location: string
  end_location: string
}

export default function ShowBusesSection() {
  const [showBusNumber, setShowBusNumber] = useState('')
  const [showStartingLocation, setShowStartingLocation] = useState('')
  const [showRouteName, setShowRouteName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [routes, setRoutes] = useState<RouteItem[]>([])
  const [routesLoading, setRoutesLoading] = useState(true)

  const [showBuses, setShowBuses] = useState(false)
  const [busesLoading, setBusesLoading] = useState(false)
  const [busesError, setBusesError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [buses, setBuses] = useState<BusItem[]>([])

  const [updatingBusId, setUpdatingBusId] = useState<string | null>(null)
  const [editingLocationBusId, setEditingLocationBusId] = useState<string | null>(null)
  const [editingLocationValue, setEditingLocationValue] = useState('')

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/api/admin/show-routes')
        const result = await response.json()

        if (!response.ok) {
          setBusesError(result.message || 'Failed to load routes')
          return
        }

        setRoutes(result.data || [])
      } catch {
        setBusesError('Something went wrong while loading routes')
      } finally {
        setRoutesLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  const fetchBuses = async () => {
    setBusesLoading(true)
    setBusesError('')

    try {
      const queryParams = new URLSearchParams()

      if (showBusNumber.trim()) {
        queryParams.append('busNumber', showBusNumber.trim())
      }

      if (showStartingLocation.trim()) {
        queryParams.append('startingLocation', showStartingLocation.trim())
      }

      if (showRouteName.trim()) {
        queryParams.append('routeName', showRouteName.trim())
      }

      const response = await fetch(
        `/api/admin/show-buses?${queryParams.toString()}`,
        {
          method: 'GET',
        }
      )

      const result = await response.json()

      if (!response.ok) {
        setBusesError(result.message || 'Failed to fetch buses')
        return
      }

      setBuses(result.data || [])
    } catch {
      setBusesError('Something went wrong while fetching buses')
    } finally {
      setBusesLoading(false)
    }
  }

  const handleShowBuses = async () => {
    if (
      !showBusNumber.trim() &&
      !showStartingLocation.trim() &&
      !showRouteName.trim()
    ) {
      setBusesError('Please fill bus number or starting location or route name to show buses')
      return
    }

    setBusesError('')
    setShowBuses(true)
    await fetchBuses()
  }

  const startEditLocation = (bus: BusItem) => {
    setEditingLocationBusId(bus.id)
    setEditingLocationValue(bus.starting_location || '')
  }

  const handleStartingLocationUpdate = async (busId: string) => {
    setUpdatingBusId(busId)
    setBusesError('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/admin/update-bus-starting-location', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busId,
          startingLocation: editingLocationValue,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setBusesError(result.message || 'Failed to update starting location')
        return
      }

      setSuccessMessage(result.message || 'Starting location updated successfully')
      setEditingLocationBusId(null)
      setEditingLocationValue('')
      await fetchBuses()
    } catch {
      setBusesError('Something went wrong while updating starting location')
    } finally {
      setUpdatingBusId(null)
    }
  }

  const filteredBuses = useMemo(() => {
    const value = searchTerm.trim().toLowerCase()

    if (!value) {
      return buses
    }

    return buses.filter((bus) => {
      const busNumberValue = bus.bus_number?.toLowerCase() || ''
      const locationValue = bus.starting_location?.toLowerCase() || ''
      const routeNameValue = bus.route_name?.toLowerCase() || ''

      return (
        busNumberValue.includes(value) ||
        locationValue.includes(value) ||
        routeNameValue.includes(value)
      )
    })
  }, [buses, searchTerm])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-xl font-semibold">Show Buses</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Search Bus Number</label>
          <input
            type="text"
            value={showBusNumber}
            onChange={(e) => setShowBusNumber(e.target.value)}
            placeholder="NB-1234"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Search Starting Location</label>
          <input
            type="text"
            value={showStartingLocation}
            onChange={(e) => setShowStartingLocation(e.target.value)}
            placeholder="Colombo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Search Route Name</label>
          <select
            value={showRouteName}
            onChange={(e) => setShowRouteName(e.target.value)}
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
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={handleShowBuses}
          className="w-full rounded-xl border border-[#161d18] px-4 py-3 text-[#161d18]"
        >
          Show Buses
        </button>
      </div>

      {busesError ? (
        <p className="mt-4 text-sm text-red-600">{busesError}</p>
      ) : null}

      {successMessage ? (
        <p className="mt-4 text-sm text-green-600">{successMessage}</p>
      ) : null}

      {showBuses ? (
        <>
          <div className="mt-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search inside loaded buses"
              className="w-full max-w-sm rounded-xl border border-gray-300 px-4 py-2 outline-none"
            />
          </div>

          {busesLoading ? (
            <p className="mt-4 text-sm text-gray-500">Loading buses...</p>
          ) : filteredBuses.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No buses found.</p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Bus Number
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Seat Count
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Starting Location
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Route Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Actions
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBuses.map((bus) => (
                    <tr key={bus.id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {bus.bus_number}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {bus.seat_count ?? '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {editingLocationBusId === bus.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingLocationValue}
                              onChange={(e) => setEditingLocationValue(e.target.value)}
                              className="rounded-lg border border-gray-300 px-2 py-1 outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleStartingLocationUpdate(bus.id)}
                              disabled={updatingBusId === bus.id}
                              className="rounded-lg border border-[#161d18] px-3 py-1"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLocationBusId(null)
                                setEditingLocationValue('')
                              }}
                              className="rounded-lg border border-gray-300 px-3 py-1"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{bus.starting_location || '-'}</span>
                            <button
                              type="button"
                              onClick={() => startEditLocation(bus)}
                              className="rounded-lg border border-[#161d18] px-3 py-1"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {bus.route_name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className="text-sm text-gray-500">Edit location only</span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(bus.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}