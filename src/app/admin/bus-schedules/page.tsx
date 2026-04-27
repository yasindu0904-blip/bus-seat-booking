import AddBusesByTimePeriodForm from './components/AddBusesByTimePeriodForm'
import AdminHeader from '@/components/admin/AdminHeader'

export default function BusSchedulesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <AdminHeader />
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Bus Schedules
        </h1>

        <AddBusesByTimePeriodForm />
      </div>
    </main>
  )
}