'use client'
import AdminHeader from '@/components/admin/AdminHeader'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddBusForm from './components/AddBusForm'
import ShowBusesSection from './components/ShowBusesSection'

export default function AdminBusesPage() {
  const router = useRouter()
  const [showBusesSection, setShowBusesSection] = useState(false)

  return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-6xl bg-[#f4fbf3] px-5 pb-10 pt-6">
        <AdminHeader />
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
          <AddBusForm />

          {!showBusesSection ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <button
                type="button"
                onClick={() => setShowBusesSection(true)}
                className="w-full rounded-xl border border-[#161d18] px-4 py-3 text-[#161d18]"
              >
                Load Buses
              </button>
            </div>
          ) : (
            <ShowBusesSection />
          )}
        </div>
      </div>
    </main>
  )
}