import { NextRequest, NextResponse } from 'next/server'
import { createCustomerProfileService } from '@/lib/services/customerProfileService'

export async function createCustomerProfileController(request: NextRequest) {
  try {
    const body = await request.json()
    const firstName = body.firstName?.trim()
    const lastName = body.lastName?.trim()
    const phoneNumber = body.phoneNumber?.trim()

    if (!firstName || !lastName || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: 'First name, last name, and phone number are required',
        },
        { status: 400 }
      )
    }

    const result = await createCustomerProfileService({
      firstName,
      lastName,
      phoneNumber,
    })

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
        message: 'Profile saved successfully',
        data: result.data,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('createCustomerProfileController error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}