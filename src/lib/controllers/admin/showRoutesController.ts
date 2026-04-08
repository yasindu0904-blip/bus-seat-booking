import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { showRoutesService } from '@/lib/services/admin/showRoutesService'

export async function showRoutesController(_request: Request) {
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

  const result = await showRoutesService()

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