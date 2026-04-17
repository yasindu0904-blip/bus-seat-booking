import { getRouteShiftBusNumbersController } from '@/lib/controllers/admin/getRouteShiftBusNumbersController'

export async function GET(request: Request) {
  return getRouteShiftBusNumbersController(request)
}