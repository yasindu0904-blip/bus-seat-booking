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
  done: boolean
}

type ShiftSelection = {
  shift: 1 | 2 | 3 | 4
  bus_number: string
  done: boolean
}

type BusItem = {
  bus_number: string
  seat_count: number | null
}

type GetRouteShiftBusesResponse = {
  success: boolean
  message: string
  data?: ShiftBusItem[]
}

type GetBusesByRouteResponse = {
  success: boolean
  message: string
  data?: BusItem[]
}

export default function SelectBusForShifts({
  routesId,
  routeName,
  startLocation,
  tripDate,
}: SelectBusForShiftsProps) {
  const [availableBuses, setAvailableBuses] = useState<BusItem[]>([])
  const [shiftSelections, setShiftSelections] = useState<ShiftSelection[]>([
    { shift: 1, bus_number: '', done: false },
    { shift: 2, bus_number: '', done: false },
    { shift: 3, bus_number: '', done: false },
    { shift: 4, bus_number: '', done: false },
  ])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [togglingShift, setTogglingShift] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  async function fetchData() {
    try {
      setLoading(true)
      setErrorMessage('')
      setSuccessMessage('')

      const [shiftResponse, busesResponse] = await Promise.all([
        fetch(
          `/api/admin/get-route-shift-buses?routes_id=${encodeURIComponent(
            routesId
          )}&trip_date=${encodeURIComponent(tripDate)}`,
          {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          }
        ),
        fetch(
          `/api/admin/get-buses-by-route?routes_id=${encodeURIComponent(
            routesId
          )}`,
          {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
          }
        ),
      ])

      const shiftText = await shiftResponse.text()
      const busesText = await busesResponse.text()

      let shiftResult: GetRouteShiftBusesResponse
      let busesResult: GetBusesByRouteResponse

      try {
        shiftResult = JSON.parse(shiftText)
      } catch {
        console.error('Shift API returned non-JSON:', shiftText)
        setErrorMessage(
          'Shift API did not return JSON. Check /api/admin/get-route-shift-buses.'
        )
        return
      }

      try {
        busesResult = JSON.parse(busesText)
      } catch {
        console.error('Buses API returned non-JSON:', busesText)
        setErrorMessage(
          'Buses API did not return JSON. Check /api/admin/get-buses-by-route.'
        )
        return
      }

      if (!shiftResponse.ok || !shiftResult.success) {
        setErrorMessage(
          shiftResult.message || 'Failed to load saved shift bus numbers'
        )
        return
      }

      if (!busesResponse.ok || !busesResult.success) {
        setErrorMessage(
          busesResult.message || 'Failed to load buses for this route'
        )
        return
      }

      setAvailableBuses(busesResult.data || [])

      const loadedShifts: ShiftSelection[] = [1, 2, 3, 4].map((shift) => {
        const existingShift = shiftResult.data?.find(
          (item) => Number(item.shift) === shift
        )

        return {
          shift: shift as 1 | 2 | 3 | 4,
          bus_number: existingShift?.bus_number || '',
          done: existingShift?.done ?? false,
        }
      })

      setShiftSelections(loadedShifts)
    } catch (error) {
      console.error('fetchData error:', error)
      setErrorMessage('Something went wrong while loading shift data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

      const saveResponse = await fetch('/api/admin/save-route-shift-buses', {
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

      const saveText = await saveResponse.text()

      let saveResult: {
        success: boolean
        message: string
      }

      try {
        saveResult = JSON.parse(saveText)
      } catch {
        console.error('Save API returned non-JSON:', saveText)
        setErrorMessage(
          'Save API did not return JSON. Check /api/admin/save-route-shift-buses.'
        )
        return
      }

      if (!saveResponse.ok || !saveResult.success) {
        setErrorMessage(saveResult.message || 'Failed to save route shift buses')
        return
      }

      const seatPayload = shiftSelections.map((item) => {
        const matchedBus = availableBuses.find(
          (bus) => bus.bus_number === item.bus_number
        )

        return {
          shift: item.shift,
          bus_number: item.bus_number || null,
          seat_count: matchedBus?.seat_count ?? null,
        }
      })

      const seatsResponse = await fetch(
        '/api/admin/create-bus-seats-for-shifts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            routes_id: routesId,
            trip_date: tripDate,
            shifts: seatPayload,
          }),
        }
      )

      const seatsText = await seatsResponse.text()

      let seatsResult: {
        success: boolean
        message: string
      }

      try {
        seatsResult = JSON.parse(seatsText)
      } catch {
        console.error('Create seats API returned non-JSON:', seatsText)
        setErrorMessage(
          'Create seats API did not return JSON. Check /api/admin/create-bus-seats-for-shifts.'
        )
        return
      }

      if (!seatsResponse.ok || !seatsResult.success) {
        setErrorMessage(seatsResult.message || 'Failed to create bus seats')
        return
      }

      setSuccessMessage('Route shift buses and bus seats saved successfully')
      await fetchData()
    } catch (error) {
      console.error('handleSave error:', error)
      setErrorMessage('Something went wrong while saving route shift buses')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleDone(shift: 1 | 2 | 3 | 4, nextDoneValue: boolean) {
    try {
      setTogglingShift(shift)
      setErrorMessage('')
      setSuccessMessage('')

      const response = await fetch('/api/admin/toggle-route-shift-done', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          routes_id: routesId,
          trip_date: tripDate,
          shift,
          done: nextDoneValue,
        }),
      })

      const text = await response.text()

      let result: {
        success: boolean
        message: string
      }

      try {
        result = JSON.parse(text)
      } catch {
        console.error('Toggle done API returned non-JSON:', text)
        setErrorMessage(
          'Toggle done API did not return JSON. Check /api/admin/toggle-route-shift-done.'
        )
        return
      }

      if (!response.ok || !result.success) {
        setErrorMessage(result.message || 'Failed to update done status')
        return
      }

      setSuccessMessage(result.message || 'Done status updated')

      setShiftSelections((prev) =>
        prev.map((item) =>
          item.shift === shift ? { ...item, done: nextDoneValue } : item
        )
      )
    } catch (error) {
      console.error('handleToggleDone error:', error)
      setErrorMessage('Something went wrong while updating done status')
    } finally {
      setTogglingShift(null)
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
        <p className="text-sm text-gray-500">Loading shifts...</p>
      ) : null}

      {errorMessage ? (
        <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
      ) : null}

      {successMessage ? (
        <p className="mb-4 text-sm text-green-600">{successMessage}</p>
      ) : null}

      {!loading && !errorMessage ? (
        <div className="space-y-4">
          {shiftSelections.map((item) => (
            <div
              key={item.shift}
              className="grid gap-3 rounded-lg border border-gray-200 p-4 md:grid-cols-[100px_1fr_110px_120px]"
            >
              <div className="text-sm font-medium text-gray-700">
                Shift {item.shift}
              </div>

              <select
                value={item.bus_number}
                onChange={(e) => handleBusChange(item.shift, e.target.value)}
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

              <div className="flex items-center">
                {item.done ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                    Done
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                    Not done
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleToggleDone(item.shift, !item.done)}
                disabled={togglingShift === item.shift}
                className="rounded-lg border border-black px-3 py-2 text-sm font-medium text-black disabled:opacity-60"
              >
                {togglingShift === item.shift
                  ? 'Updating...'
                  : item.done
                  ? 'Not done'
                  : 'Done'}
              </button>
            </div>
          ))}

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