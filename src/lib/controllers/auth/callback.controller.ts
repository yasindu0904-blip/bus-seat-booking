import { NextRequest, NextResponse } from 'next/server'
import { exchangeMagicLinkCodeService } from '@/lib/services/auth/callback.service'

export async function authCallbackController(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/complete-profile'

  console.log('callback hit')

  if (!next.startsWith('/')) {
    next = '/complete-profile'
  }

  if (!code) {
    console.log('No code found in callback')
    return NextResponse.redirect(new URL('/login', origin))
  }

  const result = await exchangeMagicLinkCodeService(code)

  console.log('exchange error =', result.error)

  if (!result.success) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  return NextResponse.redirect(new URL(next, origin))
}