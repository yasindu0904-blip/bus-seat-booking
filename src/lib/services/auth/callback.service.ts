import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/getUserRole'
import { createAdminSessionService } from './createAdminSessionService'

export async function exchangeMagicLinkCodeService(code: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return {
        success: false,
        error: 'Failed to get logged in user',
      }
    }

    const roleResult = await getUserRole(supabase, user.id)

    if (!roleResult.success) {
      return {
        success: false,
        error: roleResult.message,
      }
    }

    if (roleResult.role === 'admin') {
      const adminSessionResult = await createAdminSessionService(user.id)

      if (!adminSessionResult.success) {
        return {
          success: false,
          error: adminSessionResult.message,
        }
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    console.error('exchangeMagicLinkCodeService error:', error)

    return {
      success: false,
      error: 'Internal server error',
    }
  }
}