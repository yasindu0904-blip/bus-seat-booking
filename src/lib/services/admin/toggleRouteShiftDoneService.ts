import { createClient } from '@/lib/supabase/server'

type ToggleRouteShiftDoneParams = {
  routesId: string
  tripDate: string
  shift: number
  done: boolean
}

type ToggleRouteShiftDoneServiceResult =
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

export async function toggleRouteShiftDoneService(
  params: ToggleRouteShiftDoneParams
): Promise<ToggleRouteShiftDoneServiceResult> {
  try {
    const supabase = await createClient()
    const { routesId, tripDate, shift, done } = params

    if (![1, 2, 3, 4].includes(shift)) {
      return {
        success: false,
        statusCode: 400,
        message: 'Shift must be 1, 2, 3 or 4',
      }
    }

    const { data: existingRow, error: findError } = await supabase
      .from('routes_bus')
      .select('trip_date, shift')
      .eq('routes_id', routesId)
      .eq('trip_date', tripDate)
      .eq('shift', shift)
      .maybeSingle()

    if (findError) {
      console.error('toggleRouteShiftDoneService find error:', findError)

      return {
        success: false,
        statusCode: 500,
        message: findError.message || 'Failed to find route shift row',
      }
    }

    if (!existingRow) {
      return {
        success: false,
        statusCode: 404,
        message: 'No saved row found for this route, date and shift',
      }
    }

    const { error: updateError } = await supabase
      .from('routes_bus')
      .update({ done })
      .eq('routes_id', routesId)
      .eq('trip_date', tripDate)
      .eq('shift', shift)

    if (updateError) {
      console.error('toggleRouteShiftDoneService update error:', updateError)

      return {
        success: false,
        statusCode: 500,
        message: updateError.message || 'Failed to update done status',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: done ? 'Marked as done' : 'Marked as not done',
    }
  } catch (error) {
    console.error('toggleRouteShiftDoneService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}