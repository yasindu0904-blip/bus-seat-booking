import { showBusesController } from '@/lib/controllers/admin/showBusesController'

export async function GET(request: Request) {
  return showBusesController(request)
}