import { createClient } from '@/lib/supabase/server'

type AddBusParams = {
  busNumber: string
  seatCount: number
  startingLocation: string
  routeName: string
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
    const { busNumber, seatCount, startingLocation, routeName } = params

    if (!busNumber || !seatCount || !startingLocation || !routeName) {
      return {
        success: false,
        statusCode: 400,
        message:
          'Bus number, seat count, starting location and route name are required',
      }
    }

    const supabase = await createClient()

    const { data: route, error: routeError } = await supabase
      .from('routes')
      .select('id')
      .eq('route_name', routeName)
      .eq('start_location', startingLocation)
      .maybeSingle()

    if (routeError) {
      console.error('find route error:', routeError)

      return {
        success: false,
        statusCode: 500,
        message: routeError.message || 'Failed to find route',
      }
    }

    if (!route) {
      return {
        success: false,
        statusCode: 404,
        message: 'No route found for this route name and starting location',
      }
    }

    const { error: insertError } = await supabase.from('buses').insert({
      bus_number: busNumber,
      seat_count: seatCount,
      routes_id: route.id,
    })

    if (insertError) {
      console.error('addBusService error:', insertError)

      return {
        success: false,
        statusCode: 500,
        message: insertError.message || 'Failed to add bus',
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