import { createClient } from '@/lib/supabase/server'

type AddRouteParams = {
  routeName: string
  startLocation: string
}

type AddRouteResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        id: string
        routeName: string
        startLocation: string
      }
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function addRouteService(
  params: AddRouteParams
): Promise<AddRouteResult> {
  try {
    const supabase = await createClient()

    const routeName = params.routeName?.trim()
    const startLocation = params.startLocation?.trim()

    if (!routeName || !startLocation) {
      return {
        success: false,
        statusCode: 400,
        message: 'Route name and start location are required',
      }
    }

    const { data: existingRoute } = await supabase
        .from('routes')
        .select('id')
        .eq('route_name', routeName)
        .eq('start_location', startLocation)
        .maybeSingle()

    if (existingRoute) {
    return {
        success: false,
        statusCode: 409,
        message: 'This route already exists',
    }
    }

    const { data, error } = await supabase
      .from('routes')
      .insert({
        route_name: routeName,
        start_location: startLocation,
      })
      .select('id, route_name, start_location')
      .single()

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to add route',
      }
    }

    return {
      success: true,
      statusCode: 201,
      message: 'Route added successfully',
      data: {
        id: data.id,
        routeName: data.route_name,
        startLocation: data.start_location,
      },
    }
  } catch (error) {
    console.error('addRouteService error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}