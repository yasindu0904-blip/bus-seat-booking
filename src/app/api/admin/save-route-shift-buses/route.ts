import { saveRouteShiftBusesController } from '@/lib/controllers/admin/saveRouteShiftBusesController'

export async function POST(request: Request) {
  return saveRouteShiftBusesController(request)
}