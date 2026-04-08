'use client'

import { useState } from 'react'

export default function AddBusForm() {
  const [busNumber, setBusNumber] = useState('')
  const [seatCount, setSeatCount] = useState('')
  const [nowLocation, setNowLocation] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

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
          nowLocation,
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
      setNowLocation('')
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
          <label className="mb-1 block text-sm font-medium">Now Location</label>
          <input
            type="text"
            value={nowLocation}
            onChange={(e) => setNowLocation(e.target.value)}
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
          {loading ? 'Adding Bus...' : 'Add Bus'}
        </button>
      </form>
    </div>
  )
}