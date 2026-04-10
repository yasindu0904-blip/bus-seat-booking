import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { showBusesForRouteService } from '@/lib/services/admin/showBusesForRouteService'

export async function showBusesForRouteController(request: Request) {
  const adminCheck = await requireAdmin()

  if (!adminCheck.success) {
    return NextResponse.json(
      {
        success: false,
        message: adminCheck.message,
      },
      {
        status: adminCheck.statusCode,
      }
    )
  }

  const { searchParams } = new URL(request.url)
  const routeName = searchParams.get('route_name')

  if (!routeName) {
    return NextResponse.json(
      {
        success: false,
        message: 'route_name is required',
      },
      {
        status: 400,
      }
    )
  }

  const result = await showBusesForRouteService({ routeName })

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: result.message,
      },
      {
        status: result.statusCode,
      }
    )
  }

  return NextResponse.json(
    {
      success: true,
      message: result.message,
      data: result.data,
    },
    {
      status: result.statusCode,
    }
  )
}