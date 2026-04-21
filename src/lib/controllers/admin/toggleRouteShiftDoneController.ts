import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { toggleRouteShiftDoneService } from '@/lib/services/admin/toggleRouteShiftDoneService'

export async function toggleRouteShiftDoneController(request: Request) {
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

    const { routes_id, trip_date, shift, done } = body

    if (!routes_id || !trip_date || !shift || typeof done !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          message: 'routes_id, trip_date, shift and done are required',
        },
        {
          status: 400,
        }
      )
    }

    const result = await toggleRouteShiftDoneService({
      routesId: routes_id,
      tripDate: trip_date,
      shift: Number(shift),
      done,
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
    console.error('toggleRouteShiftDoneController error:', error)

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