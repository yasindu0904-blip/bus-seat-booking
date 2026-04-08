import { updateBusLocationController } from '@/lib/controllers/admin/updateBusLocationController'

export async function PATCH(request: Request) {
  return updateBusLocationController(request)
}