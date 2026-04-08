import { createClient } from '@/lib/supabase/server'

export async function createAdminSessionService(userId: string) {
  const supabase = await createClient()

  const { error: deactivateError } = await supabase
    .from('admin_sessions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('is_active', true)

  if (deactivateError) {
    return {
      success: false,
      message: deactivateError.message || 'Failed to deactivate old admin sessions',
    }
  }

  const expiresAt = new Date(Date.now() + 10000 * 60 * 1000).toISOString()

  const { error: insertError } = await supabase
    .from('admin_sessions')
    .insert({
      user_id: userId,
      expires_at: expiresAt,
      is_active: true,
    })

  if (insertError) {
    return {
      success: false,
      message: insertError.message || 'Failed to create admin session',
    }
  }

  return {
    success: true,
    message: 'Admin session created successfully',
  }
}