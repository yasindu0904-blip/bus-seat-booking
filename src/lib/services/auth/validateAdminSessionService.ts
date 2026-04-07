import type { SupabaseClient } from '@supabase/supabase-js'

type ValidateAdminSessionResult =
  | {
      success: true
      valid: true
      message: string
    }
  | {
      success: true
      valid: false
      message: string
    }
  | {
      success: false
      valid: false
      message: string
    }

export async function validateAdminSessionService(
  supabase: SupabaseClient,
  userId: string
): Promise<ValidateAdminSessionResult> {
  const { data: adminSession, error } = await supabase
    .from('admin_sessions')
    .select('id, expires_at, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('started_at', { ascending: false })
    .maybeSingle()

  if (error) {
    return {
      success: false,
      valid: false,
      message: error.message || 'Failed to fetch admin session',
    }
  }

  if (!adminSession) {
    return {
      success: true,
      valid: false,
      message: 'No active admin session found',
    }
  }

  const isExpired = new Date(adminSession.expires_at).getTime() <= Date.now()

  if (isExpired) {
    await supabase
      .from('admin_sessions')
      .update({ is_active: false })
      .eq('id', adminSession.id)

    return {
      success: true,
      valid: false,
      message: 'Admin session expired',
    }
  }

  return {
    success: true,
    valid: true,
    message: 'Admin session is valid',
  }
}