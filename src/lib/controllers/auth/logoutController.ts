import { NextResponse } from 'next/server'
import { logoutService } from '@/lib/services/auth/logoutService'

export async function logoutController(request: Request) {
  const result = await logoutService()

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: result.message,
      },
      { status: 500 }
    )
  }

  return NextResponse.redirect(new URL('/login', request.url))
}