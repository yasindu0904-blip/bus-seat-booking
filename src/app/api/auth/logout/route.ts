import { logoutController } from '@/lib/controllers/auth/logoutController'

export async function GET(request: Request) {
  return logoutController(request)
}