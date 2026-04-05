import { sendMagicLinkService } from '@/lib/services/auth/send-magic-link.service'

type SendMagicLinkBody = {
  email?: string
}

const emailCooldownMap = new Map<string, number>()
const COOLDOWN_MS = 60 * 1000

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function sendMagicLinkController(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as SendMagicLinkBody
    const email = body.email?.trim().toLowerCase()

    if (!email) {
      return Response.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return Response.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const now = Date.now()
    const lastSentAt = emailCooldownMap.get(email)

    if (lastSentAt && now - lastSentAt < COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((COOLDOWN_MS - (now - lastSentAt)) / 1000)

      return Response.json(
        {
          success: false,
          message: `Please wait ${remainingSeconds} seconds before requesting another magic link.`,
        },
        { status: 429 }
      )
    }

    const result = await sendMagicLinkService({ email })

    if (!result.success) {
      return Response.json(
        { success: false, message: result.message },
        { status: 400 }
      )
    }

    emailCooldownMap.set(email, now)

    return Response.json(
      { success: true, message: result.message },
      { status: 200 }
    )
  } catch {
    return Response.json(
      { success: false, message: 'Invalid request body.' },
      { status: 400 }
    )
  }
}