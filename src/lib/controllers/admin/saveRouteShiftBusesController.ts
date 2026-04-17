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

  try {
    const body = await request.json()

    const { routes_id, trip_date, shifts } = body

    if (!routes_id || !trip_date || !Array.isArray(shifts)) {
      return NextResponse.json(
        {
          success: false,
          message: 'routes_id, trip_date and shifts are required',
        },
        {
          status: 400,
        }
      )
    }

    const result = await saveRouteShiftBusesService({
      routesId: routes_id,
      tripDate: trip_date,
      shifts,
    })

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
      },
      {
        status: result.statusCode,
      }
    )
  } catch (error) {
    console.error('saveRouteShiftBusesController error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request body',
      },
      {
        status: 400,
      }
    )
  }
}