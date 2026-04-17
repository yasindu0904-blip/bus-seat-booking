import { createClient } from '@/lib/supabase/server'

type GetRouteShiftBusNumbersParams = {
  routesId: string
  tripDate: string
}

type ShiftBusItem = {
  shift: 1 | 2 | 3 | 4
  bus_number: string | null
  done: boolean
}

type GetRouteShiftBusNumbersServiceResult =
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

export async function getRouteShiftBusNumbersService(
  params: GetRouteShiftBusNumbersParams
): Promise<GetRouteShiftBusNumbersServiceResult> {
  try {
    const supabase = await createClient()
    const { routesId, tripDate } = params

    const { data, error } = await supabase
      .from('routes_bus')
      .select('shift, bus_number, done')
      .eq('routes_id', routesId)
      .eq('trip_date', tripDate)
      .order('shift', { ascending: true })

    if (error) {
      console.error('getRouteShiftBusNumbersService error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to fetch shift bus numbers',
      }
    }

    const shiftMap = new Map<
      number,
      {
        bus_number: string | null
        done: boolean
      }
    >()

    for (const item of data || []) {
      shiftMap.set(Number(item.shift), {
        bus_number: item.bus_number ?? null,
        done: item.done ?? false,
      })
    }

    const shifts: ShiftBusItem[] = [1, 2, 3, 4].map((shift) => {
      const savedShift = shiftMap.get(shift)

      return {
        shift: shift as 1 | 2 | 3 | 4,
        bus_number: savedShift?.bus_number ?? null,
        done: savedShift?.done ?? false,
      }
    })

    return {
      success: true,
      statusCode: 200,
      message: 'Shift bus numbers fetched successfully',
      data: shifts,
    }
  } catch (error) {
    console.error('getRouteShiftBusNumbersService unexpected error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}