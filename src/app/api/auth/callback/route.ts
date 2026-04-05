import { NextRequest } from 'next/server'
import { authCallbackController } from '@/lib/controllers/authCallbackController'

export async function GET(request: NextRequest) {
  return authCallbackController(request)
}