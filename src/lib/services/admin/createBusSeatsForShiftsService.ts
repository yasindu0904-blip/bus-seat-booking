import { createClient } from '@/lib/supabase/server'

type ShiftInput = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
  seat_count: number | null
}

type CreateBusSeatsForShiftsParams = {
  routesId: string
  tripDate: string
  shifts: ShiftInput[]
}

type CreateBusSeatsForShiftsResult =
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

export async function createBusSeatsForShiftsService(
  params: CreateBusSeatsForShiftsParams
): Promise<CreateBusSeatsForShiftsResult> {
  try {
    const supabase = await createClient()
    const { routesId, tripDate, shifts } = params

    const validShifts = shifts.filter(
      (item) =>
        item.bus_number &&
        item.bus_number.trim() !== '' &&
        Number(item.seat_count) > 0
    )

    if (validShifts.length === 0) {
      return {
        success: true,
        statusCode: 200,
        message: 'No bus seats created because no buses were selected',
      }
    }

    for (const shiftItem of validShifts) {
      const shift = Number(shiftItem.shift)
      const seatCount = Number(shiftItem.seat_count)

      if (![1, 2, 3, 4].includes(shift)) {
        return {
          success: false,
          statusCode: 400,
          message: `Invalid shift ${shift}`,
        }
      }

      if (!seatCount || seatCount <= 0) {
        return {
          success: false,
          statusCode: 400,
          message: `Seat count is missing or invalid for shift ${shift}`,
        }
      }

      const { error: deleteError } = await supabase
        .from('bus_seats')
        .delete()
        .eq('routes_id', routesId)
        .eq('trip_date', tripDate)
        .eq('shift', shift)

      if (deleteError) {
        console.error(
          'createBusSeatsForShiftsService deleteError:',
          deleteError
        )

        return {
          success: false,
          statusCode: 500,
          message: deleteError.message || 'Failed to reset previous bus seats',
        }
      }

      const seatRows = Array.from({ length: seatCount }, (_, index) => ({
        routes_id: routesId,
        trip_date: tripDate,
        shift,
        seat_number: index + 1,
        bus_seats_customer_id: null,
        end_location: null,
      }))

      const { error: insertError } = await supabase
        .from('bus_seats')
        .insert(seatRows)

      if (insertError) {
        console.error(
          'createBusSeatsForShiftsService insertError:',
          insertError
        )

        return {
          success: false,
          statusCode: 500,
          message: insertError.message || 'Failed to create bus seats',
        }
      }
    }

    return {
      success: true,
      statusCode: 201,
      message: 'Bus seat rows created successfully',
    }
  } catch (error) {
    console.error('createBusSeatsForShiftsService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}