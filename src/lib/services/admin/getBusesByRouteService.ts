import { createClient } from '@/lib/supabase/server'

type GetBusesByRouteParams = {
  routesId: string
}

type BusItem = {
  bus_number: string
  seat_count: number | null
}

type GetBusesByRouteServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: BusItem[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function getBusesByRouteService(
  params: GetBusesByRouteParams
): Promise<GetBusesByRouteServiceResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('buses')
      .select('bus_number, seat_count')
      .eq('routes_id', params.routesId)
      .order('bus_number', { ascending: true })

    if (error) {
      console.error('getBusesByRouteService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch buses for route',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Buses fetched successfully',
      data: data || [],
    }
  } catch (error) {
    console.error('getBusesByRouteService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}