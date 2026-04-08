import { createClient } from '@/lib/supabase/server'

type AddBusParams = {
  busNumber: string
  seatCount: number
  nowLocation: string
}

type AddBusServiceResult =
  | {
      success: true
      statusCode: number
      message: string
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function addBusService(
  params: AddBusParams
): Promise<AddBusServiceResult> {
  try {
    const { busNumber, seatCount, nowLocation } = params

    if (!busNumber || !seatCount || !nowLocation) {
      return {
        success: false,
        statusCode: 400,
        message: 'Bus number, seat count and now location are required',
      }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('buses').insert({
      bus_number: busNumber,
      seat_count: seatCount,
      now_location: nowLocation,
    })

    if (error) {
      console.error('addBusService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to add bus',
      }
    }

    return {
      success: true,
      statusCode: 201,
      message: 'Bus added successfully',
    }
  } catch (error) {
    console.error('addBusService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}