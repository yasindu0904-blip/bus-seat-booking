import { createClient } from '@/lib/supabase/server'

type GetRouteShiftBusesParams = {
  routeName: string
  tripDate: string
}

type ShiftBusItem = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
}

type GetRouteShiftBusesServiceResult =
  | {
      success: true
      statusCode: number
      message: string
      data: ShiftBusItem[]
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function getRouteShiftBusesService(
  params: GetRouteShiftBusesParams
): Promise<GetRouteShiftBusesServiceResult> {
  try {
    const supabase = await createClient()
    const { routeName, tripDate } = params

    const { data, error } = await supabase
      .from('routes_bus')
      .select('shift, bus_number')
      .eq('route_name', routeName)
      .eq('trip_date', tripDate)
      .order('shift', { ascending: true })

    if (error) {
      console.error('getRouteShiftBusesService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch shift buses',
      }
    }

    const shiftMap = new Map<number, string>()

    for (const item of data || []) {
      shiftMap.set(item.shift, item.bus_number)
    }

    const shifts: ShiftBusItem[] = [1, 2, 3, 4].map((shift) => ({
      shift: shift as 1 | 2 | 3 | 4,
      bus_number: shiftMap.get(shift) ?? null,
    }))

    return {
      success: true,
      statusCode: 200,
      message: 'Shift buses fetched successfully',
      data: shifts,
    }
  } catch (error) {
    console.error('getRouteShiftBusesService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}