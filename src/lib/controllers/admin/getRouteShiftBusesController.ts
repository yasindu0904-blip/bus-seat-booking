import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getRouteShiftBusesService } from '@/lib/services/admin/getRouteShiftBusesService'

export async function getRouteShiftBusesController(request: Request) {
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

  const routesId = searchParams.get('routes_id')
  const tripDate = searchParams.get('trip_date')

  if (!routesId || !tripDate) {
    return NextResponse.json(
      {
        success: false,
        message: 'routes_id and trip_date are required',
      },
      {
        status: 400,
      }
    )
  }

  const result = await getRouteShiftBusesService({
    routesId,
    tripDate,
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
      data: result.data,
    },
    {
      status: result.statusCode,
    }
  )
}