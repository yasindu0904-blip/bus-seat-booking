import { createClient } from '@/lib/supabase/server'

type ShowBusesParams = {
  busNumber?: string
  startingLocation?: string
  routeName?: string
}

type ShowBusesServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        id: string
        bus_number: string
        seat_count: number | null
        bus_starting_location: string | null
        route_name: string
        created_at: string
      }[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function showBusesService(
  params: ShowBusesParams
): Promise<ShowBusesServiceResult> {
  try {
    const supabase = await createClient()
    const { busNumber, startingLocation, routeName } = params

    let query = supabase
      .from('buses')
      .select('id, bus_number, seat_count, bus_starting_location, route_name, created_at')
      .order('created_at', { ascending: false })

    if (busNumber) {
      query = query.ilike('bus_number', `%${busNumber}%`)
    }

    if (startingLocation) {
      query = query.ilike('bus_starting_location', `%${startingLocation}%`)
    }

    if (routeName) {
      query = query.ilike('route_name', `%${routeName}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('showBusesService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch buses',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Buses fetched successfully',
      data: data || [],
    }
  } catch (error) {
    console.error('showBusesService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}