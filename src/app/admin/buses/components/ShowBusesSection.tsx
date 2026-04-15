'use client'

import { useMemo, useState } from 'react'

type BusItem = {
  id: string
  bus_number: string
  seat_count: number | null
  start_location: string
  route_name: string
  created_at: string
}

export default function ShowBusesSection() {
  const [showBusNumber, setShowBusNumber] = useState('')
  const [showStartingLocation, setShowStartingLocation] = useState('')
  const [showRouteName, setShowRouteName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showBuses, setShowBuses] = useState(false)
  const [busesLoading, setBusesLoading] = useState(false)
  const [busesError, setBusesError] = useState('')
  const [buses, setBuses] = useState<BusItem[]>([])

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
          credentials: 'include',
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        setBusesError(result.message || 'Failed to fetch buses')
        setBuses([])
        return
      }

      setBuses(result.data || [])
    } catch {
      setBusesError('Something went wrong while fetching buses')
      setBuses([])
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
      setBusesError('Please fill bus number, starting location, or route name')
      return
    }

    setBusesError('')
    setShowBuses(true)
    await fetchBuses()
  }

  const filteredBuses = useMemo(() => {
    const value = searchTerm.trim().toLowerCase()

    if (!value) {
      return buses
    }

    return buses.filter((bus) => {
      return (
        bus.bus_number.toLowerCase().includes(value) ||
        bus.start_location.toLowerCase().includes(value) ||
        bus.route_name.toLowerCase().includes(value)
      )
    })
  }, [buses, searchTerm])

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-xl font-semibold">Show Buses</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Search Bus Number
          </label>
          <input
            type="text"
            value={showBusNumber}
            onChange={(e) => setShowBusNumber(e.target.value)}
            placeholder="NB-1234"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Search Starting Location
          </label>
          <input
            type="text"
            value={showStartingLocation}
            onChange={(e) => setShowStartingLocation(e.target.value)}
            placeholder="Colombo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Search Route Name
          </label>
          <input
            type="text"
            value={showRouteName}
            onChange={(e) => setShowRouteName(e.target.value)}
            placeholder="120"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none"
          />
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
                        {bus.start_location}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {bus.route_name}
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