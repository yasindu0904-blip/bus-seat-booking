import { createClient } from '@/lib/supabase/server'

type UpdateBusStartingLocationParams = {
  busId: string
  startingLocation: string
}

type UpdateBusStartingLocationServiceResult =
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

export async function updateBusStartingLocationService(
  params: UpdateBusStartingLocationParams
): Promise<UpdateBusStartingLocationServiceResult> {
  try {
    const { busId, startingLocation } = params

    if (!busId || !startingLocation) {
      return {
        success: false,
        statusCode: 400,
        message: 'Bus id and starting location are required',
      }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('buses')
      .update({ starting_location: startingLocation })
      .eq('id', busId)

    if (error) {
      console.error('updateBusStartingLocationService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to update bus starting location',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Bus starting location updated successfully',
    }
  } catch (error) {
    console.error('updateBusStartingLocationService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}