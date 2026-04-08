import { createClient } from '@/lib/supabase/server'

type UpdateBusBookedStatusParams = {
  busId: string
  booked: boolean
}

type UpdateBusBookedStatusServiceResult =
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

export async function updateBusBookedStatusService(
  params: UpdateBusBookedStatusParams
): Promise<UpdateBusBookedStatusServiceResult> {
  try {
    const { busId, booked } = params

    if (!busId) {
      return {
        success: false,
        statusCode: 400,
        message: 'Bus id is required',
      }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('buses')
      .update({ booked })
      .eq('id', busId)

    if (error) {
      console.error('updateBusBookedStatusService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to update bus booked status',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Bus booked status updated successfully',
    }
  } catch (error) {
    console.error('updateBusBookedStatusService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}