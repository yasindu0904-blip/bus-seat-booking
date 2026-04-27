'use client'

import { useEffect, useState } from 'react'
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

export default function DashboardPage() {
  const [me, setMe] = useState<MeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMe() {
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
      } catch (error) {
        console.error('Failed to load customer details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMe()
  }, [])

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
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f4fbf3] pb-28">
        <CustomerHeader firstName={me?.firstName} />

        <section className="px-5 pt-3">
          {/* Hero Section */}
          <div className="relative mb-6 h-56 overflow-hidden rounded-2xl shadow-sm">
            <img
              alt="Scenic bus journey"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsCQ__I2ahugWzweih3nOzKqALRgjeo2APpYZ7jnF7yO3AMStRtO4A02q5voTZEvthgg89l-2b2JWcX2mdUmgm8Sdln4u9B2BjQbD7dYn_-DOEd7OL3rGX3SCSPs9aujhLMZ13rwglIqgXegLxkxXx_1uvzWQdKmVlLTwrzsiaNyfSQFWBlWM4vDsd1RDW5rR7PITyax3sRggFT2PAdb1ia4UNglsUwrvhs_sMhd-yVaXTjiuUYbRhcARPvJ_puRxktiAt5msMKLbM"
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-[#006d43]/85 to-transparent p-6">
              <span className="mb-2 text-xs font-bold uppercase tracking-widest text-white/90">
                Bus Ticket Booking
              </span>

              <h2 className="max-w-xs text-2xl font-extrabold leading-tight text-white">
                Discover New Routes Beyond the City.
              </h2>
            </div>
          </div>

          {/* View Routes Section */}
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(22,29,24,0.06)]">
            <h3 className="mb-3 text-xl font-bold text-[#161d18]">
              Find Your Bus Route
            </h3>

            <p className="mb-5 text-sm leading-6 text-[#3d4a41]">
              Check available routes and choose the best trip for your journey.
            </p>

            <button
              type="button"
              className="w-full rounded-2xl bg-[#006d43] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#006d43]/20 transition hover:bg-[#005232] active:scale-[0.98]"
            >
              View All Routes
            </button>
          </div>

          {/* Next Trip Section */}
          <div className="mb-6 rounded-2xl border border-[#bccabe]/40 bg-[#eef6ed] p-6">
            <h3 className="mb-4 text-xl font-bold text-[#161d18]">
              Your Next Trip
            </h3>

            <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[#0d50d5]/10 px-3 py-1 text-xs font-bold uppercase text-[#0d50d5]">
                  Upcoming
                </span>

                <span className="text-xs text-[#3d4a41]">No ticket yet</span>
              </div>

              <p className="text-sm font-semibold text-[#3d4a41]">
                Your booked trip details will appear here after booking.
              </p>
            </div>

            <button
              type="button"
              className="w-full rounded-2xl bg-gradient-to-r from-[#006d43] to-[#00a86b] py-4 font-bold text-white shadow-lg shadow-[#006d43]/20 transition hover:opacity-90 active:scale-[0.98]"
            >
              View Ticket Details
            </button>
          </div>

          {/* Start Booking Section */}
          <div className="rounded-2xl bg-[#386bef] p-7 text-center text-white shadow-lg">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl">
              🚌
            </div>

            <h4 className="mb-3 text-2xl font-extrabold">Select a Route</h4>

            <p className="mb-7 text-sm leading-6 text-white/85">
              Ready for your next journey? Start booking by choosing a route.
            </p>

            <button
              type="button"
              className="rounded-full bg-white px-8 py-4 text-lg font-bold text-[#0d50d5] shadow-md transition hover:bg-[#eef6ed] active:scale-95"
            >
              Start Booking
            </button>
          </div>
        </section>

        <CustomerBottomNav activeTab="book" />

        {/* Floating Search Button */}
        <button
          type="button"
          className="fixed bottom-24 right-[calc(50%-11rem)] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#ef6c0b] text-xl text-white shadow-2xl active:scale-95"
        >
          🔍
        </button>
      </div>
    </main>
  )
}