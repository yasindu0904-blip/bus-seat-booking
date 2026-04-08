import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { updateBusBookedStatusService } from '@/lib/services/admin/updateBusBookedStatusService'

export async function updateBusBookedStatusController(request: Request) {
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
    const { busId, booked } = body

    const result = await updateBusBookedStatusService({
      busId,
      booked: Boolean(booked),
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
    console.error('updateBusBookedStatusController error:', error)

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