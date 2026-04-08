import { createClient } from '@/lib/supabase/server'

type ShowRoutesServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        id: string
        route_name: string
        start_location: string
        end_location: string
        created_at: string
      }[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function showRoutesService(): Promise<ShowRoutesServiceResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('routes')
      .select('id, route_name, start_location, end_location, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('showRoutesService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch routes',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Routes fetched successfully',
      data: data || [],
    }
  } catch (error) {
    console.error('showRoutesService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}