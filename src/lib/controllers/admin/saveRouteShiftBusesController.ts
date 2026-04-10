import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { saveRouteShiftBusesService } from '@/lib/services/admin/saveRouteShiftBusesService'

export async function saveRouteShiftBusesController(request: Request) {
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

  const body = await request.json()

  const { route_name, trip_date, shifts } = body ?? {}

  if (!route_name || !trip_date || !Array.isArray(shifts)) {
    return NextResponse.json(
      {
        success: false,
        message: 'route_name, trip_date and shifts are required',
      },
      {
        status: 400,
      }
    )
  }

  const result = await saveRouteShiftBusesService({
    routeName: route_name,
    tripDate: trip_date,
    shifts,
  })

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
    },
    {
      status: result.statusCode,
    }
  )
}