import AddBusesByTimePeriodForm from './components/AddBusesByTimePeriodForm'


export default function AddBusesByTimePeriodPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Add Buses by Time Period
        </h1>

        <AddBusesByTimePeriodForm />
      </div>
    </main>
  )
}