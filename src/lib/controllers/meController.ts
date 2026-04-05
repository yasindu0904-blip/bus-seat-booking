import { NextRequest, NextResponse } from 'next/server'
import { getMeService } from '@/lib/services/meService'

export async function getMeController(request: NextRequest) {
  try {
    const result = await getMeService()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: result.statusCode }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User details fetched successfully',
        data: result.data,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('getMeController error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}