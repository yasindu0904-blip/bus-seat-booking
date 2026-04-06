import type { SupabaseClient } from '@supabase/supabase-js'

export type AppRole = 'admin' | 'customer'

type GetUserRoleResult =
  | {
      success: true
      role: AppRole | null
    }
  | {
      success: false
      message: string
    }

export async function getUserRole(
  supabase: SupabaseClient,
  userId: string
): Promise<GetUserRoleResult> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('user_roles fetch error:', error)

    return {
      success: false,
      message: error.message || 'Failed to fetch user role',
    }
  }

  return {
    success: true,
    role: (data?.role as AppRole | null) ?? null,
  }
}