import { addBusController } from '@/lib/controllers/admin/addBusController'

export async function POST(request: Request) {
  return addBusController(request)
}