import { createClient } from '@/lib/supabase/server'

type ShowBusesServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        id: string
        bus_number: string
        seat_count: number | null
        created_at: string
      }[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function showBusesService(): Promise<ShowBusesServiceResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('buses')
      .select('id, bus_number, seat_count, created_at')
      .order('created_at', { ascending: false })

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