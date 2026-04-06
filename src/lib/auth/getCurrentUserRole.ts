import { createClient } from '@/lib/supabase/server'
import { getUserRole, type AppRole } from '@/lib/auth/getUserRole'

type GetCurrentUserRoleResult =
  | {
      success: true
      user: {
        id: string
        email: string | null
      }
      role: AppRole | null
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function getCurrentUserRole(): Promise<GetCurrentUserRoleResult> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
      }
    }

    const roleResult = await getUserRole(supabase, user.id)

    if (!roleResult.success) {
      return {
        success: false,
        statusCode: 500,
        message: roleResult.message,
      }
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email ?? null,
      },
      role: roleResult.role,
    }
  } catch (error) {
    console.error('getCurrentUserRole error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}