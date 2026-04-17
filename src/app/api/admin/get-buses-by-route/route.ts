import { getBusesByRouteController } from '@/lib/controllers/admin/getBusesByRouteController'

export async function GET(request: Request) {
  return getBusesByRouteController(request)
}