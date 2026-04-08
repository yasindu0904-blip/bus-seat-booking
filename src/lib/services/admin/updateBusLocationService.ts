import { createClient } from '@/lib/supabase/server'

type UpdateBusLocationParams = {
  busId: string
  nowLocation: string
}

type UpdateBusLocationServiceResult =
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

export async function updateBusLocationService(
  params: UpdateBusLocationParams
): Promise<UpdateBusLocationServiceResult> {
  try {
    const { busId, nowLocation } = params

    if (!busId || !nowLocation) {
      return {
        success: false,
        statusCode: 400,
        message: 'Bus id and now location are required',
      }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('buses')
      .update({ now_location: nowLocation })
      .eq('id', busId)

    if (error) {
      console.error('updateBusLocationService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to update bus location',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Bus location updated successfully',
    }
  } catch (error) {
    console.error('updateBusLocationService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}