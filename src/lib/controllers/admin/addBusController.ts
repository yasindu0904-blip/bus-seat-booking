import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { addBusService } from '@/lib/services/admin/addBusService'

export async function addBusController(request: Request) {
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
    const { busNumber, seatCount } = body

    const result = await addBusService({
      busNumber,
      seatCount: Number(seatCount),
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
    console.error('addBusController error:', error)

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