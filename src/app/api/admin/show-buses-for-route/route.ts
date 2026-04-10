import { showBusesForRouteController } from '@/lib/controllers/admin/showBusesForRouteController'

export async function GET(request: Request) {
  return showBusesForRouteController(request)
}