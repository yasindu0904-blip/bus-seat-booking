import AdminHeader from '@/components/admin/AdminHeader'
import Link from 'next/link'

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-200 text-[#161d18]">
      <div className="mx-auto min-h-screen w-full max-w-7xl px-6 py-6">
        <AdminHeader />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/admin/routes"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Add Routes</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage travel routes.
            </p>
          </Link>

          <Link
            href="/admin/admins"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Add Admins</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create new admin accounts and profiles.
            </p>
          </Link>

          <Link
            href="/admin/bus-schedules"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Add Buses by Time Period</h2>
            <p className="mt-2 text-sm text-gray-600">
              Assign buses to morning, afternoon, and evening trips.
            </p>
          </Link>

          <Link
            href="/admin/buses"
            className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">Add Bus Numbers</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create bus records and maintain fleet details.
            </p>
          </Link>
        </section>
      </div>
    </main>
  )
}