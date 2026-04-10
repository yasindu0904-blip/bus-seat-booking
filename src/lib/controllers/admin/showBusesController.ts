import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { showBusesService } from '@/lib/services/admin/showBusesService'

export async function showBusesController(request: Request) {
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

  const busNumber = searchParams.get('busNumber')?.trim() || ''
  const startingLocation = searchParams.get('startingLocation')?.trim() || ''
  const routeName = searchParams.get('routeName')?.trim() || ''

  if (!busNumber && !startingLocation && !routeName) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please fill bus number or starting location or route name',
      },
      {
        status: 400,
      }
    )
  }

  const result = await showBusesService({
    busNumber,
    startingLocation,
    routeName,
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