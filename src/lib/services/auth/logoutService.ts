import { createClient } from '@/lib/supabase/server'
import { getUserRole } from '@/lib/auth/getUserRole'

export async function logoutService() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const roleResult = await getUserRole(supabase, user.id)

    if (roleResult.success && roleResult.role === 'admin') {
      await supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true)
    }
  }

  const { error } = await supabase.auth.signOut()

  if (error) {
    return {
      success: false,
      message: error.message || 'Logout failed',
    }
  }

  return {
    success: true,
    message: 'Logged out successfully',
  }
}