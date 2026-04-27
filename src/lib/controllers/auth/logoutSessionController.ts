import { NextResponse } from 'next/server'
import { logoutSessionService } from '@/lib/services/auth/logoutSessionService'

export async function logoutSessionController(_request: Request) {
  const result = await logoutSessionService()

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
    },
    {
      status: result.statusCode,
    }
  )
}