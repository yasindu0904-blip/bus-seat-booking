import { getRouteShiftBusesController } from '@/lib/controllers/admin/getRouteShiftBusesController'


export async function GET(request: Request) {
  return getRouteShiftBusesController(request)
}

