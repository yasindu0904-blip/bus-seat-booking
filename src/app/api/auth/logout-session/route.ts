import { logoutSessionController } from '@/lib/controllers/auth/logoutSessionController'

export async function POST(request: Request) {
  return logoutSessionController(request)
}