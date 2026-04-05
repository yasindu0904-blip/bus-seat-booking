import { NextRequest } from 'next/server'
import { authCallbackController } from '@/lib/controllers/auth/callback.controller'

export async function GET(request: NextRequest) {
  return authCallbackController(request)
}