import { createClient } from '@/lib/supabase/server'

type ShiftInput = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
}

type SaveRouteShiftBusesParams = {
  routeName: string
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
    const { routeName, tripDate, shifts } = params

    const normalizedShifts = [1, 2, 3, 4].map((shift) => {
      const found = shifts.find((item) => Number(item.shift) === shift)

      return {
        shift,
        bus_number: found?.bus_number?.trim() || null,
      }
    })

    const busNumbers = normalizedShifts
      .map((item) => item.bus_number)
      .filter((item): item is string => !!item)

    const uniqueBusNumbers = new Set(busNumbers)

    if (uniqueBusNumbers.size !== busNumbers.length) {
      return {
        success: false,
        statusCode: 400,
        message: 'Same bus cannot be selected more than once',
      }
    }

    if (busNumbers.length > 0) {
      const { data: buses, error: busesError } = await supabase
        .from('buses')
        .select('bus_number, route_name')
        .in('bus_number', busNumbers)

      if (busesError) {
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

      const invalidBus = buses.find((bus) => bus.route_name !== routeName)

      if (invalidBus) {
        return {
          success: false,
          statusCode: 400,
          message: 'Selected bus does not belong to the selected route',
        }
      }
    }

    const { error: deleteError } = await supabase
      .from('routes_bus')
      .delete()
      .eq('route_name', routeName)
      .eq('trip_date', tripDate)

    if (deleteError) {
      return {
        success: false,
        statusCode: 500,
        message: deleteError.message || 'Failed to clear old shift buses',
      }
    }

    const rowsToInsert = normalizedShifts
      .filter((item) => item.bus_number)
      .map((item) => ({
        route_name: routeName,
        trip_date: tripDate,
        shift: item.shift,
        bus_number: item.bus_number as string,
      }))

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('routes_bus')
        .insert(rowsToInsert)

      if (insertError) {
        return {
          success: false,
          statusCode: 500,
          message: insertError.message || 'Failed to save shift buses',
        }
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Shift buses saved successfully',
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