import { showRoutesController } from '@/lib/controllers/admin/showRoutesController'

export async function GET(request: Request) {
  return showRoutesController(request)
}