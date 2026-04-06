import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/getUserRole'

export async function getMeService() {
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

    const role = roleResult.role

    let profile = null

    if (role === 'customer') {
      const { data: customerProfile, error: profileError } = await supabase
        .from('customer_profiles')
        .select('first_name, last_name, phone_number, profile_completed')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError) {
        console.error('customer_profiles fetch error:', profileError)

        return {
          success: false,
          statusCode: 500,
          message: profileError.message || 'Failed to fetch profile',
        }
      }

      profile = customerProfile
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        uid: user.id,
        email: user.email ?? null,
        role,
        firstName: profile?.first_name ?? null,
        lastName: profile?.last_name ?? null,
        phoneNumber: profile?.phone_number ?? null,
        profileCompleted: profile?.profile_completed ?? false,
      },
    }
  } catch (error) {
    console.error('getMeService error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}