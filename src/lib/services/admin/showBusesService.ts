import { createClient } from '@/lib/supabase/server'

type ShowBusesParams = {
  busNumber?: string
  startingLocation?: string
  routeName?: string
}

type BusRow = {
  id: string
  bus_number: string
  seat_count: number | null
  created_at: string
  routes: {
    id: string
    route_name: string
    start_location: string
  } | null
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
        start_location: string
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

    let routeIds: string[] | null = null

    if (startingLocation || routeName) {
      let routeQuery = supabase.from('routes').select('id')

      if (startingLocation) {
        routeQuery = routeQuery.ilike('start_location', `%${startingLocation}%`)
      }

      if (routeName) {
        routeQuery = routeQuery.ilike('route_name', `%${routeName}%`)
      }

      const { data: matchingRoutes, error: routeError } = await routeQuery

      if (routeError) {
        return {
          success: false,
          statusCode: 500,
          message: routeError.message || 'Failed to find routes',
        }
      }

      routeIds = (matchingRoutes || []).map((route) => route.id)

      if (routeIds.length === 0) {
        return {
          success: true,
          statusCode: 200,
          message: 'No buses found',
          data: [],
        }
      }
    }

    let busQuery = supabase
      .from('buses')
      .select(
        `
        id,
        bus_number,
        seat_count,
        created_at,
        routes:routes_id (
          id,
          route_name,
          start_location
        )
      `
      )
      .order('created_at', { ascending: false })

    if (busNumber) {
      busQuery = busQuery.ilike('bus_number', `%${busNumber}%`)
    }

    if (routeIds) {
      busQuery = busQuery.in('routes_id', routeIds)
    }

    const { data, error } = await busQuery

    if (error) {
      console.error('showBusesService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch buses',
      }
    }

    const buses = ((data || []) as unknown as BusRow[]).map((bus) => ({
      id: bus.id,
      bus_number: bus.bus_number,
      seat_count: bus.seat_count,
      start_location: bus.routes?.start_location || '-',
      route_name: bus.routes?.route_name || '-',
      created_at: bus.created_at,
    }))

    return {
      success: true,
      statusCode: 200,
      message: 'Buses fetched successfully',
      data: buses,
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