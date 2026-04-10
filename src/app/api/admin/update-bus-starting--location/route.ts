import { updateBusStartingLocationController } from '@/lib/controllers/admin/updateBusStartingLocationController'

export async function PATCH(request: Request) {
  return updateBusStartingLocationController(request)
}