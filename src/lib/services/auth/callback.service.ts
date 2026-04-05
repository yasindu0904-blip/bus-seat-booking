import { createClient } from '@/lib/supabase/server'

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