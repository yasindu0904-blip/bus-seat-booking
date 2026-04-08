import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { updateBusLocationService } from '@/lib/services/admin/updateBusLocationService'

export async function updateBusLocationController(request: Request) {
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
    const { busId, nowLocation } = body

    const result = await updateBusLocationService({
      busId,
      nowLocation,
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
    console.error('updateBusLocationController error:', error)

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