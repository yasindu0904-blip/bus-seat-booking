'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BusItem = {
  id: string
  bus_number: string
  seat_count: number | null
  created_at: string
}

export default function AdminBusesPage() {
  const router = useRouter()

  const [busNumber, setBusNumber] = useState('')
  const [seatCount, setSeatCount] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [showBuses, setShowBuses] = useState(false)
  const [busesLoading, setBusesLoading] = useState(false)
  const [busesError, setBusesError] = useState('')
  const [buses, setBuses] = useState<BusItem[]>([])

  const fetchBuses = async () => {
    setBusesLoading(true)
    setBusesError('')

    try {
      const response = await fetch('/api/admin/show-buses', {
        method: 'GET',
      })

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
    if (showBuses) {
      setShowBuses(false)
      return
    }

    setShowBuses(true)
    await fetchBuses()
  }

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

      if (showBuses) {
        await fetchBuses()
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add Bus</h1>

          <button
            type="button"
            onClick={() => router.push('/admin/admin-dashboard')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Back
          </button>
        </div>

        <div className="space-y-6">
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

              <button
                type="button"
                onClick={handleShowBuses}
                className="w-full rounded-xl border border-[#161d18] px-4 py-3 text-[#161d18]"
              >
                {showBuses ? 'Hide Buses' : 'Show Buses'}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-xl font-semibold">Buses Table</h2>

            {!showBuses ? (
              <p className="text-sm text-gray-500">
                Press &quot;Show Buses&quot; to load all buses.
              </p>
            ) : busesLoading ? (
              <p className="text-sm text-gray-500">Loading buses...</p>
            ) : busesError ? (
              <p className="text-sm text-red-600">{busesError}</p>
            ) : buses.length === 0 ? (
              <p className="text-sm text-gray-500">No buses found.</p>
            ) : (
              <div className="overflow-x-auto">
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
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((bus) => (
                      <tr key={bus.id}>
                        <td className="border border-gray-300 px-4 py-2">
                          {bus.bus_number}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {bus.seat_count ?? '-'}
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
          </div>
        </div>
      </div>
    </main>
  )
}