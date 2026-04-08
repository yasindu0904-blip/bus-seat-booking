import { updateBusBookedStatusController } from '@/lib/controllers/admin/updateBusBookedStatusController'

export async function PATCH(request: Request) {
  return updateBusBookedStatusController(request)
}