import { createClient } from '@/lib/supabase/server'

type ShiftInput = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
}

type SaveRouteShiftBusesParams = {
  routesId: string
  tripDate: string
  shifts: ShiftInput[]
}

type SaveRouteShiftBusesServiceResult =
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

export async function saveRouteShiftBusesService(
  params: SaveRouteShiftBusesParams
): Promise<SaveRouteShiftBusesServiceResult> {
  try {
    const supabase = await createClient()

    const { routesId, tripDate, shifts } = params

    const validShifts = shifts
      .filter((item) => item.bus_number && item.bus_number.trim() !== '')
      .map((item) => ({
        routes_id: routesId,
        trip_date: tripDate,
        shift: Number(item.shift),
        bus_number: item.bus_number!.trim(),
      }))

    if (validShifts.length === 0) {
      return {
        success: false,
        statusCode: 400,
        message: 'Please select at least one bus',
      }
    }

    const invalidShift = validShifts.find(
      (item) => ![1, 2, 3, 4].includes(item.shift)
    )

    if (invalidShift) {
      return {
        success: false,
        statusCode: 400,
        message: 'Shift must be 1, 2, 3 or 4',
      }
    }

    const busNumbers = [...new Set(validShifts.map((item) => item.bus_number))]

    const { data: buses, error: busesError } = await supabase
      .from('buses')
      .select('bus_number, routes_id')
      .in('bus_number', busNumbers)

    if (busesError) {
      console.error('validate buses error:', busesError)

      return {
        success: false,
        statusCode: 500,
        message: busesError.message || 'Failed to validate buses',
      }
    }

    if (!buses || buses.length !== busNumbers.length) {
      return {
        success: false,
        statusCode: 400,
        message: 'One or more selected buses do not exist',
      }
    }

    const wrongRouteBus = buses.find((bus) => bus.routes_id !== routesId)

    if (wrongRouteBus) {
      return {
        success: false,
        statusCode: 400,
        message: 'One or more selected buses do not belong to this route',
      }
    }

    const { error: upsertError } = await supabase.from('routes_bus').upsert(
      validShifts,
      {
        onConflict: 'trip_date,shift,routes_id',
      }
    )

    if (upsertError) {
      console.error('saveRouteShiftBusesService error:', upsertError)

      return {
        success: false,
        statusCode: 500,
        message: upsertError.message || 'Failed to save route shift buses',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Route shift buses saved successfully',
    }
  } catch (error) {
    console.error('saveRouteShiftBusesService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}