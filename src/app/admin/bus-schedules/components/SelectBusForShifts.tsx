'use client'

import { useEffect, useState } from 'react'

type SelectBusForShiftsProps = {
  routeName: string
  tripDate: string
}

type BusItem = {
  bus_number: string
  starting_location: string | null
  route_name: string
}

type ShiftData = {
  shift: 1 | 2 | 3 | 4
  bus_number: string
}

type ShowBusesResponse = {
  success: boolean
  message: string
  data: BusItem[]
}

type GetShiftBusesResponse = {
  success: boolean
  message: string
  data: {
    shift: 1 | 2 | 3 | 4
    bus_number: string | null
  }[]
}

export default function SelectBusForShifts({
  routeName,
  tripDate,
}: SelectBusForShiftsProps) {
  const [availableBuses, setAvailableBuses] = useState<BusItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const [shiftSelections, setShiftSelections] = useState<ShiftData[]>([
    { shift: 1, bus_number: '' },
    { shift: 2, bus_number: '' },
    { shift: 3, bus_number: '' },
    { shift: 4, bus_number: '' },
  ])

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError('')
        setSaveMessage('')

        const [busesRes, shiftsRes] = await Promise.all([
          fetch(
            `/api/admin/show-buses-for-route?route_name=${encodeURIComponent(routeName)}`,
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            }
          ),
          fetch(
            `/api/admin/bus-shifts-get?route_name=${encodeURIComponent(routeName)}&trip_date=${encodeURIComponent(tripDate)}`,
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
            }
          ),
        ])

        const busesResult: ShowBusesResponse = await busesRes.json()
        const shiftsResult: GetShiftBusesResponse = await shiftsRes.json()

        if (!busesRes.ok || !busesResult.success) {
          setError(busesResult.message || 'Failed to load buses')
          return
        }

        if (!shiftsRes.ok || !shiftsResult.success) {
          setError(shiftsResult.message || 'Failed to load current shift buses')
          return
        }

        setAvailableBuses(busesResult.data || [])

        setShiftSelections(
          (shiftsResult.data || []).map((item) => ({
            shift: item.shift,
            bus_number: item.bus_number ?? '',
          })) as ShiftData[]
        )
      } catch (err) {
        console.error('fetchData error:', err)
        setError('Something went wrong while loading shift data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [routeName, tripDate])

  function handleChange(shift: 1 | 2 | 3 | 4, busNumber: string) {
    setShiftSelections((prev) =>
      prev.map((item) =>
        item.shift === shift ? { ...item, bus_number: busNumber } : item
      )
    )
  }

  async function handleSave() {
    try {
      setSaveMessage('')
      setError('')

      const response = await fetch('/api/admin/bus-shifts-save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          route_name: routeName,
          trip_date: tripDate,
          shifts: shiftSelections.map((item) => ({
            shift: item.shift,
            bus_number: item.bus_number || null,
          })),
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setError(result.message || 'Failed to save shift buses')
        return
      }

      setSaveMessage(result.message || 'Saved successfully')
    } catch (err) {
      console.error('handleSave error:', err)
      setError('Something went wrong while saving')
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Step 2 - Select Bus for Shifts
      </h2>

      <div className="mb-6 space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Route:</span> {routeName}
        </p>
        <p>
          <span className="font-medium">Date:</span> {tripDate}
        </p>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading shifts...</p> : null}

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      {saveMessage ? (
        <p className="mb-4 text-sm text-green-600">{saveMessage}</p>
      ) : null}

      {!loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((shift) => {
            const selectedValue =
              shiftSelections.find((item) => item.shift === shift)?.bus_number || ''

            return (
              <div key={shift}>
                <label
                  htmlFor={`shift-${shift}`}
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Shift {shift}
                </label>

                <select
                  id={`shift-${shift}`}
                  value={selectedValue}
                  onChange={(e) =>
                    handleChange(shift as 1 | 2 | 3 | 4, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
                >
                  <option value="">Select a bus</option>

                  {availableBuses.map((bus) => (
                    <option key={bus.bus_number} value={bus.bus_number}>
                      {bus.bus_number}
                    </option>
                  ))}
                </select>
              </div>
            )
          })}

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Save
          </button>
        </div>
      ) : null}
    </section>
  )
}