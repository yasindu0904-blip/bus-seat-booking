'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import CustomerBottomNav from '@/components/customer/CustomerBottomNav'
import CustomerHeader from '@/components/customer/CustomerHeader'

type MeData = {
  uid: string
  email: string | null
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  profileCompleted: boolean
}

type MeResponse = {
  success: boolean
  data?: MeData
  message?: string
}

type Booking = {
  id: string
  startLocation: string
  endLocation: string
  tripDate: string
  departureTime: string
  shiftName: string
  seatNumber: string
  status: 'upcoming' | 'completed' | 'cancelled'
}

function getDateAfterDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}

/*
  Temporary data for UI testing.
  Later you can replace this with data coming from your booking API.
*/
const sampleBookings: Booking[] = [
  {
    id: '1',
    startLocation: 'Colombo',
    endLocation: 'Kandy',
    tripDate: getDateAfterDays(1),
    departureTime: '08:30',
    shiftName: 'Morning Shift',
    seatNumber: '12A',
    status: 'upcoming',
  },
  {
    id: '2',
    startLocation: 'Negombo',
    endLocation: 'Colombo',
    tripDate: getDateAfterDays(3),
    departureTime: '14:00',
    shiftName: 'Afternoon Shift',
    seatNumber: '08B',
    status: 'upcoming',
  },
  {
    id: '3',
    startLocation: 'Galle',
    endLocation: 'Matara',
    tripDate: getDateAfterDays(6),
    departureTime: '18:15',
    shiftName: 'Evening Shift',
    seatNumber: '05C',
    status: 'upcoming',
  },
]

function getBookingDateTime(booking: Booking) {
  return new Date(`${booking.tripDate}T${booking.departureTime}`)
}

function getFutureBookings(bookings: Booking[]) {
  const now = new Date()

  return bookings
    .filter((booking) => {
      return booking.status === 'upcoming' && getBookingDateTime(booking) >= now
    })
    .sort((a, b) => {
      return getBookingDateTime(a).getTime() - getBookingDateTime(b).getTime()
    })
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':')
  const date = new Date()
  date.setHours(Number(hours))
  date.setMinutes(Number(minutes))

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function TicketsPage() {
  const [me, setMe] = useState<MeData | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPageData() {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        })

        const result: MeResponse = await response.json()

        if (result.success && result.data) {
          setMe(result.data)
        }

        /*
          Later replace this line with your real API data.
          Example:
          const bookingsResponse = await fetch('/api/customer/bookings')
        */
        setBookings(sampleBookings)
      } catch (error) {
        console.error('Failed to load tickets page:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPageData()
  }, [])

  const futureBookings = useMemo(() => {
    return getFutureBookings(bookings)
  }, [bookings])

  const closestBooking = futureBookings[0]
  const otherFutureBookings = futureBookings.slice(1)

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-200 text-[#161d18]">
        <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center bg-[#f4fbf3]">
          <p className="font-semibold text-[#006d43]">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f4fbf3] pb-32">
        <CustomerHeader firstName={me?.firstName} />

        <section className="px-5 pt-5">
          <div className="mb-7">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#0d50d5]">
              Travel History
            </span>

            <h2 className="text-4xl font-extrabold tracking-tight text-[#161d18]">
              Upcoming Journeys
            </h2>

            <div className="mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-[#006d43] to-[#00a86b]" />
          </div>

          {/* Closest Booking Section */}
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-[#161d18]">
              Closest Booking
            </h3>

            {closestBooking ? (
              <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_4px_24px_rgba(22,29,24,0.08)]">
                <div className="bg-gradient-to-r from-[#006d43] to-[#00a86b] p-7 text-white">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-white/80">
                        Next Departure
                      </p>

                      <h3 className="text-3xl font-extrabold">
                        {closestBooking.startLocation}
                      </h3>

                      <div className="my-3 flex items-center gap-3">
                        <div className="h-[2px] w-8 bg-white/40" />
                        <span className="text-xl">🚌</span>
                        <div className="h-[2px] w-8 bg-white/40" />
                      </div>

                      <h3 className="text-3xl font-extrabold">
                        {closestBooking.endLocation}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl font-extrabold">
                        {formatTime(closestBooking.departureTime)}
                      </span>
                      <p className="text-sm text-white/80">
                        {closestBooking.shiftName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-dashed border-[#bccabe] bg-[#eef6ed] p-5 text-center">
                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#3d4a41]">
                      Date
                    </p>
                    <p className="text-sm font-bold text-[#161d18]">
                      {formatDate(closestBooking.tripDate)}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#3d4a41]">
                      Seat
                    </p>
                    <p className="text-sm font-bold text-[#161d18]">
                      {closestBooking.seatNumber}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#3d4a41]">
                      Status
                    </p>
                    <p className="text-sm font-bold text-[#006d43]">
                      Upcoming
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                <p className="font-bold text-[#161d18]">No upcoming booking</p>
                <p className="mt-2 text-sm text-[#3d4a41]">
                  Your closest booking will appear here.
                </p>
              </div>
            )}
          </div>

          {/* Other Future Bookings */}
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-bold text-[#161d18]">
              Other Future Bookings
            </h3>

            {otherFutureBookings.length > 0 ? (
              <div className="space-y-4">
                {otherFutureBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[1.5rem] bg-[#eef6ed] p-5 shadow-sm"
                  >
                    <div className="mb-5 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d50d5]/10 text-xl">
                        📅
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#3d4a41]">
                        FUTURE
                      </span>
                    </div>

                    <p className="mb-1 text-xs font-bold uppercase text-[#3d4a41]">
                      Route
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-xl font-extrabold">
                        {booking.startLocation}
                      </span>
                      <span className="text-[#006d43]">→</span>
                      <span className="text-xl font-extrabold">
                        {booking.endLocation}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="mb-1 text-xs uppercase text-[#3d4a41]">
                          Shift
                        </p>
                        <p className="text-sm font-bold">{booking.shiftName}</p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs uppercase text-[#3d4a41]">
                          Date
                        </p>
                        <p className="text-sm font-bold">
                          {formatDate(booking.tripDate)}
                        </p>
                      </div>

                      <div>
                        <p className="mb-1 text-xs uppercase text-[#3d4a41]">
                          Time
                        </p>
                        <p className="text-sm font-bold">
                          {formatTime(booking.departureTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#eef6ed] p-6 text-center">
                <p className="font-bold text-[#161d18]">
                  No other future bookings
                </p>
              </div>
            )}
          </div>

          {/* History Button */}
          <Link
            href="/tickets/history"
            className="flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-[#bccabe] bg-white px-6 py-6 text-center text-lg font-extrabold text-[#006d43] shadow-sm active:scale-[0.98]"
          >
            <span className="text-2xl">🕘</span>
            History
          </Link>
        </section>

        <CustomerBottomNav activeTab="tickets" />
      </div>
    </main>
  )
}