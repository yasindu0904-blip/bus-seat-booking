import { createClient } from '@/lib/supabase/server'

type ShowBusesForRouteParams = {
  routeName: string
}

type ShowBusesForRouteServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        bus_number: string
        bus_starting_location: string | null
        route_name: string
      }[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function showBusesForRouteService(
  params: ShowBusesForRouteParams
): Promise<ShowBusesForRouteServiceResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('buses')
      .select('bus_number, bus_starting_location, route_name')
      .eq('route_name', params.routeName)
      .order('bus_number', { ascending: true })

    if (error) {
      console.error('showBusesForRouteService error:', error)

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
    console.error('showBusesForRouteService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}