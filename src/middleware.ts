import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getUserRole } from '@/lib/auth/getUserRole'
import { validateAdminSessionService } from '@/lib/services/auth/validateAdminSessionService'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isCustomerArea =
    pathname.startsWith('/complete-profile') || pathname.startsWith('/dashboard')

  const isAdminArea = pathname.startsWith('/admin')

  if (!user) {
    if (isCustomerArea || isAdminArea) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return response
  }

  const roleResult = await getUserRole(supabase, user.id)

  if (!roleResult.success) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = roleResult.role



  if (!role) {
    if (pathname == '/complete-profile') {
      return response
    }

    return NextResponse.redirect(new URL('/complete-profile', request.url))      
  }

if (role === 'admin') {
  const adminSessionResult = await validateAdminSessionService(supabase, user.id)

  if (!adminSessionResult.success || !adminSessionResult.valid) {
    return NextResponse.redirect(new URL('/api/auth/logout', request.url))
  }

  if (
    pathname === '/login' ||
    pathname === '/complete-profile' ||
    pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/admin/admin-dashboard', request.url))
  }

  return response
}

  const { data: profile, error: profileError } = await supabase
    .from('customer_profiles')
    .select('first_name, last_name, phone_number, profile_completed')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('customer_profiles fetch error:', profileError)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isProfileComplete =
    !!profile &&
    !!profile.first_name &&
    !!profile.last_name &&
    !!profile.phone_number &&
    profile.profile_completed === true

  if (pathname === '/login') {
    if (isProfileComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/complete-profile', request.url))
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/complete-profile') {
    if (isProfileComplete) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  if (pathname.startsWith('/dashboard')) {
    if (!isProfileComplete) {
      return NextResponse.redirect(new URL('/complete-profile', request.url))
    }

    return response
  }

  return response
}

export const config = {
  matcher: ['/login', '/complete-profile', '/dashboard/:path*', '/admin/:path*'],
}