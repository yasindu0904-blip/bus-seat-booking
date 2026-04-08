import { addRouteController } from '@/lib/controllers/admin/addRouteController'

export async function POST(request: Request) {
  return addRouteController(request)
}