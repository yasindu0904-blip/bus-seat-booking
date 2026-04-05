import { createClient } from '@/lib/supabase/server'

type CreateCustomerProfileInput = {
  fullName: string
  phoneNumber: string
}

export async function createCustomerProfileService({
  fullName,
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

    const { data, error } = await supabase
      .from('customer_profiles')
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName,
          phone_number: phoneNumber,
          profile_completed: true,
        },
        { onConflict: 'id' }
      )
      .select()
      .single()

    if (error) {
      console.error('customer_profiles upsert error:', error)

      return {
        success: false,
        statusCode: 500,
        message: error.message || 'Failed to save profile',
      }
    }

    return {
      success: true,
      statusCode: 200,
      data,
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