import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { getBusesByRouteService } from '@/lib/services/admin/getBusesByRouteService'

export async function getBusesByRouteController(request: Request) {
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

  if (!routesId) {
    return NextResponse.json(
      {
        success: false,
        message: 'routes_id is required',
      },
      {
        status: 400,
      }
    )
  }

  const result = await getBusesByRouteService({
    routesId,
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