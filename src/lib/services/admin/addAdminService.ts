import { createAdminClient } from '@/lib/supabase/admin'

type AddAdminParams = {
  firstName: string
  lastName: string
  email: string
}

type AddAdminResult =
  | {
      success: true
      statusCode: number
      message: string
      data: {
        id: string
        firstName: string
        lastName: string
        email: string
      }
    }
  | {
      success: false
      statusCode: number
      message: string
    }

export async function addAdminService(
  params: AddAdminParams
): Promise<AddAdminResult> {
  try {
    const supabase = await createAdminClient()

    const firstName = params.firstName.trim()
    const lastName = params.lastName.trim()
    const email = params.email.trim().toLowerCase()

    if (!firstName || !lastName || !email) {
      return {
        success: false,
        statusCode: 400,
        message: 'First name, last name and email are required',
      }
    }

    // Check if admin profile email already exists
    const { data: existingAdmin, error: existingAdminError } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingAdminError) {
      return {
        success: false,
        statusCode: 500,
        message: existingAdminError.message || 'Failed to check existing admin',
      }
    }

    if (existingAdmin) {
      return {
        success: false,
        statusCode: 409,
        message: 'Admin with this email already exists',
      }
    }

    // Create invited auth user
    const { data: invitedUserData, error: inviteError } =
      await supabase.auth.admin.inviteUserByEmail(email)

    if (inviteError || !invitedUserData.user) {
      return {
        success: false,
        statusCode: 500,
        message: inviteError?.message || 'Failed to invite admin user',
      }
    }

    const userId = invitedUserData.user.id

    const { error: roleError } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: 'admin',
    })

    if (roleError) {
      return {
        success: false,
        statusCode: 500,
        message: roleError.message || 'Failed to create admin role',
      }
    }

    const { error: profileError } = await supabase.from('admin_profiles').insert({
      id: userId,
      first_name: firstName,
      last_name: lastName,
      email,
    })

    if (profileError) {
      return {
        success: false,
        statusCode: 500,
        message: profileError.message || 'Failed to create admin profile',
      }
    }

    return {
      success: true,
      statusCode: 201,
      message: 'Admin added successfully',
      data: {
        id: userId,
        firstName,
        lastName,
        email,
      },
    }
  } catch (error) {
    console.error('addAdminService error:', error)

    return {
      success: false,
      statusCode: 500,
      message: 'Internal server error',
    }
  }
}