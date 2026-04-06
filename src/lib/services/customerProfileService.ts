import { createClient } from '@/lib/supabase/server'

type CreateCustomerProfileInput = {
  firstName: string
  lastName: string
  phoneNumber: string
}

export async function createCustomerProfileService({
  firstName,
  lastName,
  phoneNumber,
}: CreateCustomerProfileInput) {
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

    const { data: profileData, error: profileError } = await supabase
      .from('customer_profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          profile_completed: true,
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (profileError) {
      console.error('customer_profiles upsert error:', profileError)

      return {
        success: false,
        statusCode: 500,
        message: profileError.message || 'Failed to save profile',
      }
    }

    const { error: roleError } = await supabase.from('user_roles').upsert(
      {
        user_id: user.id,
        role: 'customer',
      },
      { onConflict: 'user_id' }
    )

    if (roleError) {
      console.error('user_roles upsert error:', roleError)

      return {
        success: false,
        statusCode: 500,
        message: roleError.message || 'Failed to save user role',
      }
    }

    return {
      success: true,
      statusCode: 200,
      data: {
        ...profileData,
        role: 'customer',
      },
    }
  } catch (error) {
    console.error('createCustomerProfileService error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}