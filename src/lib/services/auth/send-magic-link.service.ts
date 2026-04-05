import { createClient } from '@/lib/supabase/server'

type SendMagicLinkParams = {
  email: string
}

type SendMagicLinkResult =
  | { success: true; message: string }
  | { success: false; message: string }

export async function sendMagicLinkService(
  params: SendMagicLinkParams
): Promise<SendMagicLinkResult> {
  const { email } = params

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:3000/api/auth/callback',
    },
  })

  if (error) {
    return {
      success: false,
      message: error.message || 'Failed to send magic link.',
    }
  }

  return {
    success: true,
    message: 'Magic link sent successfully. Please check your email.',
  }
}