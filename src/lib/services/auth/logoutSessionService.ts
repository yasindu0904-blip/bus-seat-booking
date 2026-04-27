import { createClient } from '@/lib/supabase/server'

type LogoutSessionServiceResult =
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

export async function logoutSessionService(): Promise<LogoutSessionServiceResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Logout failed',
      }
    }

    return {
      success: true,
      statusCode: 200,
      message: 'Logged out successfully',
    }
  } catch (error) {
    console.error('logoutSessionService error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}