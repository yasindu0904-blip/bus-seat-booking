import { toggleRouteShiftDoneController } from '@/lib/controllers/admin/toggleRouteShiftDoneController'

export async function PATCH(request: Request) {
  return toggleRouteShiftDoneController(request)
}