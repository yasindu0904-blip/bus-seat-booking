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

    let firstName: string | null = null
    let lastName: string | null = null
    let phoneNumber: string | null = null
    let profileCompleted = false

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

      firstName = customerProfile?.first_name ?? null
      lastName = customerProfile?.last_name ?? null
      phoneNumber = customerProfile?.phone_number ?? null
      profileCompleted = customerProfile?.profile_completed ?? false
    }

    if (role === 'admin') {
      const { data: adminProfile, error: adminProfileError } = await supabase
        .from('admin_profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .maybeSingle()

      if (adminProfileError) {
        console.error('admin_profiles fetch error:', adminProfileError)

        return {
          success: false,
          statusCode: 500,
          message: adminProfileError.message || 'Failed to fetch admin profile',
        }
      }

      firstName = adminProfile?.first_name ?? null
      lastName = adminProfile?.last_name ?? null
      profileCompleted = true
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        uid: user.id,
        email: user.email ?? null,
        role,
        firstName,
        lastName,
        phoneNumber,
        profileCompleted,
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