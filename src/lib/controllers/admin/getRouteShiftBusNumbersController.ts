import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getRouteShiftBusNumbersService } from '@/lib/services/admin/getRouteShiftBusNumbersService'

export async function getRouteShiftBusNumbersController(request: Request) {
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

  const routesId = searchParams.get('routes_id')?.trim() || ''
  const tripDate = searchParams.get('trip_date')?.trim() || ''

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

  const result = await getRouteShiftBusNumbersService({
    routesId,
    tripDate,
  })

  return NextResponse.json(
    {
      success: result.success,
      message: result.message,
      data: result.success ? result.data : undefined,
    },
    {
      status: result.statusCode,
    }
  )
}