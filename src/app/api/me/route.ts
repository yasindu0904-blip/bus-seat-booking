import { NextRequest } from 'next/server'
import { getMeController } from '@/lib/controllers/meController'

export async function GET(request: NextRequest) {
  return getMeController(request)
}