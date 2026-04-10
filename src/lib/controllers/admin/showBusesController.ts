import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { showBusesService } from '@/lib/services/admin/showBusesService'

export async function showBusesController(_request: Request) {
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

  const { searchParams } = new URL(_request.url)

  const busNumber = searchParams.get('busNumber')?.trim() || ''
  const nowLocation = searchParams.get('nowLocation')?.trim() || ''

  if (!busNumber && !nowLocation) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please fill bus number or now location',
      },
      {
        status: 400,
      }
    )
  }

  const result = await showBusesService({
    busNumber,
    nowLocation,
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