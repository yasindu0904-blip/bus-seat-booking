import { createClient } from '@/lib/supabase/server'

type ShowBusesParams = {
  busNumber?: string
  nowLocation?: string
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
        now_location: string | null
        booked: boolean
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
    const { busNumber, nowLocation } = params

    let query = supabase
      .from('buses')
      .select('id, bus_number, seat_count, now_location, booked, created_at')
      .order('created_at', { ascending: false })

    if (busNumber) {
      query = query.ilike('bus_number', `%${busNumber}%`)
    }

    if (nowLocation) {
      query = query.ilike('now_location', `%${nowLocation}%`)
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