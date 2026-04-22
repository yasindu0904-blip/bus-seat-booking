import { createBusSeatsForShiftsController } from '@/lib/controllers/admin/createBusSeatsForShiftsController'

export async function POST(request: Request) {
  return createBusSeatsForShiftsController(request)
}