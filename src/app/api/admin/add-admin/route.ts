import { addAdminController } from '@/lib/controllers/admin/addAdminController'

export async function POST(request: Request) {
  return addAdminController(request)
}