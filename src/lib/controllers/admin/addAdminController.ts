import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth/requireAdmin'
import { addAdminService } from '@/lib/services/admin/addAdminService'

export async function addAdminController(request: Request) {
  try {
    const adminCheck = await requireAdmin()

    if (!adminCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: adminCheck.message,
        },
        { status: adminCheck.statusCode }
      )
    }

    const body = await request.json()

    const result = await addAdminService({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    })

    return NextResponse.json(
      {
        success: result.success,
        message: result.message,
        ...(result.success ? { data: result.data } : {}),
      },
      { status: result.statusCode }
    )
  } catch (error) {
    console.error('addAdminController error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}