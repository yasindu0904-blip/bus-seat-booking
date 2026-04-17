'use client'

import { useEffect, useState } from 'react'

type SelectBusForShiftsProps = {
  routesId: string
  routeName: string
  startLocation: string
  tripDate: string
}

type ShiftBusItem = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
}

type GetRouteShiftBusesResponse = {
  success: boolean
  message: string
  data?: ShiftBusItem[]
}

export default function SelectBusForShifts({
  routesId,
  routeName,
  startLocation,
  tripDate,
}: SelectBusForShiftsProps) {
  const [shifts, setShifts] = useState<ShiftBusItem[]>([
    { shift: 1, bus_number: null },
    { shift: 2, bus_number: null },
    { shift: 3, bus_number: null },
    { shift: 4, bus_number: null },
  ])

  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function fetchShiftBusNumbers() {
      try {
        setLoading(true)
        setErrorMessage('')

        const response = await fetch(
          `/api/admin/get-route-shift-buses?routes_id=${encodeURIComponent(
            routesId
          )}&trip_date=${encodeURIComponent(tripDate)}`,
          {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          }
        )

        const text = await response.text()

        let result: GetRouteShiftBusesResponse

        try {
          result = JSON.parse(text)
        } catch {
          console.error('API returned non-JSON:', text)

          setErrorMessage(
            'API did not return JSON. Check /api/admin/get-route-shift-buses route.'
          )
          return
        }

        if (!response.ok || !result.success) {
          setErrorMessage(result.message || 'Failed to load shift bus numbers')
          return
        }

        setShifts(
          result.data || [
            { shift: 1, bus_number: null },
            { shift: 2, bus_number: null },
            { shift: 3, bus_number: null },
            { shift: 4, bus_number: null },
          ]
        )
      } catch (error) {
        console.error('fetchShiftBusNumbers error:', error)
        setErrorMessage('Something went wrong while loading shift bus numbers')
      } finally {
        setLoading(false)
      }
    }

    fetchShiftBusNumbers()
  }, [routesId, tripDate])

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Step 2 - Current Bus Numbers for Shifts
      </h2>

      <div className="mb-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
        <p>
          <span className="font-medium">Route:</span> {routeName}
        </p>

        <p>
          <span className="font-medium">Starting Location:</span>{' '}
          {startLocation}
        </p>

        <p>
          <span className="font-medium">Date:</span> {tripDate}
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading shifts...</p>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {!loading && !errorMessage ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Shift
                </th>

                <th className="border border-gray-300 px-4 py-2 text-left">
                  Bus Number
                </th>
              </tr>
            </thead>

            <tbody>
              {shifts.map((item) => (
                <tr key={item.shift}>
                  <td className="border border-gray-300 px-4 py-2">
                    Shift {item.shift}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {item.bus_number || 'No bus assigned'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}