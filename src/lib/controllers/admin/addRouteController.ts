import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { addRouteService } from '@/lib/services/admin/addRouteService'

export async function addRouteController(request: Request) {
  try {
    const adminCheck = await requireAdmin()

    if (!adminCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: adminCheck.message,
        },
        { status: adminCheck.statusCode }
      )
    }

    const body = await request.json()

    const result = await addRouteService({
      routeName: body.routeName,
      startLocation: body.startLocation,
      endLocation: body.endLocation,
    })

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        ...(result.success ? { data: result.data } : {}),
      },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('addRouteController error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}