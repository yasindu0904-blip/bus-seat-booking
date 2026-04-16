'use client'

import { useEffect, useState } from 'react'

type SelectBusForShiftsProps = {
  routesId: string
  routeName: string
  startLocation: string
  tripDate: string
}

type BusItem = {
  bus_number: string
  seat_count: number | null
}

type ShiftData = {
  shift: 1 | 2 | 3 | 4
  bus_number: string
}

type GetShiftBusesResponse = {
  success: boolean
  message: string
  data: {
    shift: 1 | 2 | 3 | 4
    bus_number: string | null
  }[]
}

type ShowBusesForRouteResponse = {
  success: boolean
  message: string
  data: BusItem[]
}

export default function SelectBusForShifts({
  routesId,
  routeName,
  startLocation,
  tripDate,
}: SelectBusForShiftsProps) {
  const [availableBuses, setAvailableBuses] = useState<BusItem[]>([])
  const [shiftSelections, setShiftSelections] = useState<ShiftData[]>([
    { shift: 1, bus_number: '' },
    { shift: 2, bus_number: '' },
    { shift: 3, bus_number: '' },
    { shift: 4, bus_number: '' },
  ])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function fetchShiftData() {
      try {
        setLoading(true)
        setErrorMessage('')
        setSuccessMessage('')

        const [shiftResponse, busesResponse] = await Promise.all([
          fetch(
            `/api/admin/bus-shifts-get?routes_id=${encodeURIComponent(
              routesId
            )}&trip_date=${encodeURIComponent(tripDate)}`,
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            }
          ),

          fetch(
            `/api/admin/show-buses-for-route?routes_id=${encodeURIComponent(
              routesId
            )}`,
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            }
          ),
        ])

        const shiftResult: GetShiftBusesResponse = await shiftResponse.json()
        const busesResult: ShowBusesForRouteResponse =
          await busesResponse.json()

        if (!shiftResponse.ok || !shiftResult.success) {
          setErrorMessage(shiftResult.message || 'Failed to load shift buses')
          return
        }

        if (!busesResponse.ok || !busesResult.success) {
          setErrorMessage(busesResult.message || 'Failed to load route buses')
          return
        }

        setAvailableBuses(busesResult.data || [])

        const loadedShifts: ShiftData[] = [1, 2, 3, 4].map((shift) => {
          const existingShift = shiftResult.data?.find(
            (item) => Number(item.shift) === shift
          )

          return {
            shift: shift as 1 | 2 | 3 | 4,
            bus_number: existingShift?.bus_number || '',
          }
        })

        setShiftSelections(loadedShifts)
      } catch (error) {
        console.error('fetchShiftData error:', error)
        setErrorMessage('Something went wrong while loading shift data')
      } finally {
        setLoading(false)
      }
    }

    fetchShiftData()
  }, [routesId, tripDate])

  function handleBusChange(shift: 1 | 2 | 3 | 4, busNumber: string) {
    setShiftSelections((prev) =>
      prev.map((item) =>
        item.shift === shift ? { ...item, bus_number: busNumber } : item
      )
    )
  }

  async function handleSave() {
    try {
      setSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      const selectedBusNumbers = shiftSelections
        .map((item) => item.bus_number)
        .filter((busNumber) => busNumber.trim() !== '')

      const uniqueBusNumbers = new Set(selectedBusNumbers)

      if (uniqueBusNumbers.size !== selectedBusNumbers.length) {
        setErrorMessage('Same bus cannot be selected for multiple shifts')
        return
      }

      const response = await fetch('/api/admin/bus-shifts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          routes_id: routesId,
          trip_date: tripDate,
          shifts: shiftSelections.map((item) => ({
            shift: item.shift,
            bus_number: item.bus_number || null,
          })),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setErrorMessage(result.message || 'Failed to save shift buses')
        return
      }

      setSuccessMessage(result.message || 'Shift buses saved successfully')
    } catch (error) {
      console.error('handleSave error:', error)
      setErrorMessage('Something went wrong while saving shift buses')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Step 2 - Select Bus for Shifts
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
        <p className="text-sm text-gray-500">Loading shift buses...</p>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="mb-4 text-sm text-green-600">{successMessage}</p>
      ) : null}

      {!loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((shift) => {
            const selectedBusNumber =
              shiftSelections.find((item) => item.shift === shift)
                ?.bus_number || ''

            return (
              <div
                key={shift}
                className="grid gap-2 rounded-lg border border-gray-200 p-4 md:grid-cols-[120px_1fr]"
              >
                <label
                  htmlFor={`shift-${shift}`}
                  className="text-sm font-medium text-gray-700"
                >
                  Shift {shift}
                </label>

                <select
                  id={`shift-${shift}`}
                  value={selectedBusNumber}
                  onChange={(e) =>
                    handleBusChange(
                      shift as 1 | 2 | 3 | 4,
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                >
                  <option value="">Select a bus</option>

                  {availableBuses.map((bus) => (
                    <option key={bus.bus_number} value={bus.bus_number}>
                      {bus.bus_number}
                      {bus.seat_count ? ` - ${bus.seat_count} seats` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      ) : null}
    </section>
  )
}